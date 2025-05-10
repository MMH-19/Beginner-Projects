document.addEventListener('DOMContentLoaded', () => {
    const value1Input = document.getElementById('value1');
    const value2Input = document.getElementById('value2');
    const type1Select = document.getElementById('type1');
    const type2Select = document.getElementById('type2');
    const operatorSelect = document.getElementById('operator');
    const evaluateButton = document.getElementById('evaluate');
    const resultDiv = document.getElementById('result');
    const resultValueDiv = document.getElementById('result-value');
    const warningDiv = document.getElementById('warning');
    
    evaluateButton.addEventListener('click', () => {
        // Clear previous results and warnings
        resultDiv.classList.add('hidden');
        warningDiv.classList.add('hidden');
        warningDiv.textContent = '';
        
        const value1 = value1Input.value.trim();
        const value2 = value2Input.value.trim();
        const operator = operatorSelect.value;
        
        // Validate inputs
        if (!value1 || !value2) {
            showWarning('Both values must be provided.');
            return;
        }
        
        // Convert values according to selected types
        const convertedValue1 = convertValue(value1, type1Select.value);
        const convertedValue2 = convertValue(value2, type2Select.value);
        
        if (convertedValue1 === null || convertedValue2 === null) {
            showWarning('Invalid value conversion. Please check your inputs.');
            return;
        }
        
        // Perform the comparison
        const result = evaluateComparison(convertedValue1, operator, convertedValue2);
        
        // Display result
        resultDiv.classList.remove('hidden');
        resultValueDiv.textContent = result ? 'TRUE' : 'FALSE';
        resultValueDiv.className = result ? 'true' : 'false';
    });
    
    function convertValue(value, type) {
        try {
            switch (type) {
                case 'asIs':
                    // Try to parse it as JSON if possible
                    if (value.toLowerCase() === 'true') return true;
                    if (value.toLowerCase() === 'false') return false;
                    if (value === 'null') return null;
                    if (value === 'undefined') return undefined;
                    
                    // Try to parse as number
                    const num = Number(value);
                    if (!isNaN(num)) return num;
                    
                    // Otherwise treat as string
                    return value;
                    
                case 'string':
                    return String(value);
                    
                case 'number':
                    const parsedNum = Number(value);
                    if (isNaN(parsedNum)) {
                        showWarning(`Could not convert "${value}" to a number.`);
                        return null;
                    }
                    return parsedNum;
                    
                case 'boolean':
                    const lowerValue = value.toLowerCase();
                    if (lowerValue === 'true') return true;
                    if (lowerValue === 'false') return false;
                    if (lowerValue === '1' || lowerValue === 'yes') return true;
                    if (lowerValue === '0' || lowerValue === 'no') return false;
                    
                    showWarning(`Could not convert "${value}" to a boolean. Valid values include: true, false, 1, 0, yes, no`);
                    return null;
                    
                default:
                    return value;
            }
        } catch (error) {
            showWarning(`Error converting value: ${error.message}`);
            return null;
        }
    }
    
    function evaluateComparison(value1, operator, value2) {
        switch (operator) {
            case '===': 
                return value1 === value2;
            case '==': 
                return value1 == value2;
            case '!=': 
                return value1 != value2;
            case '!==': 
                return value1 !== value2;
            case '>': 
                return value1 > value2;
            case '<': 
                return value1 < value2;
            case '>=': 
                return value1 >= value2;
            case '<=': 
                return value1 <= value2;
            default:
                showWarning(`Invalid operator: ${operator}`);
                return null;
        }
    }
    
    function showWarning(message) {
        warningDiv.textContent = message;
        warningDiv.classList.remove('hidden');
    }
}); 