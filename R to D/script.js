document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const romanInput = document.getElementById('roman-input');
    const decimalInput = document.getElementById('decimal-input');
    const convertToDecimalBtn = document.getElementById('convert-to-decimal');
    const convertToRomanBtn = document.getElementById('convert-to-roman');
    const decimalResult = document.getElementById('decimal-result');
    const romanResult = document.getElementById('roman-result');
    const romanError = document.getElementById('roman-error');
    const decimalError = document.getElementById('decimal-error');

    // Map of Roman numerals and their values
    const romanValues = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };

    // Convert Roman numeral to decimal
    function romanToDecimal(roman) {
        if (!roman) return null;
        
        roman = roman.toUpperCase();
        const validRomanPattern = /^[IVXLCDM]+$/;
        
        if (!validRomanPattern.test(roman)) {
            return { error: 'Invalid Roman numeral. Only I, V, X, L, C, D, M characters allowed.' };
        }
        
        let result = 0;
        let prevValue = 0;
        
        // Loop through the roman numeral from right to left
        for (let i = roman.length - 1; i >= 0; i--) {
            const currentChar = roman[i];
            const currentValue = romanValues[currentChar];
            
            if (!currentValue) {
                return { error: `Invalid Roman numeral character: ${currentChar}` };
            }
            
            // If current value is greater than or equal to the previous one, add it
            // Otherwise, subtract it (for cases like IV, IX, etc.)
            if (currentValue >= prevValue) {
                result += currentValue;
            } else {
                result -= currentValue;
            }
            
            prevValue = currentValue;
        }
        
        // Check for invalid Roman numeral patterns
        if (!isValidRoman(roman)) {
            return { error: 'Invalid Roman numeral format' };
        }
        
        return result;
    }

    // Check if the Roman numeral follows standard rules
    function isValidRoman(roman) {
        // Check for more than 3 consecutive same characters
        if (/IIII|XXXX|CCCC|MMMM/.test(roman)) {
            return false;
        }
        
        // Check for invalid subtractive combinations
        if (/I[LCDM]|X[DM]|V[XLCDM]|L[CDM]/.test(roman)) {
            return false;
        }
        
        // Check for more than one smaller value before larger value
        if (/I{2,}[VX]|X{2,}[LC]|C{2,}[DM]/.test(roman)) {
            return false;
        }
        
        return true;
    }

    // Convert decimal to Roman numeral
    function decimalToRoman(num) {
        if (!num) return null;
        
        // Validate input
        num = parseInt(num);
        if (isNaN(num) || num <= 0 || num > 3999) {
            return { error: 'Please enter a number between 1 and 3999' };
        }
        
        const romanNumerals = [
            { value: 1000, symbol: 'M' },
            { value: 900, symbol: 'CM' },
            { value: 500, symbol: 'D' },
            { value: 400, symbol: 'CD' },
            { value: 100, symbol: 'C' },
            { value: 90, symbol: 'XC' },
            { value: 50, symbol: 'L' },
            { value: 40, symbol: 'XL' },
            { value: 10, symbol: 'X' },
            { value: 9, symbol: 'IX' },
            { value: 5, symbol: 'V' },
            { value: 4, symbol: 'IV' },
            { value: 1, symbol: 'I' }
        ];
        
        let result = '';
        
        // Build Roman numeral from largest to smallest values
        for (let i = 0; i < romanNumerals.length; i++) {
            while (num >= romanNumerals[i].value) {
                result += romanNumerals[i].symbol;
                num -= romanNumerals[i].value;
            }
        }
        
        return result;
    }

    // Event listeners for button clicks
    convertToDecimalBtn.addEventListener('click', () => {
        const roman = romanInput.value.trim();
        romanError.textContent = '';
        
        if (!roman) {
            romanError.textContent = 'Please enter a Roman numeral';
            return;
        }
        
        const result = romanToDecimal(roman);
        
        if (result && result.error) {
            romanError.textContent = result.error;
            decimalResult.textContent = 'Result: ';
        } else {
            decimalResult.textContent = `Result: ${result}`;
        }
    });

    convertToRomanBtn.addEventListener('click', () => {
        const decimal = decimalInput.value.trim();
        decimalError.textContent = '';
        
        if (!decimal) {
            decimalError.textContent = 'Please enter a decimal number';
            return;
        }
        
        const result = decimalToRoman(decimal);
        
        if (result && result.error) {
            decimalError.textContent = result.error;
            romanResult.textContent = 'Result: ';
        } else {
            romanResult.textContent = `Result: ${result}`;
        }
    });

    // Bonus feature: Live conversion as user types
    romanInput.addEventListener('input', () => {
        const roman = romanInput.value.trim();
        romanError.textContent = '';
        
        if (!roman) {
            decimalResult.textContent = 'Result: ';
            return;
        }
        
        const result = romanToDecimal(roman);
        
        if (result && result.error) {
            romanError.textContent = result.error;
            decimalResult.textContent = 'Result: ';
        } else {
            decimalResult.textContent = `Result: ${result}`;
        }
    });

    decimalInput.addEventListener('input', () => {
        const decimal = decimalInput.value.trim();
        decimalError.textContent = '';
        
        if (!decimal) {
            romanResult.textContent = 'Result: ';
            return;
        }
        
        const result = decimalToRoman(decimal);
        
        if (result && result.error) {
            decimalError.textContent = result.error;
            romanResult.textContent = 'Result: ';
        } else {
            romanResult.textContent = `Result: ${result}`;
        }
    });
}); 