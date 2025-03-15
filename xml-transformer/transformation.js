const path = require('path');
const fs = require('fs-extra');
const SaxonJS = require('saxon-js');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class XmlTransformer {
    constructor(directories) {
        this.directories = directories;
        this.ensureDirectories();
    }

    // Ensure directories exist
    ensureDirectories() {
        Object.values(this.directories).forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        console.log('Verzeichnisse erstellt/überprüft:', Object.values(this.directories));
    }

    // Funktion zum Finden der XSLT-Datei
    async findXsltFile() {
        const possiblePaths = [
            path.join(this.directories.xslt, '46.xslt'),
            path.join(process.cwd(), 'XSLT', '46.xslt'),
            path.join(process.cwd(), '..', 'xml-transformer', 'XSLT', '46.xslt'),
            path.resolve(process.cwd(), '..', 'XSLT', '46.xslt')
        ];

        console.log('Suche XSLT-Datei in folgenden Pfaden:', possiblePaths);

        for (const xsltPath of possiblePaths) {
            if (await fs.pathExists(xsltPath)) {
                console.log('XSLT-Datei gefunden in:', xsltPath);
                return xsltPath;
            }
        }

        throw new Error('XSLT-Datei konnte in keinem der Verzeichnisse gefunden werden');
    }

    // XSLT zu SEF kompilieren
    async compileToSEF(xsltPath) {
        try {
            const sefPath = path.join(this.directories.sef, path.basename(xsltPath, '.xslt') + '.sef.json');
            console.log('Versuche SEF zu erstellen:', sefPath);

            if (await fs.pathExists(sefPath)) {
                const xsltStat = await fs.stat(xsltPath);
                const sefStat = await fs.stat(sefPath);

                if (xsltStat.mtime <= sefStat.mtime) {
                    console.log('SEF ist aktuell:', sefPath);
                    return sefPath;
                }
            }

            console.log('Kompiliere XSLT zu SEF...');
            const xslt3Path = await this.findXslt3Compiler();
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

    // Finde xslt3 Compiler
    async findXslt3Compiler() {
        const possiblePaths = [
            path.join(process.cwd(), 'node_modules', '.bin', 'xslt3'),
            path.join(process.cwd(), '..', 'node_modules', '.bin', 'xslt3'),
            path.resolve(process.cwd(), '..', 'node_modules', '.bin', 'xslt3'),
            'xslt3'
        ];

        console.log('Mögliche xslt3 Compiler Pfade:', possiblePaths);

        for (const testPath of possiblePaths) {
            try {
                await fs.access(testPath);
                console.log('Gefundener xslt3 Compiler:', testPath);
                return testPath;
            } catch (e) {
                console.log('Pfad nicht gefunden:', testPath);
            }
        }

        throw new Error('xslt3 Compiler konnte nicht gefunden werden');
    }

    // XSLT-Transformation durchführen
    async transformXML(inputFile, outputFile, sefPath) {
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

            // Nachträgliche Anreicherung: Rights-Element nach Language-Element einfügen
            transformedContent = this.enrichXmlContent(transformedContent);

            await fs.writeFile(outputFile, transformedContent);
            console.log('Transformation erfolgreich:', outputFile);

            return true;
        } catch (error) {
            console.error('Fehler bei der Transformation:', error);
            throw error;
        }
    }

    // Methode zur Anreicherung des XML-Inhalts
    enrichXmlContent(xmlContent) {
        // Rights-Element nach Language-Element einfügen
        const rightsElement = '<rights rightsURI="http://creativecommons.org/licenses/by/4.0/">CC BY 4.0</rights>';

        // Prüfen, ob bereits ein rights-Element existiert
        if (xmlContent.includes('<rights')) {
            console.log('Rights-Element bereits vorhanden, keine Ergänzung nötig');
            return xmlContent;
        }

        // Einfügen nach dem Language-Element
        return xmlContent.replace(
            /(<language>[^<]*<\/language>)/,
            '$1\n   ' + rightsElement
        );
    }

    // Haupttransformationsmethode
    async transformFiles(files) {
        try {
            const xsltPath = await this.findXsltFile();
            console.log('Verwende XSLT-Datei:', xsltPath);

            const sefPath = await this.compileToSEF(xsltPath);

            const transformationResults = await Promise.all(
                files.map(async (file) => {
                    try {
                        const outputFileName = `transformed-${file.originalname}`;
                        const outputFile = path.join(this.directories.transform, outputFileName);

                        await this.transformXML(file.path, outputFile, sefPath);

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

            return transformationResults;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = XmlTransformer;