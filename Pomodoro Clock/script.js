// DOM Elements
const timerElement = document.getElementById('timer');
const timerLabelElement = document.getElementById('timer-label');
const sessionCountElement = document.getElementById('session-count');
const startPauseButton = document.getElementById('start-pause');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const timerSound = document.getElementById('timer-sound');

// Settings Elements
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');
const enableSoundCheckbox = document.getElementById('enable-sound');
const timerContainer = document.querySelector('.timer-container');

// Timer variables
let timerInterval;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isPaused = false;
let isWorkSession = true;
let sessionCount = 1;
let breakCount = 0;

// Initialize timer display
updateTimerDisplay();

// Event Listeners
startPauseButton.addEventListener('click', toggleStartPause);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
workDurationInput.addEventListener('change', updateSettings);
breakDurationInput.addEventListener('change', updateSettings);
longBreakDurationInput.addEventListener('change', updateSettings);

// Functions
function toggleStartPause() {
    if (!isRunning) {
        // Starting the timer
        isRunning = true;
        isPaused = false;
        startTimer();
        updateStartPauseButton(true);
    } else if (!isPaused) {
        // Pausing the timer
        isPaused = true;
        clearInterval(timerInterval);
        updateStartPauseButton(false);
    } else {
        // Resuming the timer
        isPaused = false;
        startTimer();
        updateStartPauseButton(true);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                // Timer completed
                clearInterval(timerInterval);
                playSound();
                switchTimerMode();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    updateStartPauseButton(false);
    
    // Reset to the beginning of the current session
    resetToCurrentSessionStart();
    updateTimerDisplay();
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    isWorkSession = true;
    sessionCount = 1;
    breakCount = 0;
    
    minutes = parseInt(workDurationInput.value, 10);
    seconds = 0;
    
    updateTimerDisplay();
    updateTimerLabel();
    updateSessionCount();
    updateStartPauseButton(false);
    updateTimerContainerClass();
}

function updateTimerDisplay() {
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStartPauseButton(isActive) {
    const buttonSpan = startPauseButton.querySelector('span');
    const buttonIcon = startPauseButton.querySelector('i');
    
    if (isActive) {
        startPauseButton.classList.add('pause');
        buttonSpan.textContent = 'Pause';
        buttonIcon.className = 'fa-solid fa-pause';
    } else {
        startPauseButton.classList.remove('pause');
        buttonSpan.textContent = 'Start';
        buttonIcon.className = 'fa-solid fa-play';
    }
}

function switchTimerMode() {
    if (isWorkSession) {
        isWorkSession = false;
        breakCount++;
        
        if (breakCount % 4 === 0) {
            // Long break every 4th break
            minutes = parseInt(longBreakDurationInput.value, 10);
            timerLabelElement.textContent = 'Long Break';
            timerContainer.className = 'timer-container long-break';
        } else {
            minutes = parseInt(breakDurationInput.value, 10);
            timerLabelElement.textContent = 'Break Session';
            timerContainer.className = 'timer-container break';
        }
    } else {
        isWorkSession = true;
        sessionCount++;
        minutes = parseInt(workDurationInput.value, 10);
        timerLabelElement.textContent = 'Work Session';
        timerContainer.className = 'timer-container work';
        updateSessionCount();
    }
    
    seconds = 0;
    updateTimerDisplay();
    
    // Auto-start the next session
    if (isRunning) {
        startTimer();
    }
}

function resetToCurrentSessionStart() {
    if (isWorkSession) {
        minutes = parseInt(workDurationInput.value, 10);
    } else {
        if (breakCount % 4 === 0) {
            minutes = parseInt(longBreakDurationInput.value, 10);
        } else {
            minutes = parseInt(breakDurationInput.value, 10);
        }
    }
    seconds = 0;
}

function updateTimerLabel() {
    if (isWorkSession) {
        timerLabelElement.textContent = 'Work Session';
        timerContainer.className = 'timer-container work';
    } else {
        if (breakCount % 4 === 0) {
            timerLabelElement.textContent = 'Long Break';
            timerContainer.className = 'timer-container long-break';
        } else {
            timerLabelElement.textContent = 'Break Session';
            timerContainer.className = 'timer-container break';
        }
    }
}

function updateSessionCount() {
    sessionCountElement.textContent = `Session ${sessionCount}`;
}

function updateSettings() {
    if (!isRunning || isPaused) {
        resetToCurrentSessionStart();
        updateTimerDisplay();
    }
}

function playSound() {
    if (enableSoundCheckbox.checked) {
        timerSound.currentTime = 0;
        timerSound.play();
    }
}

function updateTimerContainerClass() {
    timerContainer.className = 'timer-container work';
}

// Initialize with work session
updateTimerLabel();
updateTimerContainerClass(); 