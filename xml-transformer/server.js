const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const SaxonJS = require('saxon-js');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();

// Konfiguration für multer (Datei-Upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        fs.ensureDirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Statische Dateien korrekt servieren
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.css') {
            res.set('Content-Type', 'text/css');
        }
    }
}));

// XSLT zu SEF kompilieren
async function compileToSEF(xsltPath) {
    try {
        // SEF-Dateiname generieren
        const sefPath = xsltPath.replace('.xslt', '.sef.json');

        // Prüfen ob SEF bereits existiert
        if (await fs.pathExists(sefPath)) {
            // Prüfen ob XSLT neuer ist als SEF
            const xsltStat = await fs.stat(xsltPath);
            const sefStat = await fs.stat(sefPath);

            if (xsltStat.mtime <= sefStat.mtime) {
                console.log('SEF ist aktuell, keine Neukompilierung nötig');
                return sefPath;
            }
        }

        console.log('Kompiliere XSLT zu SEF...');

        // xslt3 Compiler aufrufen - ohne -t Option
        const xslt3Path = path.join('node_modules', '.bin', 'xslt3');
        const command = `"${xslt3Path}" -xsl:"${xsltPath}" -export:"${sefPath}"`;

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error('Compiler Warnung:', stderr);
        }

        console.log('Compiler Ausgabe:', stdout);

        if (!await fs.pathExists(sefPath)) {
            throw new Error('SEF-Datei wurde nicht erstellt');
        }

        return sefPath;
    } catch (error) {
        console.error('Fehler bei der SEF-Kompilierung:', error);
        throw error;
    }
}

// XSLT-Transformation durchführen
async function transformXML(inputFile, outputFile, sefPath) {
    try {
        console.log('Starte Transformation...');
        console.log('Input File:', inputFile);
        console.log('Output File:', outputFile);
        console.log('SEF Path:', sefPath);

        // XML einlesen
        const xmlContent = await fs.readFile(inputFile, 'utf8');

        // Transformation durchführen
        const result = await SaxonJS.transform({
            stylesheetFileName: sefPath,
            sourceText: xmlContent,
            destination: "serialized"
        }, "async");

        // Schema-Referenz korrigieren
        let transformedContent = result.principalResult;
        transformedContent = transformedContent.replace(
            /xsi:schemaLocation="http:\/\/datacite.org\/schema\/kernel-4 file:\/\/\/.*?metadata.xsd"/,
            'xsi:schemaLocation="http://datacite.org/schema/kernel-4 https://schema.datacite.org/meta/kernel-4/metadata.xsd"'
        );

        // Korrigiertes Ergebnis in Datei schreiben
        await fs.writeFile(outputFile, transformedContent);
        console.log('Transformation erfolgreich abgeschlossen');

        return true;
    } catch (error) {
        console.error('Fehler bei der Transformation:', error);
        throw error;
    }
}

// Route für File-Upload und Transformation
app.post('/transform', upload.array('xmlFiles'), async (req, res) => {
    try {
        const files = req.files;
        const version = req.body.version;

        console.log('Empfangene Dateien:', files.map(f => f.originalname));

        // Ausgabeverzeichnis erstellen
        const outputDir = path.join(__dirname, 'transformed');
        fs.ensureDirSync(outputDir);

        // XSLT-Pfad
        const xsltPath = path.join(__dirname, 'xslt', '46.xslt');

        if (!await fs.pathExists(xsltPath)) {
            throw new Error(`XSLT-Datei nicht gefunden: ${xsltPath}`);
        }

        // XSLT zu SEF kompilieren
        const sefPath = await compileToSEF(xsltPath);

        // Alle Dateien transformieren
        const transformationResults = await Promise.all(
            files.map(async (file) => {
                const outputFileName = `transformed-${file.originalname}`;  // Nur der Dateiname
                const outputFile = path.join(outputDir, outputFileName);

                try {
                    await transformXML(file.path, outputFile, sefPath);

                    return {
                        originalName: file.originalname,
                        status: 'success',
                        // Hier nur den Dateinamen zurückgeben, nicht den vollständigen Pfad
                        transformedPath: outputFileName
                    };
                } catch (error) {
                    return {
                        originalName: file.originalname,
                        status: 'error',
                        error: error.message
                    };
                }
            })
        );

        // Cleanup: Upload-Dateien löschen
        await Promise.all(files.map(file => fs.remove(file.path)));

        res.json({
            message: 'Transformation abgeschlossen',
            results: transformationResults
        });

    } catch (error) {
        console.error('Fehler bei der Verarbeitung:', error);
        res.status(500).json({
            error: 'Fehler bei der Transformation',
            details: error.message
        });
    }
});

// Download-Route für transformierte Dateien
app.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;
    // Sicherheitscheck: Stellen Sie sicher, dass keine Pfad-Traversierung möglich ist
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(__dirname, 'transformed', sanitizedFilename);

    try {
        if (await fs.pathExists(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ error: 'Datei nicht gefunden' });
        }
    } catch (error) {
        console.error('Fehler beim Download:', error);
        res.status(500).json({ error: 'Fehler beim Download' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
    console.log('XSLT Pfad:', path.join(__dirname, 'xslt', '46.xslt'));
});