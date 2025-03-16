const path = require('path');
const fs = require('fs-extra');
const SaxonJS = require('saxon-js');
const { exec } = require('child_process');
const util = require('util');
const axios = require('axios');
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
    async transformXML(inputFile, outputFile, sefPath, options) {
        try {
            console.log('Starte Transformation...');
            console.log('Input:', inputFile);
            console.log('Output:', outputFile);
            console.log('SEF:', sefPath);
            console.log('Optionen:', options);

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

            // Nachträgliche Anreicherung mit Rights und ROR-IDs
            transformedContent = await this.enrichXmlContent(transformedContent, options);

            await fs.writeFile(outputFile, transformedContent);
            console.log('Transformation erfolgreich:', outputFile);

            return true;
        } catch (error) {
            console.error('Fehler bei der Transformation:', error);
            throw error;
        }
    }


    // Methode zur Anreicherung des XML-Inhalts
    async enrichXmlContent(xmlContent, options) {
        // Rights-Element nach Language-Element einfügen, wenn Option aktiviert
        if (options.addRights) {
            const rightsElement = '<rights rightsURI="http://creativecommons.org/licenses/by/4.0/">CC BY 4.0</rights>';

            // Prüfen, ob bereits ein rights-Element existiert
            if (xmlContent.includes('<rights')) {
                console.log('Rights-Element bereits vorhanden, wird ersetzt');
                // Ersetze vorhandenes Rights-Element
                xmlContent = xmlContent.replace(
                    /<rights[^>]*>.*?<\/rights>/,
                    rightsElement
                );
            } else {
                // Einfügen nach dem Language-Element
                xmlContent = xmlContent.replace(
                    /(<language>[^<]*<\/language>)/,
                    '$1\n   ' + rightsElement
                );
                console.log('Rights-Element hinzugefügt');
            }
        }

        // Affiliationen mit ROR-IDs anreichern, wenn Option aktiviert
        if (options.enrichRor) {
            console.log('Anreicherung mit ROR-IDs (Schwellenwert:', options.similarityThreshold, ')');
            this.similarityThreshold = options.similarityThreshold;
            xmlContent = await this.enrichAffiliations(xmlContent);
        }

        return xmlContent;
    }

    // Methode zur Anreicherung von Affiliationen mit ROR-IDs
    async enrichAffiliations(xmlContent) {
        const affiliationRegex = /<affiliation(?!\s+affiliationIdentifier)([^>]*)>(.*?)<\/affiliation>/g;

        // Alle Affiliationen ohne ROR-ID finden
        const affiliationsToProcess = [];
        let match;

        // Alle zu verarbeitenden Affiliationen sammeln
        while ((match = affiliationRegex.exec(xmlContent)) !== null) {
            affiliationsToProcess.push({
                fullMatch: match[0],
                attributes: match[1],
                name: match[2].trim()
            });
        }

        console.log(`${affiliationsToProcess.length} Affiliationen ohne ROR-ID gefunden`);

        // Für jede Affiliation die ROR-ID suchen und ersetzen
        for (const affiliation of affiliationsToProcess) {
            try {
                const rorId = await this.findRorId(affiliation.name);

                if (rorId) {
                    console.log(`ROR-ID für "${affiliation.name}" gefunden: ${rorId}`);

                    // Neues Affiliation-Element mit ROR-ID erstellen
                    const newAffiliation = `<affiliation${affiliation.attributes} affiliationIdentifierScheme="ROR" schemeURI="https://ror.org/" affiliationIdentifier="https://ror.org/${rorId}">${affiliation.name}</affiliation>`;

                    // Im XML-Inhalt ersetzen
                    xmlContent = xmlContent.replace(affiliation.fullMatch, newAffiliation);
                } else {
                    console.log(`Keine ROR-ID für "${affiliation.name}" gefunden`);
                }
            } catch (error) {
                console.error(`Fehler bei der ROR-Abfrage für "${affiliation.name}":`, error);
            }
        }

        return xmlContent;
    }

    // Methode zum Abfragen der ROR-API und Finden der passendsten ROR-ID
    async findRorId(affiliationName) {
        try {
            // URL-Kodierung des Namens für die API-Anfrage
            const encodedName = encodeURIComponent(affiliationName);
            const apiUrl = `https://api.ror.org/organizations?query=${encodedName}`;

            console.log(`ROR-API Anfrage: ${apiUrl}`);

            const response = await axios.get(apiUrl);
            const data = response.data;

            // Prüfe, ob die Antwort die erwartete Struktur hat
            console.log(`${data.number_of_results} Ergebnisse gefunden`);

            // Wenn keine Ergebnisse gefunden wurden
            if (!data.items || data.items.length === 0) {
                console.log("Keine Items in der Antwort gefunden");
                return null;
            }

            // Das erste (beste) Ergebnis nehmen
            const bestMatch = data.items[0];
            console.log(`Bester Treffer: ${bestMatch.name} (ID: ${bestMatch.id})`);

            // Prüfen, ob der Name der Organisation hinreichend ähnlich ist
            // Hier eine einfache Übereinstimmungsbewertung
            const nameMatch = this.calculateSimilarity(affiliationName.toLowerCase(), bestMatch.name.toLowerCase());
            console.log(`Namensähnlichkeit: ${nameMatch}`);

            // Schwellenwert für die Namensähnlichkeit
            if (nameMatch < this.similarityThreshold) {
                console.log(`Ähnlichkeit zu niedrig (${nameMatch}) für "${affiliationName}" mit "${bestMatch.name}"`);

                // Versuche, in den Aliases zu suchen
                const aliasMatch = bestMatch.aliases.some(alias =>
                    this.calculateSimilarity(normalizedName, alias.toLowerCase()) >= this.similarityThreshold
                );

                if (!aliasMatch) {
                    return null;
                }
            }

            // ROR-ID aus der vollständigen URL extrahieren
            const rorId = bestMatch.id.replace('https://ror.org/', '');

            console.log(`Beste Übereinstimmung für "${affiliationName}": "${bestMatch.name}" (ID: ${rorId})`);

            return rorId;
        } catch (error) {
            console.error('Fehler bei der ROR-API Anfrage:', error);
            return null;
        }
    }

    // Hilfsmethode zur Berechnung der Ähnlichkeit zwischen zwei Strings
    calculateSimilarity(s1, s2) {
        // Einfache Ähnlichkeitsberechnung: Levenshtein-Distanz
        // Hier vereinfacht mit einer Funktion zur Berechnung der Überlappung von Wörtern

        const words1 = s1.split(/\s+/);
        const words2 = s2.split(/\s+/);

        let commonWords = 0;
        for (const word of words1) {
            if (word.length > 2 && words2.some(w => w.includes(word) || word.includes(w))) {
                commonWords++;
            }
        }

        // Normalisieren auf einen Wert zwischen 0 und 1
        return commonWords / Math.max(words1.length, words2.length);
    }

    // Haupttransformationsmethode
    async transformFiles(files, options = {}) {
        try {
            const xsltPath = await this.findXsltFile();
            console.log('Verwende XSLT-Datei:', xsltPath);

            const sefPath = await this.compileToSEF(xsltPath);

            // Standardoptionen setzen
            const transformOptions = {
                addRights: options.addRights !== false, // Standard: true
                enrichRor: options.enrichRor !== false, // Standard: true
                similarityThreshold: options.similarityThreshold || 0.6 // Standard: 0.6
            };

            console.log('Verwendete Transformationsoptionen:', transformOptions);

            // Schwellenwert für Ähnlichkeit setzen
            this.similarityThreshold = transformOptions.similarityThreshold;

            const transformationResults = await Promise.all(
                files.map(async (file) => {
                    try {
                        const outputFileName = `transformed-${file.originalname}`;
                        const outputFile = path.join(this.directories.transform, outputFileName);

                        await this.transformXML(file.path, outputFile, sefPath, transformOptions);

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