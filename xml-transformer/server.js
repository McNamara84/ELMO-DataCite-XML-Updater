const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const SaxonJS = require('saxon-js');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const os = require('os');

const app = express();

// Konstanten für Verzeichnisse definieren
const XSLT_DIR = path.join(__dirname, 'xslt');
const UPLOAD_DIR = path.join(os.tmpdir(), 'datacite-uploads');
const TRANSFORM_DIR = path.join(os.tmpdir(), 'datacite-transformed');
const SEF_DIR = path.join(os.tmpdir(), 'datacite-sef');

// Konfiguration für multer (Datei-Upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.ensureDirSync(UPLOAD_DIR);
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Ensure directories exist
function ensureDirectories() {
    const dirs = [XSLT_DIR, UPLOAD_DIR, TRANSFORM_DIR, SEF_DIR];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    console.log('Verzeichnisse erstellt/überprüft:', dirs);
}

// Initialize directories
ensureDirectories();

// XSLT zu SEF kompilieren
async function compileToSEF(xsltPath) {
    try {
        const sefPath = path.join(SEF_DIR, path.basename(xsltPath, '.xslt') + '.sef.json');
        console.log('Versuche SEF zu erstellen:', sefPath);

        // Prüfen ob SEF bereits existiert und aktuell ist
        if (await fs.pathExists(sefPath)) {
            const xsltStat = await fs.stat(xsltPath);
            const sefStat = await fs.stat(sefPath);

            if (xsltStat.mtime <= sefStat.mtime) {
                console.log('SEF ist aktuell:', sefPath);
                return sefPath;
            }
        }

        console.log('Kompiliere XSLT zu SEF...');
        console.log('XSLT Pfad:', xsltPath);

        // xslt3 Compiler aufrufen
        const xslt3Path = path.resolve(__dirname, '..', 'node_modules', '.bin', 'xslt3');
        const command = `"${xslt3Path}" -xsl:"${xsltPath}" -export:"${sefPath}"`;

        console.log('Ausführe Befehl:', command);
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
        console.log('Input:', inputFile);
        console.log('Output:', outputFile);
        console.log('SEF:', sefPath);

        const xmlContent = await fs.readFile(inputFile, 'utf8');
        console.log('XML eingelesen, Länge:', xmlContent.length);

        const result = await SaxonJS.transform({
            stylesheetFileName: sefPath,
            sourceText: xmlContent,
            destination: "serialized"
        }, "async");

        let transformedContent = result.principalResult;
        transformedContent = transformedContent.replace(
            /xsi:schemaLocation="http:\/\/datacite.org\/schema\/kernel-4 (?:file:\/\/\/)?.*?metadata.xsd"/,
            'xsi:schemaLocation="http://datacite.org/schema/kernel-4 https://schema.datacite.org/meta/kernel-4/metadata.xsd"'
        );

        await fs.writeFile(outputFile, transformedContent);
        console.log('Transformation erfolgreich:', outputFile);

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
        console.log('Empfangene Dateien:', files?.map(f => f.originalname));

        if (!files || files.length === 0) {
            throw new Error('Keine Dateien zum Transformieren empfangen');
        }

        const xsltPath = path.join(XSLT_DIR, '46.xslt');
        console.log('XSLT Pfad:', xsltPath);
        console.log('XSLT existiert:', await fs.pathExists(xsltPath));

        if (!await fs.pathExists(xsltPath)) {
            throw new Error(`XSLT-Datei nicht gefunden: ${xsltPath}`);
        }

        const sefPath = await compileToSEF(xsltPath);
        const transformationResults = await Promise.all(
            files.map(async (file) => {
                try {
                    const outputFileName = `transformed-${file.originalname}`;
                    const outputFile = path.join(TRANSFORM_DIR, outputFileName);

                    await transformXML(file.path, outputFile, sefPath);

                    return {
                        originalName: file.originalname,
                        status: 'success',
                        transformedPath: outputFileName
                    };
                } catch (error) {
                    console.error('Transformation error for:', file.originalname, error);
                    return {
                        originalName: file.originalname,
                        status: 'error',
                        error: error.message
                    };
                }
            })
        );

        // Cleanup uploaded files
        await Promise.all(files.map(file => fs.remove(file.path)));

        res.json({
            message: 'Transformation abgeschlossen',
            results: transformationResults
        });

    } catch (error) {
        console.error('Transform route error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: 'Fehler bei der Transformation',
            details: error.message
        });
    }
});

// Download-Route für transformierte Dateien
app.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(TRANSFORM_DIR, sanitizedFilename);

    try {
        if (await fs.pathExists(filePath)) {
            res.download(filePath, sanitizedFilename, (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                // Datei nach dem Download löschen
                fs.remove(filePath).catch(err => {
                    console.error('Error removing file:', err);
                });
            });
        } else {
            res.status(404).json({ error: 'Datei nicht gefunden' });
        }
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Fehler beim Download' });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Server error',
        details: err.message
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server Status:');
    console.log(`- Port: ${PORT}`);
    console.log(`- Arbeitsverzeichnis: ${process.cwd()}`);
    console.log(`- XSLT Verzeichnis: ${XSLT_DIR}`);
    console.log(`- Upload Verzeichnis: ${UPLOAD_DIR}`);
    console.log(`- Transform Verzeichnis: ${TRANSFORM_DIR}`);
    console.log(`- SEF Verzeichnis: ${SEF_DIR}`);
});