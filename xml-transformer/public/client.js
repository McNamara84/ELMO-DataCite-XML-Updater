document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('xmlFiles').files;
    const version = document.getElementById('version').value;
    const status = document.getElementById('status');

    if (files.length === 0) {
        status.textContent = 'Bitte wählen Sie mindestens eine XML-Datei aus.';
        return;
    }

    for (let file of files) {
        formData.append('xmlFiles', file);
    }
    formData.append('version', version);

    status.textContent = 'Transformation läuft...';

    try {
        const response = await fetch('/transform', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.error) {
            status.textContent = `Fehler: ${result.error}`;
            return;
        }

        // Ergebnisse anzeigen
        let resultHtml = '<h3>Transformationsergebnisse:</h3><ul>';
        result.results.forEach(file => {
            if (file.status === 'success') {
                resultHtml += `
                    <li>
                        ${file.originalName}: Erfolgreich transformiert
                        <a href="/download/${file.transformedPath.split('/').pop()}" 
                           class="download-link">Download</a>
                    </li>`;
            } else {
                resultHtml += `
                    <li>
                        ${file.originalName}: Fehler - ${file.error}
                    </li>`;
            }
        });
        resultHtml += '</ul>';

        status.innerHTML = resultHtml;
    } catch (error) {
        status.textContent = 'Fehler bei der Transformation: ' + error.message;
    }
});