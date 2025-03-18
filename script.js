// Add this at the beginning of the file, before the transitGuide definition
window.addEventListener('DOMContentLoaded', function() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Pre-fill form if parameters exist
    if (urlParams.has('packDate')) {
        document.getElementById('packDate').value = urlParams.get('packDate');
    }
    if (urlParams.has('loadDate')) {
        document.getElementById('loadDate').value = urlParams.get('loadDate');
    }
    if (urlParams.has('weight')) {
        document.getElementById('weight').value = urlParams.get('weight');
    }
    if (urlParams.has('distance')) {
        document.getElementById('distance').value = urlParams.get('distance');
    }
    
    // Auto calculate if all required fields are filled
    if (urlParams.has('loadDate') && urlParams.has('weight') && urlParams.has('distance')) {
        calculateTransitTime();
    }
});

// Add this function to format data for spreadsheet
function copyForSpreadsheet() {
    const packDate = document.getElementById('packDate').value;
    const loadDate = document.getElementById('loadDate').value;
    const weight = document.getElementById('weight').value;
    const distance = document.getElementById('distance').value;
    const transitDays = document.getElementById('transit-days').textContent;
    const seasonStatus = document.getElementById('season-status').textContent;
    
    if (!loadDate || !weight || !distance || transitDays === '--') return;
    
    // Format dates
    const packDateFormatted = packDate ? formatDateForCopy(createDateFromInput(packDate)) : '';
    const loadDateFormatted = formatDateForCopy(createDateFromInput(loadDate));
    const rddFormatted = formatDateForCopy(currentRDD);
    
    // Create tab-separated string (works with Excel/Google Sheets)
    const data = `${packDateFormatted}\t${loadDateFormatted}\t${rddFormatted}\t${weight}\t${distance}\t${transitDays}\t${seasonStatus}`;
    
    try {
        navigator.clipboard.writeText(data);
        
        // Visual feedback
        const copyButton = document.getElementById('copy-spreadsheet');
        copyButton.classList.add('copied');
        
        setTimeout(() => {
            copyButton.classList.remove('copied');
        }, 1500);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

// Transit guide data structure
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
    // Transit times [weight column][distance row]
    times: [
        [16, 19, 22, 24, 24, 25, 26, 27, 28, 29, 30, 31, 44], // 1-999
        [15, 18, 20, 22, 21, 22, 23, 25, 26, 27, 28, 29, 39], // 1000-1999
        [14, 15, 18, 19, 19, 20, 21, 22, 24, 25, 26, 27, 41], // 2000-3999
        [12, 14, 17, 18, 18, 19, 20, 21, 22, 23, 24, 25, 40], // 4000-7999
        [11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 43]  // 8000+
    ]
};

// Peak season configuration
const peakSeason = {
    start: new Date('2025-05-15'),
    end: new Date('2025-09-30')
};

let currentRDD = null; // Store the current RDD date object

function createDateFromInput(dateString) {
    // Split the date string into parts
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    // Create date using local timezone
    return new Date(year, month - 1, day);
}

function formatDateForCopy(date) {
    if (!date) return null;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
}

async function copyDates() {
    const packDateStr = document.getElementById('packDate').value;
    const loadDateStr = document.getElementById('loadDate').value;
    
    if (!loadDateStr || !currentRDD) return;

    let text = '';
    
    if (packDateStr) {
        const packDate = createDateFromInput(packDateStr);
        text += `Pack: ${formatDateForCopy(packDate)}\n`;
    }
    
    const loadDate = createDateFromInput(loadDateStr);
    text += `Load: ${formatDateForCopy(loadDate)}\n`;
    text += `RDD: ${formatDateForCopy(currentRDD)}`;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const copyButton = document.getElementById('copy-dates');
        copyButton.classList.add('copied');
        
        // Reset the button state after 1.5 seconds
        setTimeout(() => {
            copyButton.classList.remove('copied');
        }, 1500);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

function isInPeakSeason(date) {
    const checkDate = new Date(date);
    return checkDate >= peakSeason.start && checkDate <= peakSeason.end;
}

function updateSeasonStatus(date) {
    const seasonStatusElement = document.getElementById('season-status');
    seasonStatusElement.classList.remove('peak', 'non-peak');

    if (isInPeakSeason(date)) {
        seasonStatusElement.textContent = 'Peak Season';
        seasonStatusElement.classList.add('peak');
    } else {
        seasonStatusElement.textContent = 'Non-Peak';
        seasonStatusElement.classList.add('non-peak');
    }
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
    let currentDate = new Date(date.getTime());
    let addedDays = 0;
    
    while (addedDays < days) {
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Check if it's a weekend (0 = Sunday, 6 = Saturday)
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            addedDays++;
        }
    }
    
    return currentDate;
}

function calculateTransitTime() {
    // Get input values
    const weight = parseFloat(document.getElementById('weight').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const loadDateStr = document.getElementById('loadDate').value;
    const resultElement = document.getElementById('transit-days');
    const deliveryDateElement = document.getElementById('delivery-date');

    // Reset currentRDD
    currentRDD = null;

    // Validate inputs
    if (!weight || !distance || !loadDateStr || weight <= 0 || distance <= 0) {
        resultElement.textContent = 'Invalid input';
        deliveryDateElement.textContent = '--';
        document.getElementById('season-status').textContent = '--';
        return;
    }

    // Update season status
    updateSeasonStatus(loadDateStr);

    // Find the corresponding indices in the transit guide
    const weightIndex = getWeightIndex(weight);
    const distanceIndex = getDistanceIndex(distance);

    // Check if the input values are within valid ranges
    if (weightIndex === -1 || distanceIndex === -1) {
        resultElement.textContent = 'Out of range';
        deliveryDateElement.textContent = '--';
        return;
    }

    // Get the transit time from the table
    const transitTime = transitGuide.times[weightIndex][distanceIndex];
    resultElement.textContent = transitTime;

    // Calculate RDD (Required Delivery Date)
    const startDate = createDateFromInput(loadDateStr);
    currentRDD = addBusinessDays(startDate, transitTime);
    deliveryDateElement.textContent = formatDate(currentRDD);
} 