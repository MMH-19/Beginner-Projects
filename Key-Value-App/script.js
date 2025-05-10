document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const keyValue = document.getElementById('key-value');
    const keyCode = document.getElementById('key-code');
    const altKeyStatus = document.getElementById('alt-key');
    const ctrlKeyStatus = document.getElementById('ctrl-key');
    const metaKeyStatus = document.getElementById('meta-key');
    const shiftKeyStatus = document.getElementById('shift-key');
    const historyContainer = document.getElementById('key-history-container');
    const visualKeyboard = document.getElementById('visual-keyboard');
    const themeToggle = document.getElementById('theme-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    
    // Audio context for bonus feature
    let audioContext;
    let isSoundEnabled = true;
    let keyHistory = [];
    const MAX_HISTORY = 10;
    
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        themeToggle.innerHTML = isDarkTheme 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
            
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
    
    // Sound toggle functionality
    soundToggle.addEventListener('change', () => {
        isSoundEnabled = soundToggle.checked;
        const toggleText = soundToggle.nextElementSibling;
        toggleText.textContent = isSoundEnabled ? 'Sound: ON' : 'Sound: OFF';
    });
    
    // Initialize audio context on first user interaction (required by browsers)
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    // Create a standard QWERTY keyboard layout
    const createVisualKeyboard = () => {
        const keyRows = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
        ];
        
        visualKeyboard.innerHTML = '';
        
        keyRows.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.classList.add('keyboard-row');
            
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.classList.add('key');
                keyElement.dataset.key = key.toLowerCase();
                keyElement.textContent = key;
                
                // Add special sizing for certain keys
                if (['Backspace', 'Tab', 'Caps', 'Enter', 'Shift', 'Ctrl'].includes(key)) {
                    keyElement.style.minWidth = '60px';
                }
                
                if (key === 'Space') {
                    keyElement.style.minWidth = '180px';
                    keyElement.textContent = '';
                }
                
                keyboardRow.appendChild(keyElement);
            });
            
            visualKeyboard.appendChild(keyboardRow);
        });
    };
    
    // Create the visual keyboard
    createVisualKeyboard();
    
    // Enhanced play tone function for better audio experience
    function playTone(frequency) {
        if (!audioContext || !isSoundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Use a more complex waveform for richer sound
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Add a bit of detune for a more natural sound
        oscillator.detune.value = Math.random() * 10 - 5;
        
        // Create envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // Generate frequency based on key code with a more musical scale
    function getFrequency(keyCode) {
        // Map key code to notes on a pentatonic scale (more pleasant sounding)
        const baseNote = 261.63; // C4
        const pentatonicRatios = [1, 1.125, 1.25, 1.5, 1.6667]; // C, D, E, G, A
        const noteIndex = keyCode % pentatonicRatios.length;
        
        return baseNote * pentatonicRatios[noteIndex];
    }
    
    // Add key to history
    function addToHistory(key) {
        // Create new history item
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = key;
        
        // Add to history array and DOM
        keyHistory.unshift(key);
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
        
        // Limit history length
        if (keyHistory.length > MAX_HISTORY) {
            keyHistory.pop();
            if (historyContainer.children.length > MAX_HISTORY) {
                historyContainer.removeChild(historyContainer.lastChild);
            }
        }
    }
    
    // Update visual keyboard to show pressed key
    function highlightKey(key) {
        // Convert key to lowercase for matching
        const keyLower = key.toLowerCase();
        
        // Handle special keys
        let dataKey = keyLower;
        if (key === ' ') dataKey = 'space';
        else if (key === 'Control') dataKey = 'ctrl';
        else if (key === 'Meta') dataKey = 'win';
        
        // Find and highlight the key
        const keyElements = document.querySelectorAll('.key');
        keyElements.forEach(el => {
            if (el.dataset.key === dataKey) {
                el.classList.add('pressed');
                
                // Remove highlight after animation
                setTimeout(() => {
                    el.classList.remove('pressed');
                }, 300);
            }
        });
    }
    
    // Handle keyboard events
    document.addEventListener('keydown', (event) => {
        // Initialize audio on first interaction
        initAudioContext();
        
        // Prevent default behavior for some keys
        if (event.key === ' ' || event.key === 'Tab') {
            event.preventDefault();
        }
        
        // Display key value and code
        keyValue.textContent = event.key;
        keyCode.textContent = event.keyCode || event.which; // keyCode for compatibility
        
        // Update modifier key statuses
        altKeyStatus.textContent = event.altKey ? 'True' : 'False';
        ctrlKeyStatus.textContent = event.ctrlKey ? 'True' : 'False';
        metaKeyStatus.textContent = event.metaKey ? 'True' : 'False';
        shiftKeyStatus.textContent = event.shiftKey ? 'True' : 'False';
        
        // Apply color classes for True/False status
        altKeyStatus.className = event.altKey ? 'status true-status' : 'status false-status';
        ctrlKeyStatus.className = event.ctrlKey ? 'status true-status' : 'status false-status';
        metaKeyStatus.className = event.metaKey ? 'status true-status' : 'status false-status';
        shiftKeyStatus.className = event.shiftKey ? 'status true-status' : 'status false-status';
        
        // Enhanced background color effect
        const infoRows = document.querySelectorAll('.info-row');
        infoRows.forEach(row => {
            row.classList.add('active-key');
            setTimeout(() => {
                row.classList.remove('active-key');
            }, 300);
        });
        
        // Add key to history
        addToHistory(event.key);
        
        // Highlight key on visual keyboard
        highlightKey(event.key);
        
        // Play enhanced tone
        playTone(getFrequency(event.keyCode || event.which));
    });
}); 