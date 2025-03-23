// URL Parameter Handling
window.addEventListener('DOMContentLoaded', function() {
    const packDateInput = document.getElementById('packDate');
    const loadDateInput = document.getElementById('loadDate');
    const settingsButton = document.querySelector('.settings-button'); // Ensure this is inside DOMContentLoaded

    // Initialize season status with placeholder class
    const seasonStatusElement = document.getElementById('season-status');
    if (seasonStatusElement) {
        seasonStatusElement.classList.add('placeholder');
    }

    function triggerDatePicker(input) {
        input.addEventListener('click', () => {
            if (typeof input.showPicker === 'function') {
                try {
                    input.showPicker();
                } catch (e) {
                    input.focus();
                }
            } else {
                input.focus();
            }
        });
    }

    triggerDatePicker(packDateInput);
    triggerDatePicker(loadDateInput);

    // Function to update date input color class
    function updateDateInputColor(input) {
        if (input.value) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
    }

    // Initial check
    updateDateInputColor(packDateInput);
    updateDateInputColor(loadDateInput);

    // Listen for changes
    packDateInput.addEventListener('input', () => updateDateInputColor(packDateInput));
    loadDateInput.addEventListener('input', () => updateDateInputColor(loadDateInput));

    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('packDate')) {
        document.getElementById('packDate').value = urlParams.get('packDate');
        updateDateInputColor(packDateInput);
    }
    if (urlParams.has('loadDate')) {
        document.getElementById('loadDate').value = urlParams.get('loadDate');
        updateDateInputColor(loadDateInput);
    }
    if (urlParams.has('weight')) {
        document.getElementById('weight').value = urlParams.get('weight');
    }
    if (urlParams.has('distance')) {
        document.getElementById('distance').value = urlParams.get('distance');
    }
    
    if (urlParams.has('loadDate') && urlParams.has('weight') && urlParams.has('distance')) {
        calculateTransitTime();
    }

    function validateDates() {
        const packDate = packDateInput.value ? new Date(packDateInput.value) : null;
        const loadDate = loadDateInput.value ? new Date(loadDateInput.value) : null;

        if (packDate && loadDate && loadDate < packDate) {
            loadDateInput.value = packDateInput.value;
            updateDateInputColor(loadDateInput);
        }
    }

    packDateInput.addEventListener('change', () => {
        validateDates();
        updateDateInputColor(packDateInput);
    });
    loadDateInput.addEventListener('change', () => {
        validateDates();
        updateDateInputColor(loadDateInput);
    });

    // Fallout-style boot sequence
    const bootSequence = document.querySelector('.boot-sequence');
    const calculator = document.querySelector('.calculator');
    if (bootSequence && calculator) {
        calculator.classList.add('hidden');
        bootSequence.classList.add('active');
        
        const bootTexts = bootSequence.querySelectorAll('.boot-content p');
        let currentText = 0;
        let isSkippable = true;
        let isTyping = false;
        
        // Make the boot sequence skippable when clicked
        bootSequence.addEventListener('click', () => {
            if (!isSkippable) return;
            
            // Skip the animation and show all text immediately
            bootTexts.forEach(text => {
                text.textContent = text.getAttribute('data-content') || text.textContent;
                text.classList.remove('typing');
                text.classList.add('completed');
                text.style.opacity = '1';
            });
            
            // Immediately proceed to the calculator
            setTimeout(() => {
                bootSequence.classList.remove('active');
                calculator.classList.remove('hidden');
            }, 300);
        });
        
        function typeNextText() {
            if (currentText < bootTexts.length) {
                isTyping = true;
                const text = bootTexts[currentText];
                const textContent = text.textContent;
                
                // Store original content
                text.setAttribute('data-content', textContent);
                text.textContent = '';
                text.classList.add('typing');
                
                let charIndex = 0;
                const characters = textContent.split('');
                
                function typeChar() {
                    if (charIndex < characters.length) {
                        // Pip-Boy style typing - randomized bursts for authentic feel
                        let charsToAdd;
                        const rand = Math.random();
                        
                        if (rand < 0.7) { // 70% chance of typing 1-2 chars (normal typing)
                            charsToAdd = Math.floor(Math.random() * 2) + 1;
                        } else if (rand < 0.92) { // 22% chance of typing 3-6 chars (fast burst)
                            charsToAdd = Math.floor(Math.random() * 4) + 3;
                        } else { // 8% chance of typing 7-12 chars (very fast burst)
                            charsToAdd = Math.floor(Math.random() * 6) + 7;
                        }
                        
                        charsToAdd = Math.min(charsToAdd, characters.length - charIndex);
                        
                        for (let i = 0; i < charsToAdd; i++) {
                            if (charIndex < characters.length) {
                                text.textContent += characters[charIndex];
                                charIndex++;
                            }
                        }
                        
                        // Authentic terminal typing speed with variable pauses
                        let delay;
                        
                        if (charsToAdd >= 7) { // After a very fast burst, pause slightly longer
                            delay = Math.floor(Math.random() * 60) + 40;
                        } else if (charsToAdd >= 3) { // After a fast burst, small pause
                            delay = Math.floor(Math.random() * 40) + 20;
                        } else if (Math.random() < 0.1) { // Occasional tiny stutter
                            delay = Math.floor(Math.random() * 30) + 30;
                        } else { // Default fast typing
                            delay = Math.floor(Math.random() * 10) + 5;
                        }
                        
                        setTimeout(typeChar, delay);
                    } else {
                        text.classList.add('completed');
                        
                        // Determine pause after line completes based on content
                        let nextLineDelay;
                        
                        if (text.textContent.includes('OK') || 
                            text.textContent.includes('INITIALIZING') ||
                            text.textContent.includes('COMMAND') ||
                            text.textContent.includes('SERVER')) {
                            nextLineDelay = 350; // Special messages get longer pauses
                        } else if (text.textContent.includes('[')) {
                            nextLineDelay = 280; // Hex codes and data get medium pauses
                        } else if (currentText === bootTexts.length - 1) {
                            nextLineDelay = 1000; // Extra long pause at final line
                        } else {
                            nextLineDelay = 160; // Default short pause between lines
                        }
                        
                        setTimeout(() => {
                            currentText++;
                            if (currentText < bootTexts.length) {
                                typeNextText();
                            } else {
                                isTyping = false;
                                setTimeout(() => {
                                    bootSequence.classList.remove('active');
                                    calculator.classList.remove('hidden');
                                }, 800);
                            }
                        }, nextLineDelay);
                    }
                }
                
                // Initial delay before typing starts (variable between lines)
                const initialDelay = 80;
                setTimeout(typeChar, initialDelay);
            }
        }
        
        typeNextText();
    }

    // Settings button listener inside DOMContentLoaded
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            const settingsMenu = document.querySelector('.settings-menu');
            const settingsOverlay = document.querySelector('.settings-overlay');
            if (settingsMenu && settingsOverlay) {
                settingsMenu.classList.add('active');
                settingsOverlay.classList.add('active');
                console.log('Settings menu opened');
            } else {
                console.error('Settings menu or overlay not found');
            }
        });
    } else {
        console.error('Settings button not found');
    }

    // Create custom dropdown arrows
    createDropdownArrow();

    // Add scan effect div that will move across content but not affect borders
    const container = document.querySelector('.container');
    if (container) {
        // Add horizontal scan effect
        const scanEffect = document.createElement('div');
        scanEffect.className = 'scan-effect';
        container.appendChild(scanEffect);
        
        // Add scanlines
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        container.appendChild(scanlines);
    }
});

