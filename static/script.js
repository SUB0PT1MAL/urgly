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
        updateSliderColor(this.value);
    });

    urlLengthInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 100) value = 100;
        if (value > 2048) value = 2048;
        this.value = value;
        urlLengthSlider.value = value;
        updateSliderColor(value);
    });

    function updateSliderColor(value) {
        const percentage = (value - 100) / (2048 - 100) * 100;
        urlLengthSlider.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percentage}%, #3a3a3a ${percentage}%, #3a3a3a 100%)`;
    }

    // Initialize slider color
    updateSliderColor(urlLengthSlider.value);
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
        length: urlType === 'long' ? parseInt(urlLength) : undefined
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