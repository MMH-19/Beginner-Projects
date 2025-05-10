document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const colorBox = document.getElementById('colorBox');
    const toggleButton = document.getElementById('toggleButton');
    const errorMsg = document.getElementById('errorMsg');
    
    // Color inputs
    const redColor = document.getElementById('redColor');
    const greenColor = document.getElementById('greenColor');
    const blueColor = document.getElementById('blueColor');
    
    // Increment inputs
    const redIncrement = document.getElementById('redIncrement');
    const greenIncrement = document.getElementById('greenIncrement');
    const blueIncrement = document.getElementById('blueIncrement');
    
    // Advanced options
    const intervalInput = document.getElementById('interval');
    const colorFormatSelect = document.getElementById('colorFormat');
    
    // State variables
    let isRunning = false;
    let intervalId = null;
    
    // Create color info display
    const colorInfo = document.createElement('div');
    colorInfo.className = 'current-color-info';
    colorBox.appendChild(colorInfo);
    
    // Initial color application
    updateColorDisplay();
    
    // Validate and apply initial hex values
    [redColor, greenColor, blueColor].forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
            if (!isRunning) {
                updateColorDisplay();
                animateColorChange();
            }
        });
        
        input.addEventListener('blur', () => {
            if (input.value.length === 1) {
                input.value = '0' + input.value;
            } else if (input.value === '') {
                input.value = '00';
            }
            if (!isRunning) {
                updateColorDisplay();
            }
        });
    });
    
    // Disable/enable inputs based on running state
    function toggleInputs(disabled) {
        [redColor, greenColor, blueColor, 
         redIncrement, greenIncrement, blueIncrement,
         intervalInput, colorFormatSelect].forEach(input => {
            input.disabled = disabled;
            
            // Add visual feedback for disabled state
            if (disabled) {
                input.parentElement.classList.add('disabled');
            } else {
                input.parentElement.classList.remove('disabled');
            }
        });
    }
    
    // Toggle button click handler
    toggleButton.addEventListener('click', () => {
        isRunning = !isRunning;
        
        if (isRunning) {
            // Validate inputs before starting
            if (!validateInputs()) {
                isRunning = false;
                return;
            }
            
            toggleButton.textContent = 'Stop';
            toggleButton.classList.add('active');
            toggleButton.setAttribute('aria-pressed', 'true');
            toggleInputs(true);
            
            // Add start animation
            colorBox.classList.add('cycling');
            
            // Start color cycling
            const interval = parseInt(intervalInput.value);
            intervalId = setInterval(cycleColors, interval);
        } else {
            // Stop color cycling
            clearInterval(intervalId);
            toggleButton.textContent = 'Start';
            toggleButton.classList.remove('active');
            toggleButton.setAttribute('aria-pressed', 'false');
            toggleInputs(false);
            
            // Remove cycling animation
            colorBox.classList.remove('cycling');
        }
    });
    
    // Validate all hex inputs
    function validateInputs() {
        const hexRegex = /^[0-9A-F]{1,2}$/;
        
        const inputs = [
            { element: redColor, name: 'Red' },
            { element: greenColor, name: 'Green' },
            { element: blueColor, name: 'Blue' }
        ];
        
        for (const input of inputs) {
            if (!hexRegex.test(input.element.value.toUpperCase())) {
                showError(`${input.name} color must be a valid hex value (00-FF)`);
                return false;
            }
        }
        
        // Clear error message if all inputs are valid
        hideError();
        return true;
    }
    
    // Show error with animation
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.animation = 'shake 0.5s';
        
        // Reset animation
        setTimeout(() => {
            errorMsg.style.animation = '';
        }, 500);
    }
    
    // Hide error
    function hideError() {
        errorMsg.textContent = '';
    }
    
    // Animate color change
    function animateColorChange() {
        colorBox.style.animation = 'none';
        void colorBox.offsetWidth; // Trigger reflow
        colorBox.style.animation = 'pulse 2s infinite alternate';
    }
    
    // Update the color display
    function updateColorDisplay() {
        const format = colorFormatSelect.value;
        let colorText = '';
        
        if (format === 'rgb') {
            const red = redColor.value.padStart(2, '0');
            const green = greenColor.value.padStart(2, '0');
            const blue = blueColor.value.padStart(2, '0');
            
            const hexColor = `#${red}${green}${blue}`;
            colorBox.style.backgroundColor = hexColor;
            colorText = hexColor.toUpperCase();
            
            // Also display RGB values
            const r = parseInt(red, 16);
            const g = parseInt(green, 16);
            const b = parseInt(blue, 16);
            colorText += ` | RGB(${r}, ${g}, ${b})`;
        } else if (format === 'hsl') {
            // Convert RGB to HSL and apply
            const r = parseInt(redColor.value.padStart(2, '0'), 16) / 255;
            const g = parseInt(greenColor.value.padStart(2, '0'), 16) / 255;
            const b = parseInt(blueColor.value.padStart(2, '0'), 16) / 255;
            
            const hsl = rgbToHsl(r, g, b);
            const hslColor = `hsl(${Math.round(hsl[0] * 360)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`;
            colorBox.style.backgroundColor = hslColor;
            
            // Display both hex and HSL values
            const hex = `#${redColor.value.padStart(2, '0')}${greenColor.value.padStart(2, '0')}${blueColor.value.padStart(2, '0')}`;
            colorText = `${hex.toUpperCase()} | ${hslColor}`;
        }
        
        // Update color info display
        colorInfo.textContent = colorText;
        
        // Adjust text color based on background brightness
        const brightness = getBrightness(
            parseInt(redColor.value.padStart(2, '0'), 16),
            parseInt(greenColor.value.padStart(2, '0'), 16),
            parseInt(blueColor.value.padStart(2, '0'), 16)
        );
        
        colorInfo.style.color = brightness > 128 ? '#000000' : '#ffffff';
        colorInfo.style.backgroundColor = brightness > 128 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    }
    
    // Calculate brightness value for readability
    function getBrightness(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }
    
    // Cycle the colors based on increments
    function cycleColors() {
        const format = colorFormatSelect.value;
        
        if (format === 'rgb') {
            // Direct RGB cycling
            ['red', 'green', 'blue'].forEach(color => {
                const colorInput = document.getElementById(`${color}Color`);
                const incrementInput = document.getElementById(`${color}Increment`);
                
                // Convert hex to decimal, add increment, convert back to hex
                let colorValue = parseInt(colorInput.value, 16);
                const increment = parseInt(incrementInput.value);
                
                colorValue = (colorValue + increment) % 256;
                colorInput.value = colorValue.toString(16).padStart(2, '0').toUpperCase();
            });
        } else if (format === 'hsl') {
            // HSL cycling
            const r = parseInt(redColor.value.padStart(2, '0'), 16) / 255;
            const g = parseInt(greenColor.value.padStart(2, '0'), 16) / 255;
            const b = parseInt(blueColor.value.padStart(2, '0'), 16) / 255;
            
            const hsl = rgbToHsl(r, g, b);
            
            // Apply RGB increments in HSL space
            const rInc = parseInt(redIncrement.value) / 255;
            const gInc = parseInt(greenIncrement.value) / 255;
            const bInc = parseInt(blueIncrement.value) / 255;
            
            // Convert incremented RGB to HSL
            const newRgb = [
                (r + rInc) % 1,
                (g + gInc) % 1,
                (b + bInc) % 1
            ];
            
            const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
            
            // Update RGB inputs
            redColor.value = Math.round((rgb[0] + rInc) % 1 * 255).toString(16).padStart(2, '0').toUpperCase();
            greenColor.value = Math.round((rgb[1] + gInc) % 1 * 255).toString(16).padStart(2, '0').toUpperCase();
            blueColor.value = Math.round((rgb[2] + bInc) % 1 * 255).toString(16).padStart(2, '0').toUpperCase();
        }
        
        updateColorDisplay();
    }
    
    // RGB to HSL conversion
    function rgbToHsl(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return [h, s, l];
    }
    
    // HSL to RGB conversion
    function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [r, g, b];
    }
    
    // Update interval when changed
    intervalInput.addEventListener('change', () => {
        if (isRunning) {
            clearInterval(intervalId);
            intervalId = setInterval(cycleColors, parseInt(intervalInput.value));
        }
    });
    
    // Update color format display when changed
    colorFormatSelect.addEventListener('change', () => {
        if (!isRunning) {
            updateColorDisplay();
        }
    });
    
    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.code === 'Space') {
            // Prevent space from scrolling page
            e.preventDefault();
            // Toggle start/stop
            toggleButton.click();
        }
    });
}); 