function copyForSpreadsheet() {
    const packDate = document.getElementById('packDate').value;
    const loadDate = document.getElementById('loadDate').value;
    const weight = document.getElementById('weight').value;
    const distance = document.getElementById('distance').value;
    const transitDays = document.getElementById('transit-days').textContent;
    const seasonStatus = document.getElementById('season-status').textContent;
    
    if (!loadDate || !weight || !distance || transitDays === '--') return;
    
    const packDateFormatted = packDate ? formatDateForCopy(createDateFromInput(packDate)) : '';
    const loadDateFormatted = formatDateForCopy(createDateFromInput(loadDate));
    const rddFormatted = formatDateForCopy(currentRDD);
    
    const data = `${packDateFormatted}\t${loadDateFormatted}\t${rddFormatted}\t${weight}\t${distance}\t${transitDays}\t${seasonStatus}`;
    
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(data);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = data;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback: Could not copy text: ', err);
            }
            
            document.body.removeChild(textArea);
        }
        
        const copyButton = document.getElementById('copy-spreadsheet');
        if (copyButton) {
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.classList.remove('copied');
            }, 1500);
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

const transitGuide = {
    weights: [
        { min: 1, max: 999 },
        { min: 1000, max: 1999 },
        { min: 2000, max: 3999 },
        { min: 4000, max: 7999 },
        { min: 8000, max: Infinity }
    ],
    distances: [
        { min: 1, max: 250 },
        { min: 251, max: 500 },
        { min: 501, max: 750 },
        { min: 751, max: 1000 },
        { min: 1001, max: 1250 },
        { min: 1251, max: 1500 },
        { min: 1501, max: 1750 },
        { min: 1751, max: 2000 },
        { min: 2001, max: 2250 },
        { min: 2251, max: 2500 },
        { min: 2501, max: 2750 },
        { min: 2751, max: 3000 },
        { min: 3001, max: 7000 }
    ],
    times: [
        [16, 19, 22, 24, 24, 25, 26, 27, 28, 29, 30, 31, 44],
        [15, 18, 20, 22, 21, 22, 23, 25, 26, 27, 28, 29, 39],
        [14, 15, 18, 19, 19, 20, 21, 22, 24, 25, 26, 27, 41],
        [12, 14, 17, 18, 18, 19, 20, 21, 22, 23, 24, 25, 40],
        [11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23, 43]
    ]
};

