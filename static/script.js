document.addEventListener('DOMContentLoaded', function() {
    const longOption = document.querySelector('input[value="long"]');
    const shortOption = document.querySelector('input[value="short"]');
    const longUrlControls = document.getElementById('longUrlControls');
    const urlLengthSlider = document.getElementById('urlLengthSlider');
    const urlLengthInput = document.getElementById('urlLengthInput');
    const milestones = document.querySelectorAll('.milestone');

    function toggleLongUrlControls() {
        longUrlControls.style.display = longOption.checked ? 'block' : 'none';
    }

    [longOption, shortOption].forEach(radio => {
        radio.addEventListener('change', toggleLongUrlControls);
    });

    urlLengthSlider.addEventListener('input', function() {
        urlLengthInput.value = this.value;
        updateSliderColor(this.value);
        updateMilestones(this.value);
    });

    urlLengthInput.addEventListener('input', function() {
        let value = this.value;
        if (value !== '') {
            value = parseInt(value);
            urlLengthSlider.value = value;
            updateSliderColor(value);
            updateMilestones(value);
        }
    });

    urlLengthInput.addEventListener('blur', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 100) {
            value = 100;
        } else if (value > 2048) {
            value = 2048;
        }
        this.value = value;
        urlLengthSlider.value = value;
        updateSliderColor(value);
        updateMilestones(value);
    });

    urlLengthInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });

    function updateSliderColor(value) {
        const percentage = (value - 100) / (2048 - 100) * 100;
        urlLengthSlider.style.background = `linear-gradient(to right, #1e90ff 0%, #1e90ff ${percentage}%, #3a3a3a ${percentage}%, #3a3a3a 100%)`;
    }

    function updateMilestones(value) {
        milestones.forEach(milestone => {
            if (parseInt(milestone.dataset.value) === parseInt(value)) {
                milestone.classList.add('active');
            } else {
                milestone.classList.remove('active');
            }
        });
    }

    milestones.forEach(milestone => {
        milestone.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            urlLengthSlider.value = value;
            urlLengthInput.value = value;
            updateSliderColor(value);
            updateMilestones(value);
        });
    });

    // Initialize slider color and milestones
    updateSliderColor(urlLengthSlider.value);
    updateMilestones(urlLengthSlider.value);
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
        document.getElementById('generatedUrl').value = fullUrl;
        document.getElementById('result').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

function copyToClipboard() {
    const generatedUrl = document.getElementById('generatedUrl');
    generatedUrl.select();
    document.execCommand('copy');
    alert('URL copied to clipboard!');
}