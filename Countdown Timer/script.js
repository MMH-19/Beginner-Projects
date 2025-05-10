document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const eventNameInput = document.getElementById('event-name');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeInput = document.getElementById('event-time');
    const startButton = document.getElementById('start-button');
    const countdownContainer = document.getElementById('countdown-container');
    const eventTitle = document.getElementById('event-title');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const nameError = document.getElementById('name-error');
    const dateError = document.getElementById('date-error');
    const timeError = document.getElementById('time-error');
    const savedEventsList = document.getElementById('saved-events');
    const eventsListContainer = document.getElementById('events-list');
    
    // Variables
    let countdownInterval = null;
    let eventsList = JSON.parse(localStorage.getItem('events')) || [];
    let previousValues = {
        days: -1,
        hours: -1,
        minutes: -1,
        seconds: -1
    };
    
    // Initialize date input with today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    eventDateInput.setAttribute('min', formattedDate);
    
    // Set default time to current time + 1 hour
    const nextHour = new Date(today);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    const defaultTime = `${String(nextHour.getHours()).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;
    eventTimeInput.value = defaultTime;
    
    // Load saved events
    loadSavedEvents();
    
    // Event Listeners
    startButton.addEventListener('click', validateAndStartCountdown);
    
    // Input validation with live feedback
    eventNameInput.addEventListener('input', () => {
        if (eventNameInput.value.trim()) {
            nameError.textContent = '';
        }
    });
    
    eventDateInput.addEventListener('change', () => {
        if (eventDateInput.value) {
            const selectedDate = new Date(`${eventDateInput.value}T${eventTimeInput.value || '00:00'}`);
            if (selectedDate < new Date()) {
                dateError.textContent = 'Event date must be in the future';
            } else {
                dateError.textContent = '';
            }
        }
    });
    
    eventTimeInput.addEventListener('change', () => {
        if (eventDateInput.value) {
            const selectedDate = new Date(`${eventDateInput.value}T${eventTimeInput.value || '00:00'}`);
            if (selectedDate < new Date()) {
                dateError.textContent = 'Event date and time must be in the future';
            } else {
                dateError.textContent = '';
            }
        }
    });
    
    // Functions
    function validateAndStartCountdown() {
        // Add button press effect
        startButton.classList.add('pressed');
        setTimeout(() => startButton.classList.remove('pressed'), 200);
        
        // Reset error messages
        nameError.textContent = '';
        dateError.textContent = '';
        timeError.textContent = '';
        
        // Get input values
        const eventName = eventNameInput.value.trim();
        const eventDate = eventDateInput.value;
        const eventTime = eventTimeInput.value || '00:00';
        
        // Validate inputs
        let isValid = true;
        
        if (!eventName) {
            nameError.textContent = 'Event name is required';
            animateError(eventNameInput);
            isValid = false;
        }
        
        if (!eventDate) {
            dateError.textContent = 'Event date is required';
            animateError(eventDateInput);
            isValid = false;
        } else {
            const selectedDate = new Date(`${eventDate}T${eventTime}`);
            if (isNaN(selectedDate.getTime())) {
                dateError.textContent = 'Invalid date format';
                animateError(eventDateInput);
                isValid = false;
            } else if (selectedDate < new Date()) {
                dateError.textContent = 'Event date must be in the future';
                animateError(eventDateInput);
                isValid = false;
            }
        }
        
        // Check if the time difference would overflow
        if (isValid) {
            const eventDateTime = new Date(`${eventDate}T${eventTime}`);
            const currentTime = new Date();
            const diff = eventDateTime - currentTime;
            
            // Roughly 100 years in milliseconds as a reasonable limit
            if (diff > 3153600000000) {
                timeError.textContent = 'Time difference is too large for precise countdown';
                animateError(eventTimeInput);
                isValid = false;
            }
        }
        
        // Start countdown if valid
        if (isValid) {
            startCountdown(eventName, eventDate, eventTime);
            
            // Save event
            saveEvent(eventName, eventDate, eventTime);
        }
    }
    
    function animateError(element) {
        element.classList.add('error-shake');
        setTimeout(() => element.classList.remove('error-shake'), 500);
    }
    
    function startCountdown(name, date, time) {
        // Clear any existing countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // Reset previous values
        previousValues = {
            days: -1,
            hours: -1,
            minutes: -1,
            seconds: -1
        };
        
        // Set event title
        eventTitle.textContent = name;
        
        // Show countdown container with animation
        countdownContainer.style.display = 'block';
        
        // Force reflow for animation
        void countdownContainer.offsetWidth;
        
        // Add visible class for animation
        countdownContainer.classList.add('visible');
        
        // Set target date
        const targetDate = new Date(`${date}T${time}`);
        
        // Update countdown immediately
        updateCountdown(targetDate);
        
        // Start interval to update countdown
        countdownInterval = setInterval(() => {
            updateCountdown(targetDate);
        }, 1000);
    }
    
    function updateCountdown(targetDate) {
        const currentTime = new Date();
        let diff = targetDate - currentTime;
        
        // If countdown is finished
        if (diff <= 0) {
            clearInterval(countdownInterval);
            countdownContainer.innerHTML = `
                <div class="countdown-complete">
                    <h2>Event "${eventTitle.textContent}" has started!</h2>
                    <div class="celebration">🎉</div>
                </div>
            `;
            
            // Add animation class
            countdownContainer.classList.add('event-reached');
            
            // Alert when event is reached
            setTimeout(() => {
                alert(`Event "${eventTitle.textContent}" has started!`);
            }, 500);
            
            return;
        }
        
        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        
        const seconds = Math.floor(diff / 1000);
        
        // Check if values have changed and add animation class
        if (days !== previousValues.days) {
            animateNumberChange(daysElement, days);
            previousValues.days = days;
        }
        
        if (hours !== previousValues.hours) {
            animateNumberChange(hoursElement, hours);
            previousValues.hours = hours;
        }
        
        if (minutes !== previousValues.minutes) {
            animateNumberChange(minutesElement, minutes);
            previousValues.minutes = minutes;
        }
        
        if (seconds !== previousValues.seconds) {
            animateNumberChange(secondsElement, seconds);
            previousValues.seconds = seconds;
        }
        
        // Add urgency pulse effect when less than 1 hour remains
        const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
        const allBoxes = document.querySelectorAll('.countdown-box');
        
        if (totalSeconds <= 3600) {
            allBoxes.forEach(box => box.classList.add('urgent'));
        } else {
            allBoxes.forEach(box => box.classList.remove('urgent'));
        }
    }
    
    function animateNumberChange(element, newValue) {
        element.parentElement.classList.add('flip');
        element.textContent = newValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.parentElement.classList.remove('flip');
        }, 600);
    }
    
    function saveEvent(name, date, time) {
        const event = {
            id: Date.now(), // Use timestamp as ID
            name,
            date,
            time,
            targetDate: new Date(`${date}T${time}`).getTime()
        };
        
        // Add to events list
        eventsList.push(event);
        
        // Save to localStorage
        localStorage.setItem('events', JSON.stringify(eventsList));
        
        // Update UI with animation
        loadSavedEvents();
    }
    
    function loadSavedEvents() {
        if (eventsList.length > 0) {
            eventsListContainer.style.display = 'block';
            
            // Force reflow for animation
            void eventsListContainer.offsetWidth;
            
            // Add visible class for animation
            eventsListContainer.classList.add('visible');
            
            savedEventsList.innerHTML = '';
            
            // Sort events by date (closest first)
            eventsList.sort((a, b) => a.targetDate - b.targetDate);
            
            // Current time for filtering
            const now = Date.now();
            
            // Filter out past events
            eventsList = eventsList.filter(event => event.targetDate > now);
            
            // Update localStorage with filtered list
            localStorage.setItem('events', JSON.stringify(eventsList));
            
            // Create list items with staggered animation
            eventsList.forEach((event, index) => {
                const li = document.createElement('li');
                li.style.setProperty('--index', index);
                
                // Format date for display
                const eventDate = new Date(event.targetDate);
                const dateString = eventDate.toLocaleDateString();
                const timeString = eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                // Calculate time remaining
                const timeRemaining = getTimeRemainingText(now, eventDate);
                
                li.innerHTML = `
                    <div class="event-info">
                        <strong>${event.name}</strong>
                        <span>${dateString} at ${timeString}</span>
                        <span class="remaining-time">${timeRemaining}</span>
                    </div>
                    <div class="event-controls">
                        <button class="load-btn" data-id="${event.id}">Load</button>
                        <button class="delete-btn" data-id="${event.id}">Delete</button>
                    </div>
                `;
                
                savedEventsList.appendChild(li);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.load-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const event = eventsList.find(event => event.id === id);
                    
                    if (event) {
                        // Set form values
                        eventNameInput.value = event.name;
                        eventDateInput.value = event.date;
                        eventTimeInput.value = event.time;
                        
                        // Start countdown with animation
                        startCountdown(event.name, event.date, event.time);
                        
                        // Scroll to countdown
                        countdownContainer.scrollIntoView({behavior: 'smooth'});
                    }
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const li = e.target.closest('li');
                    
                    // Animate removal
                    li.style.opacity = '0';
                    li.style.transform = 'translateX(100px)';
                    li.style.height = li.offsetHeight + 'px';
                    
                    setTimeout(() => {
                        li.style.height = '0';
                        li.style.padding = '0';
                        li.style.margin = '0';
                        li.style.borderBottom = 'none';
                        
                        setTimeout(() => {
                            // Remove from array
                            eventsList = eventsList.filter(event => event.id !== id);
                            
                            // Update localStorage
                            localStorage.setItem('events', JSON.stringify(eventsList));
                            
                            // Reload list
                            loadSavedEvents();
                            
                            // Hide container if no events
                            if (eventsList.length === 0) {
                                eventsListContainer.classList.remove('visible');
                                setTimeout(() => {
                                    eventsListContainer.style.display = 'none';
                                }, 500);
                            }
                        }, 300);
                    }, 300);
                });
            });
        } else {
            eventsListContainer.classList.remove('visible');
            setTimeout(() => {
                eventsListContainer.style.display = 'none';
            }, 500);
        }
    }
    
    function getTimeRemainingText(now, eventDate) {
        const diff = eventDate - now;
        
        if (diff <= 0) {
            return 'Event has passed';
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} remaining`;
        } else if (hours > 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
        } else {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
        }
    }
    
    // Update remaining time in saved events list every minute
    setInterval(() => {
        const remainingTimes = document.querySelectorAll('.remaining-time');
        const now = new Date();
        
        eventsList.forEach((event, index) => {
            if (remainingTimes[index]) {
                const eventDate = new Date(event.targetDate);
                remainingTimes[index].textContent = getTimeRemainingText(now, eventDate);
            }
        });
    }, 60000);
}); 