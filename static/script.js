document.addEventListener('DOMContentLoaded', function() {
    const longOption = document.querySelector('input[value="long"]');
    const longLength = document.getElementById('longLength');

    function toggleLongLength() {
        longLength.disabled = !longOption.checked;
    }

    document.querySelectorAll('input[name="urlType"]').forEach(radio => {
        radio.addEventListener('change', toggleLongLength);
    });
});

async function processUrl() {
    const originalUrl = document.getElementById('originalUrl').value;
    const urlType = document.querySelector('input[name="urlType"]:checked').value;
    const length = document.getElementById('longLength').value;

    if (!originalUrl) {
        alert('Please enter a URL');
        return;
    }

    if (urlType === 'long' && !length) {
        alert('Please enter a length for the long URL');
        return;
    }

    const data = {
        url: originalUrl,
        type: urlType,
        length: urlType === 'long' ? parseInt(length) : undefined
    };

    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        const fullUrl = `${window.location.protocol}//${window.location.host}${result.new_url}`;
        document.getElementById('result').innerHTML = `Your new URL: <a href="${fullUrl}" target="_blank">${fullUrl}</a>`;
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}