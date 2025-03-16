document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('xmlFiles').files;
    const version = document.getElementById('version').value;

    // Dateien zum FormData hinzufügen
    for (let file of files) {
        formData.append('xmlFiles', file);
    }
    formData.append('version', version);

    // Anreicherungsoptionen hinzufügen
    formData.append('addRights', document.getElementById('addRights').checked);
    formData.append('enrichRor', document.getElementById('enrichRor').checked);
    formData.append('similarityThreshold', document.getElementById('similarityThreshold').value);

    // Status-Container leeren und Lade-Anzeige hinzufügen
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Wird verarbeitet...</span>
                </div>
                Transformation wird durchgeführt...
            </div>
        </div>
    `;

    try {
        const response = await fetch('/transform', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        // Ergebnisse anzeigen
        let resultsHtml = '<div class="mt-4">';
        result.results.forEach(file => {
            if (file.status === 'success') {
                resultsHtml += `
                    <div class="alert alert-success d-flex justify-content-between align-items-center">
                        <span>${file.originalName}: Erfolgreich transformiert</span>
                        <a href="/download/${file.transformedPath}" 
                           class="btn btn-outline-success btn-sm">
                            Download
                        </a>
                    </div>`;
            } else {
                resultsHtml += `
                    <div class="alert alert-danger">
                        ${file.originalName}: Fehler - ${file.error}
                    </div>`;
            }
        });
        resultsHtml += '</div>';

        statusDiv.innerHTML = resultsHtml;

    } catch (error) {
        statusDiv.innerHTML = `
            <div class="alert alert-danger">
                Fehler bei der Verarbeitung: ${error.message}
            </div>`;
    }
});