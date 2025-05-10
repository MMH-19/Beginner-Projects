document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const toggleBtn = document.getElementById('toggleBtn');
    const intervalRange = document.getElementById('intervalRange');
    const intervalValue = document.getElementById('intervalValue');
    const intensityRange = document.getElementById('intensityRange');
    const intensityValue = document.getElementById('intensityValue');
    const sizeRange = document.getElementById('sizeRange');
    const sizeValue = document.getElementById('sizeValue');
    const rowsRange = document.getElementById('rowsRange');
    const rowsValue = document.getElementById('rowsValue');
    const lightsContainer = document.querySelector('.lights-container');
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    // Initial state
    let isRunning = false;
    let interval = parseInt(intervalRange.value);
    let activeIndex = 0;
    let animationTimer = null;
    let animationMode = 'ripple'; // ripple, twinkle, wave, chase
    const lightPatterns = ['ripple', 'twinkle', 'wave', 'chase'];
    let patternIndex = 0;

    // Add pattern selector to the DOM
    const patternContainer = document.createElement('div');
    patternContainer.className = 'pattern-control';
    patternContainer.innerHTML = `
        <label>Pattern:</label>
        <select id="patternSelect">
            <option value="ripple">Ripple</option>
            <option value="twinkle">Twinkle</option>
            <option value="wave">Wave</option>
            <option value="chase">Chase</option>
        </select>
    `;
    
    // Insert after speed control
    const speedControl = document.querySelector('.speed-control');
    speedControl.parentNode.insertBefore(patternContainer, speedControl.nextSibling);
    
    const patternSelect = document.getElementById('patternSelect');
    
    const defaultColors = [
        '#ff0000', // red
        '#ffa500', // orange
        '#ffff00', // yellow
        '#00ff00', // green
        '#00ffff', // cyan
        '#0000ff', // blue
        '#ff00ff'  // magenta
    ];
    
    // Update functions
    function updateIntervalDisplay() {
        intervalValue.textContent = `${intervalRange.value}ms`;
        interval = parseInt(intervalRange.value);
        
        if (isRunning) {
            restartAnimation();
        }
    }
    
    function updateIntensityDisplay() {
        const percentage = Math.round(intensityRange.value * 100);
        intensityValue.textContent = `${percentage}%`;
        document.documentElement.style.setProperty('--max-opacity', intensityRange.value);
    }
    
    function updateSizeDisplay() {
        const size = sizeRange.value;
        sizeValue.textContent = `${size}px`;
        
        document.querySelectorAll('.light').forEach(light => {
            light.style.width = `${size}px`;
            light.style.height = `${size}px`;
        });
    }
    
    function updatePattern() {
        animationMode = patternSelect.value;
        
        if (isRunning) {
            restartAnimation();
        }
    }
    
    function updateRows() {
        const rowCount = parseInt(rowsRange.value);
        rowsValue.textContent = rowCount;
        
        // Clear existing rows
        lightsContainer.innerHTML = '';
        
        // Create new rows
        for (let i = 0; i < rowCount; i++) {
            const row = document.createElement('div');
            row.className = 'lights-row';
            row.dataset.row = i;
            
            for (let j = 0; j < 7; j++) {
                const light = document.createElement('div');
                light.className = `light`;
                light.dataset.index = j;
                light.dataset.row = i;
                light.style.backgroundColor = colorInputs[j].value;
                light.style.color = colorInputs[j].value;
                light.style.width = `${sizeRange.value}px`;
                light.style.height = `${sizeRange.value}px`;
                row.appendChild(light);
            }
            
            lightsContainer.appendChild(row);
        }
    }
    
    function updateColor(index, color) {
        document.querySelectorAll(`.light[data-index="${index}"]`).forEach(light => {
            light.style.backgroundColor = color;
            light.style.color = color;
        });
    }
    
    // Animation functions
    function animateRipple() {
        const lights = document.querySelectorAll('.light');
        const lightsPerRow = 7;
        
        // Get all lights with the current index across all rows
        const currentLights = document.querySelectorAll(`.light[data-index="${activeIndex}"]`);
        const prevIndex = (activeIndex - 1 + lightsPerRow) % lightsPerRow;
        const prevLights = document.querySelectorAll(`.light[data-index="${prevIndex}"]`);
        
        // Remove active class from previous lights
        prevLights.forEach(light => {
            light.classList.remove('active');
        });
        
        // Add active class to current lights with delay based on row
        currentLights.forEach(light => {
            const rowDelay = parseInt(light.dataset.row) * 100;
            setTimeout(() => {
                light.classList.add('active');
                // Add slight pulse effect
                light.animate([
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(1.15)' },
                    { transform: 'scale(1.1)' }
                ], {
                    duration: 300,
                    easing: 'ease-in-out'
                });
            }, rowDelay);
        });
        
        // Move to next index
        activeIndex = (activeIndex + 1) % lightsPerRow;
    }
    
    function animateTwinkle() {
        const lights = document.querySelectorAll('.light');
        const lightsCount = lights.length;
        
        // Randomly select lights to twinkle
        const twinkleCount = Math.max(1, Math.floor(lightsCount / 4));
        
        // Reset all lights
        lights.forEach(light => {
            if (Math.random() > 0.7) {
                light.classList.remove('active');
            }
        });
        
        // Randomly activate lights
        for (let i = 0; i < twinkleCount; i++) {
            const randomIndex = Math.floor(Math.random() * lightsCount);
            const light = lights[randomIndex];
            
            light.classList.add('active');
            
            // Add twinkle animation
            light.animate([
                { opacity: 'var(--max-opacity)', transform: 'scale(1.1)' },
                { opacity: 'var(--max-opacity)', transform: 'scale(1.0)' },
                { opacity: 'var(--max-opacity)', transform: 'scale(1.1)' }
            ], {
                duration: 500,
                easing: 'ease-in-out'
            });
        }
    }
    
    function animateWave() {
        const rows = document.querySelectorAll('.lights-row');
        const lightsPerRow = 7;
        
        // Clear all active lights
        document.querySelectorAll('.light.active').forEach(light => {
            light.classList.remove('active');
        });
        
        rows.forEach((row, rowIndex) => {
            const lights = row.querySelectorAll('.light');
            
            // Create a wave pattern by calculating offset based on row
            const waveOffset = (rowIndex % 2 === 0) ? activeIndex : (lightsPerRow - 1 - activeIndex);
            
            // Activate light at wave position
            if (lights[waveOffset]) {
                setTimeout(() => {
                    lights[waveOffset].classList.add('active');
                    
                    // Add wave animation
                    lights[waveOffset].animate([
                        { transform: 'scale(1.0)' },
                        { transform: 'scale(1.2)' },
                        { transform: 'scale(1.1)' }
                    ], {
                        duration: 400,
                        easing: 'ease-out'
                    });
                }, rowIndex * 50);
            }
        });
        
        // Move to next index
        activeIndex = (activeIndex + 1) % lightsPerRow;
    }
    
    function animateChase() {
        const rows = document.querySelectorAll('.lights-row');
        const lightsPerRow = 7;
        
        rows.forEach((row, rowIndex) => {
            // Calculate the active index for this row (offset to create chase effect)
            const rowActiveIndex = (activeIndex + rowIndex) % lightsPerRow;
            const prevIndex = (rowActiveIndex - 1 + lightsPerRow) % lightsPerRow;
            
            // Get lights for this row
            const lights = row.querySelectorAll('.light');
            
            // Remove active class from previous light
            if (lights[prevIndex]) {
                lights[prevIndex].classList.remove('active');
            }
            
            // Add active class to current light
            if (lights[rowActiveIndex]) {
                lights[rowActiveIndex].classList.add('active');
                
                // Add trail effect
                const trailLength = 2;
                for (let i = 1; i <= trailLength; i++) {
                    const trailIndex = (rowActiveIndex - i + lightsPerRow) % lightsPerRow;
                    if (lights[trailIndex]) {
                        lights[trailIndex].classList.add('active');
                        lights[trailIndex].style.opacity = (parseFloat(intensityRange.value) * (trailLength - i + 1) / (trailLength + 1)).toString();
                    }
                }
                
                // Remove class from lights beyond trail
                const clearIndex = (rowActiveIndex - trailLength - 1 + lightsPerRow) % lightsPerRow;
                if (lights[clearIndex]) {
                    lights[clearIndex].classList.remove('active');
                    lights[clearIndex].style.opacity = '';
                }
            }
        });
        
        // Move to next index
        activeIndex = (activeIndex + 1) % lightsPerRow;
    }
    
    function animateLights() {
        switch (animationMode) {
            case 'ripple':
                animateRipple();
                break;
            case 'twinkle':
                animateTwinkle();
                break;
            case 'wave':
                animateWave();
                break;
            case 'chase':
                animateChase();
                break;
            default:
                animateRipple();
        }
    }
    
    function startAnimation() {
        isRunning = true;
        toggleBtn.textContent = 'Stop';
        toggleBtn.style.backgroundColor = '#f44336';
        
        // Add starting animation to lights container
        lightsContainer.animate([
            { boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.7)' },
            { boxShadow: 'inset 0 0 50px rgba(255, 255, 255, 0.3)' },
            { boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.7)' }
        ], {
            duration: 1000,
            easing: 'ease-in-out'
        });
        
        // Clear any existing animation
        if (animationTimer) {
            clearInterval(animationTimer);
        }
        
        // Start new animation
        animationTimer = setInterval(animateLights, interval);
    }
    
    function stopAnimation() {
        isRunning = false;
        toggleBtn.textContent = 'Start';
        toggleBtn.style.backgroundColor = '';
        
        // Add stopping animation to lights container
        lightsContainer.animate([
            { boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.7)' },
            { boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.9)' },
            { boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.7)' }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        if (animationTimer) {
            clearInterval(animationTimer);
            animationTimer = null;
        }
        
        // Fade out all lights gradually
        document.querySelectorAll('.light.active').forEach((light, index) => {
            setTimeout(() => {
                light.animate([
                    { opacity: light.style.opacity || 'var(--max-opacity)' },
                    { opacity: '0.3' }
                ], {
                    duration: 400,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
                setTimeout(() => {
                    light.classList.remove('active');
                    light.style.opacity = '';
                }, 400);
            }, index * 50);
        });
        
        activeIndex = 0;
    }
    
    function restartAnimation() {
        if (isRunning) {
            stopAnimation();
            setTimeout(() => {
                startAnimation();
            }, 100);
        }
    }
    
    // Easter egg: Double-click the lights container to cycle through patterns
    lightsContainer.addEventListener('dblclick', () => {
        patternIndex = (patternIndex + 1) % lightPatterns.length;
        animationMode = lightPatterns[patternIndex];
        patternSelect.value = animationMode;
        
        if (isRunning) {
            restartAnimation();
        }
        
        // Show pattern name temporarily
        const notification = document.createElement('div');
        notification.textContent = `Pattern: ${animationMode.charAt(0).toUpperCase() + animationMode.slice(1)}`;
        notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 16px;
            z-index: 100;
            pointer-events: none;
        `;
        lightsContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-out',
                fill: 'forwards'
            });
            setTimeout(() => notification.remove(), 500);
        }, 1500);
    });
    
    // Event listeners
    toggleBtn.addEventListener('click', () => {
        if (isRunning) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
    
    intervalRange.addEventListener('input', updateIntervalDisplay);
    intensityRange.addEventListener('input', updateIntensityDisplay);
    sizeRange.addEventListener('input', updateSizeDisplay);
    rowsRange.addEventListener('input', updateRows);
    patternSelect.addEventListener('change', updatePattern);
    
    colorInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            updateColor(index, input.value);
        });
    });
    
    // Initialize
    updateIntervalDisplay();
    updateIntensityDisplay();
    updateSizeDisplay();
    updateRows();
}); 