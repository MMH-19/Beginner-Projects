# Windchill Calculator

A web application that calculates the windchill factor - the perceived temperature based on the combined effect of air temperature and wind speed.

## Features

- Select between Metric (°C, km/h) or English (°F, mph) measurement systems
- Input actual temperature and wind speed values
- Calculate button to compute and display the windchill factor
- Error validation for:
  - Missing or invalid input values
  - Negative wind speeds
  - Calculations where windchill would be higher than actual temperature
- Automatic recalculation when input values change
- Prevents redundant calculations when inputs haven't changed

## How to Use

1. Open `index.html` in your web browser
2. Select your preferred measurement system (Metric or English)
3. Enter the actual temperature and wind speed
4. Click "Calculate" or simply finish entering both values to see the result
5. The windchill temperature will display in the result section

## Windchill Formula

The application uses standard windchill formulas:

**Metric System (°C and km/h):**  
Windchill = 13.12 + (0.6215 × T) - (11.37 × V^0.16) + (0.3965 × T × V^0.16)  
Where T is the air temperature in °C and V is the wind speed in m/s (converted from km/h)

**English System (°F and mph):**  
Windchill = 35.74 + (0.6215 × T) - (35.75 × V^0.16) + (0.4275 × T × V^0.16)  
Where T is the air temperature in °F and V is the wind speed in mph

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- No external libraries or frameworks

## Browser Compatibility

The application is compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge 