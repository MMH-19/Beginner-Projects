document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const temperatureInput = document.getElementById('temperature');
    const windSpeedInput = document.getElementById('windspeed');
    const calculateButton = document.getElementById('calculate-btn');
    const resultElement = document.getElementById('result');
    const windchillValue = document.getElementById('windchill-value');
    const errorMessage = document.getElementById('error-message');
    const metricRadio = document.getElementById('metric');
    const englishRadio = document.getElementById('english');
    const tempUnitElements = document.querySelectorAll('.temp-unit');
    const speedUnitElement = document.querySelector('.speed-unit');
    
    // Track previous values for bonus feature
    let previousTemperature = '';
    let previousWindSpeed = '';
    let previousSystem = 'metric';
    
    // Initialize
    setupEventListeners();
    
    function setupEventListeners() {
        // System change
        metricRadio.addEventListener('change', handleSystemChange);
        englishRadio.addEventListener('change', handleSystemChange);
        
        // Calculate button
        calculateButton.addEventListener('click', calculateWindchill);
        
        // Real-time calculation (bonus feature)
        temperatureInput.addEventListener('input', autoCalculate);
        windSpeedInput.addEventListener('input', autoCalculate);
    }
    
    function handleSystemChange() {
        const isMetric = metricRadio.checked;
        
        // Update units display
        tempUnitElements.forEach(el => {
            el.textContent = isMetric ? '°C' : '°F';
        });
        
        speedUnitElement.textContent = isMetric ? 'km/h' : 'mph';
        
        // Auto-calculate if values are present
        if (temperatureInput.value && windSpeedInput.value) {
            calculateWindchill();
        }
    }
    
    function autoCalculate() {
        // Only calculate if both fields have values (bonus feature)
        if (temperatureInput.value && windSpeedInput.value) {
            calculateWindchill();
        } else {
            hideResult();
        }
    }
    
    function calculateWindchill() {
        // Get input values
        const temperature = parseFloat(temperatureInput.value);
        const windSpeed = parseFloat(windSpeedInput.value);
        const isMetric = metricRadio.checked;
        
        // Clear previous error message
        hideError();
        
        // Validate inputs
        if (isNaN(temperature) || isNaN(windSpeed)) {
            showError('Please enter valid numbers for temperature and wind speed.');
            return;
        }
        
        // Check for negative wind speed
        if (windSpeed < 0) {
            showError('Wind speed cannot be negative.');
            return;
        }
        
        // Check if values changed (bonus feature)
        const currentSystem = isMetric ? 'metric' : 'english';
        if (
            temperature === parseFloat(previousTemperature) && 
            windSpeed === parseFloat(previousWindSpeed) && 
            currentSystem === previousSystem
        ) {
            showError('Please change at least one input value before calculating again.');
            return;
        }
        
        // Store current values for next comparison
        previousTemperature = temperature;
        previousWindSpeed = windSpeed;
        previousSystem = currentSystem;
        
        // Calculate windchill
        let windchillTemp;
        
        if (isMetric) {
            // Formula for Metric (°C and km/h)
            // First convert km/h to m/s for calculation
            const windSpeedMS = windSpeed / 3.6;
            windchillTemp = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeedMS, 0.16) + 0.3965 * temperature * Math.pow(windSpeedMS, 0.16);
        } else {
            // Formula for English (°F and mph)
            windchillTemp = 35.74 + 0.6215 * temperature - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * temperature * Math.pow(windSpeed, 0.16);
        }
        
        // Round to one decimal place
        windchillTemp = Math.round(windchillTemp * 10) / 10;
        
        // Validate result (bonus feature)
        if (windchillTemp >= temperature) {
            // Windchill should always be lower than actual temperature
            console.assert(windchillTemp < temperature, 'Windchill calculation error: result should be lower than actual temperature');
            showError('Calculation error: Wind chill should be lower than the actual temperature. This typically happens with very low wind speeds or warm temperatures where the wind chill effect is minimal.');
            return;
        }
        
        // Display result
        windchillValue.textContent = windchillTemp;
        resultElement.classList.remove('hidden');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultElement.classList.add('hidden');
    }
    
    function hideError() {
        errorMessage.classList.add('hidden');
    }
    
    function hideResult() {
        resultElement.classList.add('hidden');
    }
}); 