const peakSeason = {
    start: new Date('2025-05-15'),
    end: new Date('2025-09-30')
};

let currentRDD = null;

const federalHolidays = [
    '2024-01-01', '2024-01-15', '2024-02-19', '2024-05-27', '2024-06-19',
    '2024-07-04', '2024-09-02', '2024-10-14', '2024-11-11', '2024-11-28',
    '2024-12-25', '2025-01-01', '2025-01-20', '2025-02-17', '2025-05-26',
    '2025-06-19', '2025-07-04', '2025-09-01', '2025-10-13', '2025-11-11',
    '2025-11-27', '2025-12-25'
];

function isFederalHoliday(date) {
    const dateString = date.toISOString().split('T')[0];
    return federalHolidays.includes(dateString);
}

function isBusinessDay(date) {
    return !(date.getDay() === 0 || date.getDay() === 6 || isFederalHoliday(date));
}

function createDateFromInput(dateString) {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    // Create date object without time component to avoid timezone issues
    return new Date(year, month - 1, day);
}

function formatDateForCopy(date) {
    if (!date) return null;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

async function copyDates() {
    const packDateStr = document.getElementById('packDate').value;
    const loadDateStr = document.getElementById('loadDate').value;
    const copyFormat = document.getElementById('copy-format').value;
    
    if (!loadDateStr || !currentRDD) return;

    let text = '';
    const packDate = packDateStr ? createDateFromInput(packDateStr) : null;
    const loadDate = createDateFromInput(loadDateStr);
    const packDateFormatted = packDate ? formatDateForCopy(packDate) : null;
    const loadDateFormatted = formatDateForCopy(loadDate);
    const rddDateFormatted = formatDateForCopy(currentRDD);
    
    // Get load spread dates
    const loadSpread = calculateLoadSpread(loadDate);
    const earliestLoadDate = formatDateForCopy(loadSpread.earliest);
    const latestLoadDate = formatDateForCopy(loadSpread.latest);
    
    // Format the text based on the selected format
    if (copyFormat === 'osnp') {
        text = `Hello,\n\nThe agent(s) can accommodate your requested date change. Your new dates are as follows-\n\n`;
        if (packDateFormatted) {
            text += `Pack: ${packDateFormatted}\n`;
        }
        text += `Load: ${loadDateFormatted}\nRDD: ${rddDateFormatted}\n\nJPPSO, please update DPS to reflect the Earliest Pickup Date of ${earliestLoadDate} and Latest Pickup Date of ${latestLoadDate}`;
    } else if (copyFormat === 'osp') {
        text = `Hello,\n\nThe agent(s) can accommodate your requested date change. Your new dates are as follows-\n\n`;
        if (packDateFormatted) {
            text += `Pack: ${packDateFormatted}\n`;
        }
        text += `Load: ${loadDateFormatted}\nRDD: ${rddDateFormatted}\n\nJPPSO, please update the planned dates in DPS and on GBL as well as issue the spread override due to member/base convenience.`;
    } else if (copyFormat === 'isp') {
        text = `Hello,\n\nThe agent(s) can accommodate your requested date change. Your new dates are as follows-\n\n`;
        if (packDateFormatted) {
            text += `Pack: ${packDateFormatted}\n`;
        }
        text += `Load: ${loadDateFormatted}\nRDD: ${rddDateFormatted}\n\nJPPSO, please update the planned dates in DPS and on GBL.`;
    } else if (copyFormat === 'isnp') {
        text = `Hello,\n\nThe agent(s) can accommodate your requested date change. Your new dates are as follows-\n\n`;
        if (packDateFormatted) {
            text += `Pack: ${packDateFormatted}\n`;
        }
        text += `Load: ${loadDateFormatted}\nRDD: ${rddDateFormatted}`;
    } else if (copyFormat === 'simple') {
        if (packDateFormatted) {
            text += `Pack: ${packDateFormatted}\n`;
        }
        text += `Pickup: ${loadDateFormatted}\nRDD: ${rddDateFormatted}`;
    }

    try {
        await navigator.clipboard.writeText(text);
        const copyButton = document.getElementById('copy-dates');
        copyButton.classList.add('copied');
        
        // Show feedback
        const originalTitle = copyButton.getAttribute('title');
        copyButton.setAttribute('title', 'Copied!');
        
        // Reset button state after 2 seconds
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.setAttribute('title', originalTitle);
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text:', err);
        // Fallback to older method
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            const copyButton = document.getElementById('copy-dates');
            copyButton.classList.add('copied');
            setTimeout(() => copyButton.classList.remove('copied'), 2000);
        } catch (err) {
            console.error('Fallback: Could not copy text:', err);
        }
        document.body.removeChild(textarea);
    }
}

function isInPeakSeason(date) {
    const checkDate = new Date(date);
    return checkDate >= peakSeason.start && checkDate <= peakSeason.end;
}

function updateSeasonStatus(date) {
    const seasonStatusElement = document.getElementById('season-status');
    seasonStatusElement.classList.remove('peak', 'non-peak', 'placeholder');

    if (isInPeakSeason(date)) {
        seasonStatusElement.textContent = 'Peak Season';
        seasonStatusElement.classList.add('peak');
    } else {
        seasonStatusElement.textContent = 'Non-Peak';
        seasonStatusElement.classList.add('non-peak');
    }
}

// Helper function to reset season status to default state
function resetSeasonStatus() {
    const seasonStatusElement = document.getElementById('season-status');
    seasonStatusElement.classList.remove('peak', 'non-peak');
    seasonStatusElement.classList.add('placeholder');
    seasonStatusElement.textContent = '--';
}

function getWeightIndex(weight) {
    return transitGuide.weights.findIndex(range => 
        weight >= range.min && weight <= range.max
    );
}

function getDistanceIndex(distance) {
    return transitGuide.distances.findIndex(range => 
        distance >= range.min && distance <= range.max
    );
}

function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function addBusinessDays(date, days) {
    // Clone the date
    let currentDate = new Date(date.getTime());
    
    // Add transit days as calendar days
    for (let i = 0; i < days; i++) {
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Ensure the final date is a business day
    return getNextBusinessDay(currentDate);
}

function getNextBusinessDay(date) {
    let resultDate = new Date(date.getTime());
    while (!isBusinessDay(resultDate)) {
        resultDate.setDate(resultDate.getDate() + 1);
    }
    return resultDate;
}

function calculateLoadSpread(loadDate) {
    const latest = new Date(loadDate);
    latest.setDate(loadDate.getDate() + 1);
    const earliest = new Date(latest);
    earliest.setDate(latest.getDate() - 6);
    return { earliest, latest };
}

function calculateTransitTime() {
    const weight = parseFloat(document.getElementById('weight').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const loadDateStr = document.getElementById('loadDate').value;
    const resultElement = document.getElementById('transit-days');
    const deliveryDateElement = document.getElementById('delivery-date');
    const loadSpreadElement = document.getElementById('load-spread');

    currentRDD = null;

    if (!weight || !distance || !loadDateStr || weight <= 0 || distance <= 0) {
        resultElement.textContent = 'Invalid input';
        deliveryDateElement.textContent = '--';
        loadSpreadElement.textContent = '--';
        resetSeasonStatus();
        return;
    }

    updateSeasonStatus(loadDateStr);

    const weightIndex = getWeightIndex(weight);
    const distanceIndex = getDistanceIndex(distance);

    if (weightIndex === -1 || distanceIndex === -1) {
        resultElement.textContent = 'Out of range';
        deliveryDateElement.textContent = '--';
        loadSpreadElement.textContent = '--';
        resetSeasonStatus();
        return;
    }

    const transitTime = transitGuide.times[weightIndex][distanceIndex];
    resultElement.textContent = transitTime;

    const startDate = createDateFromInput(loadDateStr);
    
    // Calculate RDD by adding transit days to the pickup date
    let rddDate = new Date(startDate);
    for (let i = 0; i < transitTime; i++) {
        rddDate.setDate(rddDate.getDate() + 1);
    }
    
    // Ensure it's a business day
    currentRDD = getNextBusinessDay(rddDate);
    deliveryDateElement.textContent = formatDate(currentRDD);

    const loadSpread = calculateLoadSpread(startDate);
    loadSpreadElement.textContent = `Earliest Pickup Date ${formatDateForCopy(loadSpread.earliest)} - Latest Pickup Date ${formatDateForCopy(loadSpread.latest)}`;
}

const root = document.documentElement;
const settingsMenu = document.querySelector('.settings-menu');
const settingsOverlay = document.querySelector('.settings-overlay');
const closeButton = document.querySelector('.settings-menu .close-button');
const hueSlider = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const lightnessSlider = document.getElementById('lightness');
const colorPreview = document.querySelector('.color-preview');
const showFormatToggle = document.getElementById('show-format-toggle');
const animationsToggle = document.getElementById('animations-toggle');
const scanlineSlider = document.getElementById('scanline-intensity');
const container = document.querySelector('.container');

function loadSavedSettings() {
    // Load color settings
    const savedColors = localStorage.getItem('pipBoyColors');
    if (savedColors) {
        const { hue, saturation, lightness } = JSON.parse(savedColors);
        root.style.setProperty('--pip-hue', hue);
        root.style.setProperty('--pip-saturation', `${saturation}%`);
        root.style.setProperty('--pip-lightness', `${lightness}%`);
        
        hueSlider.value = hue;
        saturationSlider.value = saturation;
        lightnessSlider.value = lightness;
        
        updateColorPreview();
    }
    
    // Load format visibility setting
    const showFormat = localStorage.getItem('showFormatOption');
    if (showFormat !== null) {
        const shouldShow = showFormat === 'true';
        updateToggleState('show-format-toggle', shouldShow);
        toggleFormatVisibility(shouldShow);
    }
    
    // Load animations setting
    const animationsEnabled = localStorage.getItem('animationsEnabled');
    if (animationsEnabled !== null) {
        const enabled = animationsEnabled === 'true';
        updateToggleState('animations-toggle', enabled);
        toggleAnimations(enabled);
    }
    
    // Load scanline intensity setting
    const scanlineIntensity = localStorage.getItem('scanlineIntensity');
    if (scanlineIntensity !== null) {
        scanlineSlider.value = scanlineIntensity;
        updateScanlineIntensity(scanlineIntensity);
    }
}

function saveColors() {
    const colors = {
        hue: parseInt(hueSlider.value),
        saturation: parseInt(saturationSlider.value),
        lightness: parseInt(lightnessSlider.value)
    };
    localStorage.setItem('pipBoyColors', JSON.stringify(colors));
}

function saveFormatVisibility(isVisible) {
    localStorage.setItem('showFormatOption', isVisible);
}

function saveAnimationsState(isEnabled) {
    localStorage.setItem('animationsEnabled', isEnabled);
}

function saveScanlineIntensity(intensity) {
    localStorage.setItem('scanlineIntensity', intensity);
}

function toggleFormatVisibility(isVisible) {
    const formatSelects = document.querySelectorAll('.copy-format, .select-wrapper');
    formatSelects.forEach(el => {
        el.style.display = isVisible ? 'block' : 'none';
    });
}

function toggleAnimations(isEnabled) {
    if (isEnabled) {
        document.body.classList.remove('no-animations');
        container.classList.remove('no-animations');
        root.style.setProperty('--animations-enabled', '1');
    } else {
        document.body.classList.add('no-animations');
        container.classList.add('no-animations');
        root.style.setProperty('--animations-enabled', '0');
    }
    
    // Force a repaint to ensure animations are toggled
    const currentDisplay = container.style.display;
    container.style.display = 'none';
    // This line forces a repaint
    void container.offsetHeight;
    container.style.display = currentDisplay;
}

function updateScanlineIntensity(intensity) {
    // Convert 0-100 range to 0-0.7 for opacity (increased from 0.5)
    const opacity = (intensity / 100) * 0.7;
    root.style.setProperty('--scanline-opacity', opacity.toFixed(2));
}

function updateColorPreview() {
    const hue = hueSlider.value;
    const saturation = saturationSlider.value;
    const lightness = lightnessSlider.value;
    
    root.style.setProperty('--pip-hue', hue);
    root.style.setProperty('--pip-saturation', `${saturation}%`);
    root.style.setProperty('--pip-lightness', `${lightness}%`);
    
    colorPreview.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    saveColors();
}

function addSliderEvents(slider) {
    ['input', 'touchmove'].forEach(eventType => {
        slider.addEventListener(eventType, updateColorPreview);
    });
    
    slider.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, { passive: false });
}

if (hueSlider && saturationSlider && lightnessSlider) {
    [hueSlider, saturationSlider, lightnessSlider].forEach(addSliderEvents);
} else {
    console.error('One or more sliders not found');
}

if (scanlineSlider) {
    ['input', 'change'].forEach(eventType => {
        scanlineSlider.addEventListener(eventType, () => {
            updateScanlineIntensity(scanlineSlider.value);
            saveScanlineIntensity(scanlineSlider.value);
        });
    });
}

const presetColors = document.querySelectorAll('.preset-color');
presetColors.forEach(button => {
    button.addEventListener('click', () => {
        const hue = parseInt(button.dataset.hue);
        const saturation = parseInt(button.dataset.sat || button.dataset.saturation);
        const lightness = parseInt(button.dataset.light || button.dataset.lightness);
        
        hueSlider.value = hue;
        saturationSlider.value = saturation;
        lightnessSlider.value = lightness;
        
        updateColorPreview();
    });
    
    button.title = button.dataset.name;
});

if (closeButton) {
    closeButton.addEventListener('click', () => {
        settingsMenu.classList.remove('active');
        settingsOverlay.classList.remove('active');
    });
}

if (settingsOverlay) {
    settingsOverlay.addEventListener('click', () => {
        settingsMenu.classList.remove('active');
        settingsOverlay.classList.remove('active');
    });
}

if (showFormatToggle) {
    showFormatToggle.addEventListener('change', () => {
        toggleFormatVisibility(showFormatToggle.checked);
        saveFormatVisibility(showFormatToggle.checked);
    });
}

if (animationsToggle) {
    animationsToggle.addEventListener('change', () => {
        toggleAnimations(animationsToggle.checked);
        saveAnimationsState(animationsToggle.checked);
    });
}

document.addEventListener('DOMContentLoaded', loadSavedSettings);

function createDropdownArrow() {
    // Get all select elements with the copy-format class
    const selects = document.querySelectorAll('.copy-format');
    selects.forEach(select => {
        // Create a wrapper div for each select
        const wrapper = document.createElement('div');
        wrapper.className = 'select-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        
        // Set parent node reference
        const parent = select.parentNode;
        
        // Insert wrapper before select in the DOM
        parent.insertBefore(wrapper, select);
        
        // Move select into wrapper
        wrapper.appendChild(select);
        
        // Create custom arrow element
        const arrow = document.createElement('div');
        arrow.className = 'select-arrow';
        arrow.style.position = 'absolute';
        arrow.style.right = '10px';
        arrow.style.top = '50%';
        arrow.style.transform = 'translateY(-50%)';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderLeft = '5px solid transparent';
        arrow.style.borderRight = '5px solid transparent';
        arrow.style.borderTop = '5px solid var(--pip-green)';
        arrow.style.pointerEvents = 'none';
        
        // Add arrow to wrapper
        wrapper.appendChild(arrow);
        
        // Update select styling
        select.style.backgroundImage = 'none';
    });
}

// Update toggle text and checkbox state
function updateToggleState(toggleId, isEnabled) {
    const checkbox = document.getElementById(toggleId);
    const toggleText = document.querySelector(`[data-for="${toggleId}"]`);
    
    if (checkbox && toggleText) {
        checkbox.checked = isEnabled;
        toggleText.textContent = isEnabled ? 'ON' : 'OFF';
        toggleText.classList.toggle('active', isEnabled);
    }
}

// Add click handlers for toggle text elements
document.querySelectorAll('.toggle-text').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const toggleId = toggle.dataset.for;
        const checkbox = document.getElementById(toggleId);
        
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            updateToggleState(toggleId, checkbox.checked);
            
            // Trigger the change event on the checkbox
            const event = new Event('change');
            checkbox.dispatchEvent(event);
        }
    });
});