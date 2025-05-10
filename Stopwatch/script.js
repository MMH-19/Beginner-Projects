// DOM Elements
const timeDisplay = document.querySelector('.time-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const clearLapsBtn = document.getElementById('clear-laps');
const lapsList = document.getElementById('laps-list');
const timeDisplayContainer = document.querySelector('.time-display-container');
const stopwatchCard = document.querySelector('.stopwatch-card');
const buttons = document.querySelectorAll('button');

// Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 1;

// Initialize animations
function initAnimations() {
    // Initial animation for the stopwatch card
    gsap.from(stopwatchCard, { 
        duration: 1, 
        y: -50, 
        opacity: 0, 
        ease: "back.out(1.7)",
        clearProps: "all" 
    });

    // Button animations
    gsap.from(buttons, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
    });
    
    // Time display animation
    gsap.from(timeDisplay, {
        duration: 0.8,
        scale: 0.5,
        opacity: 0,
        ease: "elastic.out(1, 0.3)",
        delay: 0.5,
        clearProps: "all"
    });
}

// Functions
function formatTime(timeInMilliseconds) {
    let hours = Math.floor(timeInMilliseconds / 3600000);
    let minutes = Math.floor((timeInMilliseconds % 3600000) / 60000);
    let seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    let centiseconds = Math.floor((timeInMilliseconds % 1000) / 10);

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    centiseconds = centiseconds.toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}.${centiseconds}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        startBtn.textContent = ' Resume';
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        
        // Animation for start
        gsap.to(timeDisplayContainer, {
            backgroundColor: "#e8f5e9",
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Pulse animation for the time display
        gsap.to(timeDisplay, {
            textShadow: "0 0 8px rgba(76, 175, 80, 0.5)",
            duration: 0.5
        });
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        
        // Animation for stop
        gsap.to(timeDisplayContainer, {
            backgroundColor: "#ffebee",
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Remove the pulse animation
        gsap.to(timeDisplay, {
            textShadow: "none",
            duration: 0.5
        });
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    lapCounter = 1;
    timeDisplay.textContent = '00:00:00.00';
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    
    // Animation for reset
    gsap.to(timeDisplayContainer, {
        backgroundColor: "linear-gradient(135deg, #f5f7fa, #e4e8eb)",
        duration: 0.5,
        ease: "power2.out"
    });
    
    // Reset time display with animation
    gsap.from(timeDisplay, {
        scale: 0.8,
        opacity: 0.5,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
}

function addLap() {
    if (isRunning) {
        const lapTime = formatTime(elapsedTime);
        const lapItem = document.createElement('li');
        lapItem.innerHTML = `<span>Lap ${lapCounter}</span><span>${lapTime}</span>`;
        lapsList.prepend(lapItem);
        
        // Animation for new lap item
        gsap.from(lapItem, { 
            y: -20, 
            opacity: 0, 
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Highlight animation
        gsap.fromTo(lapItem, 
            { backgroundColor: "rgba(76, 201, 240, 0.3)" },
            { 
                backgroundColor: lapCounter % 2 === 0 ? "rgba(245, 245, 245, 0.5)" : "transparent", 
                duration: 1.5,
                delay: 0.5
            }
        );
        
        lapCounter++;
    }
}

function clearLaps() {
    if (lapsList.children.length > 0) {
        // Animate all lap items out before removing them
        gsap.to(lapsList.children, {
            opacity: 0,
            y: -10,
            stagger: 0.05,
            duration: 0.3,
            onComplete: () => {
                lapsList.innerHTML = '';
                lapCounter = 1;
            }
        });
    }
}

// Button hover animations
function setupButtonAnimations() {
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2,
                ease: "power1.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: "power1.out"
            });
        });
    });
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', addLap);
clearLapsBtn.addEventListener('click', clearLaps);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    resetTimer();
    initAnimations();
    setupButtonAnimations();
}); 