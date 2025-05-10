document.addEventListener('DOMContentLoaded', function() {
    // Basic controls
    const topLeft = document.getElementById('top-left');
    const topRight = document.getElementById('top-right');
    const bottomRight = document.getElementById('bottom-right');
    const bottomLeft = document.getElementById('bottom-left');
    
    // Advanced controls
    const topLeftH = document.getElementById('top-left-h');
    const topLeftV = document.getElementById('top-left-v');
    const topRightH = document.getElementById('top-right-h');
    const topRightV = document.getElementById('top-right-v');
    const bottomRightH = document.getElementById('bottom-right-h');
    const bottomRightV = document.getElementById('bottom-right-v');
    const bottomLeftH = document.getElementById('bottom-left-h');
    const bottomLeftV = document.getElementById('bottom-left-v');
    
    // Toggle for advanced controls
    const toggleAdvanced = document.getElementById('toggle-advanced');
    const advancedInputs = document.getElementById('advanced-inputs');
    
    // Preview box and CSS code
    const previewBox = document.getElementById('preview-box');
    const cssCode = document.getElementById('css-code');
    const copyBtn = document.getElementById('copy-btn');
    
    // Function to update the border radius
    function updateBorderRadius() {
        // Get values from inputs
        const tlVal = topLeft.value;
        const trVal = topRight.value;
        const brVal = bottomRight.value;
        const blVal = bottomLeft.value;
        
        // Set basic border radius
        if (!toggleAdvanced.checked) {
            const borderRadius = `${tlVal}px ${trVal}px ${brVal}px ${blVal}px`;
            previewBox.style.borderRadius = borderRadius;
            cssCode.textContent = `border-radius: ${borderRadius};`;
            
            // Update advanced controls to match basic controls
            topLeftH.value = tlVal;
            topLeftV.value = tlVal;
            topRightH.value = trVal;
            topRightV.value = trVal;
            bottomRightH.value = brVal;
            bottomRightV.value = brVal;
            bottomLeftH.value = blVal;
            bottomLeftV.value = blVal;
        } else {
            // Get values from advanced inputs
            const tlHVal = topLeftH.value;
            const tlVVal = topLeftV.value;
            const trHVal = topRightH.value;
            const trVVal = topRightV.value;
            const brHVal = bottomRightH.value;
            const brVVal = bottomRightV.value;
            const blHVal = bottomLeftH.value;
            const blVVal = bottomLeftV.value;
            
            // Set advanced border radius
            const borderRadius = `${tlHVal}px ${trHVal}px ${brHVal}px ${blHVal}px / ${tlVVal}px ${trVVal}px ${brVVal}px ${blVVal}px`;
            previewBox.style.borderRadius = borderRadius;
            cssCode.textContent = `border-radius: ${borderRadius};`;
        }
    }
    
    // Add event listeners to basic controls
    [topLeft, topRight, bottomRight, bottomLeft].forEach(input => {
        input.addEventListener('input', updateBorderRadius);
    });
    
    // Add event listeners to advanced controls
    [topLeftH, topLeftV, topRightH, topRightV, bottomRightH, bottomRightV, bottomLeftH, bottomLeftV].forEach(input => {
        input.addEventListener('input', updateBorderRadius);
    });
    
    // Toggle advanced controls
    toggleAdvanced.addEventListener('change', function() {
        if (this.checked) {
            advancedInputs.classList.add('active');
            
            // Enable advanced inputs
            [topLeftH, topLeftV, topRightH, topRightV, bottomRightH, bottomRightV, bottomLeftH, bottomLeftV].forEach(input => {
                input.disabled = false;
            });
            
            // Disable basic inputs
            [topLeft, topRight, bottomRight, bottomLeft].forEach(input => {
                input.disabled = true;
            });
        } else {
            advancedInputs.classList.remove('active');
            
            // Disable advanced inputs
            [topLeftH, topLeftV, topRightH, topRightV, bottomRightH, bottomRightV, bottomLeftH, bottomLeftV].forEach(input => {
                input.disabled = true;
            });
            
            // Enable basic inputs
            [topLeft, topRight, bottomRight, bottomLeft].forEach(input => {
                input.disabled = false;
            });
        }
        
        updateBorderRadius();
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        const textToCopy = cssCode.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Visual feedback that text was copied
            copyBtn.classList.add('copy-success');
            copyBtn.textContent = 'Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copy-success');
                copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
    
    // Initial update
    updateBorderRadius();
}); 