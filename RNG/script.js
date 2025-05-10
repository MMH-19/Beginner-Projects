document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    const allowNegative = document.getElementById('allow-negative');
    const allowDecimal = document.getElementById('allow-decimal');
    const generateButton = document.getElementById('generate');
    const resultElement = document.getElementById('result');

    // Add event listeners
    generateButton.addEventListener('click', generateRandomNumber);
    
    // Initial validation
    minInput.addEventListener('input', validateInputs);
    maxInput.addEventListener('input', validateInputs);
    allowNegative.addEventListener('change', updateMinMax);
    allowDecimal.addEventListener('change', updateInputType);

    function updateInputType() {
        if (allowDecimal.checked) {
            minInput.setAttribute('step', '0.01');
            maxInput.setAttribute('step', '0.01');
        } else {
            minInput.setAttribute('step', '1');
            maxInput.setAttribute('step', '1');
            
            // Convert to integers
            minInput.value = Math.floor(Number(minInput.value));
            maxInput.value = Math.floor(Number(maxInput.value));
        }
    }

    function updateMinMax() {
        if (!allowNegative.checked && Number(minInput.value) < 0) {
            minInput.value = 0;
        }
    }

    function validateInputs() {
        let min = Number(minInput.value);
        let max = Number(maxInput.value);
        
        if (!allowNegative.checked && min < 0) {
            min = 0;
            minInput.value = 0;
        }
        
        if (min > max) {
            maxInput.value = min;
        }
    }

    function generateRandomNumber() {
        let min = Number(minInput.value);
        let max = Number(maxInput.value);
        
        if (min > max) {
            [min, max] = [max, min]; // Swap if min is greater than max
            minInput.value = min;
            maxInput.value = max;
        }
        
        let random;
        
        if (allowDecimal.checked) {
            // Generate random decimal number
            random = Math.random() * (max - min) + min;
            random = parseFloat(random.toFixed(2)); // Limit to 2 decimal places
        } else {
            // Generate random integer
            min = Math.ceil(min);
            max = Math.floor(max);
            random = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        // Display the result with animation
        resultElement.textContent = random;
        resultElement.classList.add('highlight');
        
        setTimeout(() => {
            resultElement.classList.remove('highlight');
        }, 500);
    }

    // Initial validation
    validateInputs();
    updateInputType();
}); 