document.addEventListener('DOMContentLoaded', function() {
    const longOption = document.querySelector('input[value="long"]');
    const sliderContainer = document.getElementById('sliderContainer');
    const longLengthSlider = document.getElementById('longLengthSlider');
    const selectedLengthDisplay = document.getElementById('selectedLength');
    const baseUrl = "https://urgly.sub0pt1mal.com/redi/";

    function updateSelectedLength() {
        const totalLength = parseInt(longLengthSlider.value);
        selectedLengthDisplay.textContent = `Selected length: ${totalLength}`;
    }

    function toggleSlider() {
        sliderContainer.style.display = longOption.checked ? 'block' : 'none';
        if (longOption.checked) {
            updateSelectedLength();
        }
    }

    document.querySelectorAll('input[name="urlType"]').forEach(radio => {
        radio.addEventListener('change', toggleSlider);
    });

    longLengthSlider.addEventListener('input', updateSelectedLength);

    async function processUrl() {
        const originalUrl = document.getElementById('originalUrl').value;
        const urlType = document.querySelector('input[name="urlType"]:checked').value;
        const length = longLengthSlider.value;

        if (!originalUrl) {
            alert('Please enter a URL');
            return;
        }

        if (urlType === 'long') {
            const fullUrlLength = parseInt(length);
            const baseUrlLength = baseUrl.length;
            const requiredLength = fullUrlLength - baseUrlLength;

            if (requiredLength <= 0) {
                alert('The specified length is too short for the base URL');
                return;
            }
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

    window.processUrl = processUrl; // Expose processUrl function to global scope
    toggleSlider(); // Initialize the slider state on page load
});
