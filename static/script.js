document.addEventListener('DOMContentLoaded', function() {
    const longOption = document.querySelector('input[value="long"]');
    const shortOption = document.querySelector('input[value="short"]');
    const longUrlControls = document.getElementById('longUrlControls');
    const urlLengthSlider = document.getElementById('urlLengthSlider');
    const urlLengthInput = document.getElementById('urlLengthInput');

    function toggleLongUrlControls() {
        longUrlControls.style.display = longOption.checked ? 'block' : 'none';
    }

    [longOption, shortOption].forEach(radio => {
        radio.addEventListener('change', toggleLongUrlControls);
    });

    urlLengthSlider.addEventListener('input', function() {
        urlLengthInput.value = this.value;
    });

    urlLengthInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 34) value = 34;
        if (value > 2034) value = 2034;
        this.value = value;
        urlLengthSlider.value = value;
    });
});

async function processUrl() {
    const originalUrl = document.getElementById('originalUrl').value;
    const urlType = document.querySelector('input[name="urlType"]:checked').value;
    const urlLength = document.getElementById('urlLengthInput').value;

    if (!originalUrl) {
        alert('Please enter a URL');
        return;
    }

    const data = {
        url: originalUrl,
        type: urlType,
        length: urlType === 'long' ? parseInt(urlLength) - 34 : undefined
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