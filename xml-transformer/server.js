const express = require('express');
const multer = require('multer');
const path = require('path');
const SaxonJS = require('saxon-js');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Statische Dateien servieren
app.use(express.static('public'));

// Route für File-Upload und Transformation
app.post('/transform', upload.array('xmlFiles'), async (req, res) => {
    try {
        const files = req.files;
        const version = req.body.version;

        // Hier kommt später die XSLT-Transformation
        // Für jeden File in files werden wir die Transformation durchführen

        res.json({ message: 'Transformation completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});