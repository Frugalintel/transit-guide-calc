# Transit Guide Calculator

A sleek, terminal-themed web application for calculating transit times and Required Delivery Dates (RDD) for shipments. Built with HTML, CSS, and JavaScript, featuring a Fallout terminal-inspired boot sequence.

## Features

- Calculate Required Delivery Dates (RDD) based on pickup date, weight, and distance
- Automatic peak season detection
- Fallout terminal-inspired design with authentic boot sequence
- Realistic typewriter text effect with blinking square cursor
- Customizable terminal color schemes
- Radiation mode toggle for Fallout Pip-Boy aesthetics
- Mobile-responsive interface
- Easy date copying functionality with cross-platform support
- Multiple copy templates including OSNP format
- Spreadsheet integration support
- Pack Date
- Pickup Date

## Boot Sequence

The application features an authentic Fallout-style boot sequence:
- Character-by-character typing animation
- Authentic square cursor that blinks at the end of each line
- Variable typing speeds to simulate human typing
- Random pauses for an authentic terminal experience

## Usage

1. Watch the boot sequence initialize the application
2. Enter the required information:
   - Pack Date (optional)
   - Pickup Date
   - Shipment Weight (lbs)
   - Distance (miles)

3. Click "Calculate RDD" to see the results

4. Use the copy dropdown to select your preferred format:
   - DATES ONLY: Simple date format for general use
   - OSNP: Pre-formatted message for date change confirmations

5. Click the copy button to copy the formatted text to your clipboard

## Copy Templates

The app includes multiple copy templates for different use cases:

### DATES ONLY
Simple format showing just the dates:
```
Pack: MM/DD/YYYY
Load: MM/DD/YYYY
RDD: MM/DD/YYYY
```

### OSNP Template
Complete message for date change confirmations:
```
Hello,

The agent(s) can accommodate your requested date change. Your new dates are as follows-
 
Pack: MM/DD/YYYY
Load: MM/DD/YYYY
RDD: MM/DD/YYYY
 
JPPSO, please update DPS and GBL to reflect the newly agreed on dates that are within spread.
```

## Spreadsheet Integration

To use this calculator from your spreadsheet:

1. Create a hyperlink with this format:
   ```
   https://frugalintel.github.io/transit-guide-calc/?loadDate=YYYY-MM-DD&weight=1000&distance=500
   ```

2. Replace the values with cell references in your spreadsheet

3. Click the copy button to copy the dates back to your spreadsheet

## Live Demo

Visit [https://frugalintel.github.io/transit-guide-calc/](https://frugalintel.github.io/transit-guide-calc/) to try the calculator.

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/frugalintel/transit-guide-calc.git
   ```

2. Open `index.html` in your web browser

## License

MIT License - feel free to use this project for your own purposes. 