document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('xmlFiles').files;
    const version = document.getElementById('version').value;

    for (let file of files) {
        formData.append('xmlFiles', file);
    }
    formData.append('version', version);

    const status = document.getElementById('status');
    status.textContent = 'Transformation läuft...';

    try {
        const response = await fetch('/transform', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        status.textContent = result.message;
    } catch (error) {
        status.textContent = 'Fehler bei der Transformation: ' + error.message;
    }
});