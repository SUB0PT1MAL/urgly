document.addEventListener('DOMContentLoaded', function() {
    const shortUrlBtn = document.getElementById('shortUrlBtn');
    const longUrlBtn = document.getElementById('longUrlBtn');
    const longUrlControls = document.getElementById('longUrlControls');
    const urlLengthSlider = document.getElementById('urlLengthSlider');
    const urlLengthInput = document.getElementById('urlLengthInput');
    const milestones = document.querySelectorAll('.milestone');
    const resultDiv = document.getElementById('result');
    const generatedUrlTextarea = document.getElementById('generatedUrl');
    const copyButton = document.getElementById('copyButton');
    
    const urlPreview = document.createElement('div');
    urlPreview.id = 'urlPreview';
    resultDiv.insertBefore(urlPreview, resultDiv.firstChild);

    function updateLongUrlControls() {
        longUrlControls.classList.toggle('inactive', shortUrlBtn.classList.contains('active'));
        updateUrlPreview();
    }

    shortUrlBtn.addEventListener('click', function() {
        shortUrlBtn.classList.add('active');
        longUrlBtn.classList.remove('active');
        updateLongUrlControls();
    });

    longUrlBtn.addEventListener('click', function() {
        longUrlBtn.classList.add('active');
        shortUrlBtn.classList.remove('active');
        updateLongUrlControls();
    });

    urlLengthSlider.addEventListener('input', function() {
        urlLengthInput.value = this.value;
        updateSliderColor(this.value);
        updateMilestones(this.value);
        updateUrlPreview();
    });

    urlLengthInput.addEventListener('input', function() {
        let value = this.value;
        if (value !== '') {
            value = parseInt(value);
            urlLengthSlider.value = value;
            updateSliderColor(value);
            updateMilestones(value);
            updateUrlPreview();
        }
    });

    urlLengthInput.addEventListener('blur', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 100) {
            value = 100;
        } else if (value > 2000) {
            value = 2000;
        }
        this.value = value;
        urlLengthSlider.value = value;
        updateSliderColor(value);
        updateMilestones(value);
        updateUrlPreview();
    });

    urlLengthInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });

    function updateSliderColor(value) {
        const percentage = (value - 100) / (2000 - 100) * 100;
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

    function updateUrlPreview() {
        const baseUrl = "https://urgly.sub0pt1mal.com/redi/";
        if (longUrlBtn.classList.contains('active')) {
            const length = parseInt(urlLengthInput.value);
            const previewLength = Math.max(0, length - baseUrl.length);
            //urlPreview.textContent = baseUrl + '█'.repeat(previewLength);
            urlPreview.textContent = baseUrl + 'X'.repeat(previewLength);
        } else {
            urlPreview.textContent = baseUrl;
        }
        urlPreview.style.display = 'block';
        generatedUrlTextarea.style.display = 'none';
        resultDiv.style.display = 'flex';
        autoResizeElement(urlPreview);
    }

    function autoResizeElement(element) {
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight + 2) + 'px';
    }

    milestones.forEach(milestone => {
        milestone.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            urlLengthSlider.value = value;
            urlLengthInput.value = value;
            updateSliderColor(value);
            updateMilestones(value);
            updateUrlPreview();
        });
    });

    updateSliderColor(urlLengthSlider.value);
    updateMilestones(urlLengthSlider.value);
    updateLongUrlControls();
    updateUrlPreview();
});

async function processUrl() {
    const originalUrl = document.getElementById('originalUrl').value;
    const urlType = document.getElementById('longUrlBtn').classList.contains('active') ? 'long' : 'short';
    let urlLength = document.getElementById('urlLengthInput').value;

    if (!originalUrl) {
        alert('Please enter a URL');
        return;
    }

    if (urlType === 'long') {
        urlLength = Math.max(100, parseInt(urlLength) - 34);
    }

    const data = {
        url: originalUrl,
        type: urlType,
        length: urlType === 'long' ? urlLength : undefined
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
        const generatedUrlTextarea = document.getElementById('generatedUrl');
        const urlPreview = document.getElementById('urlPreview');
        const copyButton = document.getElementById('copyButton');
        generatedUrlTextarea.value = fullUrl;
        urlPreview.style.display = 'none';
        generatedUrlTextarea.style.display = 'block';
        autoResizeElement(generatedUrlTextarea);
        copyButton.classList.remove('inactive');
        document.getElementById('result').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

function autoResizeElement(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight + 2) + 'px';
}

function copyToClipboard() {
    const generatedUrl = document.getElementById('generatedUrl');
    const copyButton = document.getElementById('copyButton');
    
    if (!copyButton.classList.contains('inactive')) {
        generatedUrl.select();
        document.execCommand('copy');
        
        copyButton.textContent = 'URL COPIED';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
            copyButton.textContent = 'COPY';
            copyButton.classList.remove('copied');
        }, 2000);
    }
}