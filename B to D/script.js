document.addEventListener('DOMContentLoaded', function() {
    const binaryInput = document.getElementById('binary-input');
    const convertBtn = document.getElementById('convert-btn');
    const decimalResult = document.getElementById('decimal-result');
    const errorMessage = document.getElementById('error-message');

    // Add input validation to check for only 0s and 1s
    binaryInput.addEventListener('input', function() {
        const value = this.value;
        
        // Use regex to validate binary input
        if (value === '') {
            errorMessage.textContent = '';
            return;
        }
        
        if (!/^[01]+$/.test(value)) {
            errorMessage.textContent = 'Please enter only 0s and 1s';
            // Remove any invalid characters
            this.value = value.replace(/[^01]/g, '');
        } else {
            errorMessage.textContent = '';
        }
    });

    // Convert binary to decimal when button is clicked
    convertBtn.addEventListener('click', convertBinaryToDecimal);
    
    // Also convert when Enter key is pressed
    binaryInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            convertBinaryToDecimal();
        }
    });

    function convertBinaryToDecimal() {
        const binary = binaryInput.value;
        
        if (binary === '') {
            errorMessage.textContent = 'Please enter a binary number';
            return;
        }
        
        if (!/^[01]+$/.test(binary)) {
            errorMessage.textContent = 'Please enter only 0s and 1s';
            return;
        }
        
        // Convert binary to decimal using a single mathematical function
        // parseInt() with a radix of 2 converts a binary string to decimal
        const decimal = parseInt(binary, 2);
        
        // Display the result
        decimalResult.textContent = decimal;
    }
}); 