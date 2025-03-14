const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const XmlTransformer = require('./transformation');

const app = express();

// Konstanten für Verzeichnisse definieren
const directories = {
    xslt: path.resolve(__dirname, 'XSLT'),
    upload: path.join(os.tmpdir(), 'datacite-uploads'),
    transform: path.join(os.tmpdir(), 'datacite-transformed'),
    sef: path.join(os.tmpdir(), 'datacite-sef')
};

// Initialisiere Transformer
const transformer = new XmlTransformer(directories);

// Konfiguration für multer (Datei-Upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.ensureDirSync(directories.upload);
        cb(null, directories.upload);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route für File-Upload und Transformation
app.post('/transform', upload.array('xmlFiles'), async (req, res) => {
    try {
        const files = req.files;
        console.log('Empfangene Dateien:', files?.map(f => f.originalname));

        if (!files || files.length === 0) {
            throw new Error('Keine Dateien zum Transformieren empfangen');
        }

        const results = await transformer.transformFiles(files);

        res.json({
            message: 'Transformation abgeschlossen',
            results: results
        });

    } catch (error) {
        console.error('Transform route error:', error);
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
    const filePath = path.join(directories.transform, sanitizedFilename);

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
    console.log(`- XSLT Verzeichnis: ${directories.xslt}`);
    console.log(`- Upload Verzeichnis: ${directories.upload}`);
    console.log(`- Transform Verzeichnis: ${directories.transform}`);
    console.log(`- SEF Verzeichnis: ${directories.sef}`);
});