// DOM elements
const plaintextInput = document.getElementById('plaintext');
const keyInput = document.getElementById('key');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const compareBtn = document.getElementById('compare-btn');
const resultDisplay = document.getElementById('result');
const comparisonResult = document.getElementById('comparison-result');

// Store original message and encrypted message
let originalMessage = '';
let encryptedMessage = '';

// Event listeners
encryptBtn.addEventListener('click', handleEncrypt);
decryptBtn.addEventListener('click', handleDecrypt);
compareBtn.addEventListener('click', compareMessages);

// Encrypt the message using Vigenere Cipher
function handleEncrypt() {
    const message = plaintextInput.value.trim();
    const key = keyInput.value.trim();
    
    // Validate inputs
    if (!message || !key) {
        showError('Both message and key are required');
        return;
    }
    
    // Store original message for later comparison
    originalMessage = message;
    
    // Perform encryption
    encryptedMessage = vigenereEncrypt(message, key);
    
    // Display result
    resultDisplay.textContent = encryptedMessage;
    
    // Enable decrypt button
    decryptBtn.disabled = false;
    
    // Disable compare button (will be enabled after decryption)
    compareBtn.disabled = true;
}

// Decrypt the message using Vigenere Cipher
function handleDecrypt() {
    const key = keyInput.value.trim();
    
    // Validate inputs
    if (!encryptedMessage || !key) {
        showError('Missing encrypted message or key');
        return;
    }
    
    // Perform decryption
    const decryptedMessage = vigenereDecrypt(encryptedMessage, key);
    
    // Display result
    resultDisplay.textContent = decryptedMessage;
    
    // Enable compare button
    compareBtn.disabled = false;
}

// Compare original message with decrypted message
function compareMessages() {
    const currentResult = resultDisplay.textContent;
    
    if (originalMessage === currentResult) {
        comparisonResult.textContent = 'Success: Original and decrypted messages match!';
        comparisonResult.className = 'comparison-result success';
    } else {
        comparisonResult.textContent = 'Error: Original and decrypted messages do not match!';
        comparisonResult.className = 'comparison-result error';
    }
}

// Show error message
function showError(message) {
    resultDisplay.textContent = `Error: ${message}`;
    resultDisplay.classList.add('error');
    
    // Clear error after 3 seconds
    setTimeout(() => {
        resultDisplay.classList.remove('error');
    }, 3000);
}

// Vigenere Cipher Encryption Algorithm
function vigenereEncrypt(text, key) {
    let result = '';
    key = key.toUpperCase();
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Only encrypt alphabet characters
        if (/[A-Za-z]/.test(char)) {
            // Determine if uppercase or lowercase
            const isUpperCase = char === char.toUpperCase();
            const plainCharCode = char.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
            const keyCharCode = key.charCodeAt(keyIndex % key.length) - 65;
            
            // Apply Vigenere formula: (plaintext + key) % 26
            let encryptedCharCode = (plainCharCode + keyCharCode) % 26;
            
            // Convert back to character
            let encryptedChar = String.fromCharCode(encryptedCharCode + 65);
            
            // Maintain original case
            if (!isUpperCase) {
                encryptedChar = encryptedChar.toLowerCase();
            }
            
            result += encryptedChar;
            keyIndex++;
        } else {
            // Keep non-alphabet characters as they are
            result += char;
        }
    }
    
    return result;
}

// Vigenere Cipher Decryption Algorithm
function vigenereDecrypt(text, key) {
    let result = '';
    key = key.toUpperCase();
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Only decrypt alphabet characters
        if (/[A-Za-z]/.test(char)) {
            // Determine if uppercase or lowercase
            const isUpperCase = char === char.toUpperCase();
            const encryptedCharCode = char.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
            const keyCharCode = key.charCodeAt(keyIndex % key.length) - 65;
            
            // Apply Vigenere decryption: (ciphertext - key + 26) % 26
            let decryptedCharCode = (encryptedCharCode - keyCharCode + 26) % 26;
            
            // Convert back to character
            let decryptedChar = String.fromCharCode(decryptedCharCode + 65);
            
            // Maintain original case
            if (!isUpperCase) {
                decryptedChar = decryptedChar.toLowerCase();
            }
            
            result += decryptedChar;
            keyIndex++;
        } else {
            // Keep non-alphabet characters as they are
            result += char;
        }
    }
    
    return result;
} 