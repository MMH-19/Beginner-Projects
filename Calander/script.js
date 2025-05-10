// DOM Elements
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const addEventBtn = document.getElementById('add-event-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const eventModal = document.getElementById('event-modal');
const modalTitle = document.getElementById('modal-title');
const eventForm = document.getElementById('event-form');
const eventIdInput = document.getElementById('event-id');
const eventDateInput = document.getElementById('event-date');
const eventNameInput = document.getElementById('event-name');
const eventTimeInput = document.getElementById('event-time');
const eventDescriptionInput = document.getElementById('event-description');
const eventColorInput = document.getElementById('event-color');
const eventReminderInput = document.getElementById('event-reminder');
const saveEventBtn = document.getElementById('save-event');
const deleteEventBtn = document.getElementById('delete-event');
const cancelEventBtn = document.getElementById('cancel-event');
const closeModalBtn = document.querySelector('.close');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const closeNotificationBtn = document.getElementById('close-notification');
const colorPresets = document.querySelectorAll('.color-preset');

// Use Luxon for date handling
const DateTime = luxon.DateTime;

// Calendar state
let currentDate = DateTime.now();
let events = [];
let activeReminders = [];
let draggedEvent = null;
let tooltipInstances = [];

// Initialize the calendar
function initCalendar() {
    loadEvents();
    loadTheme();
    renderCalendar();
    setupEventListeners();
    checkReminders();
    initColorPresets();
}

// Initialize color presets
function initColorPresets() {
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            eventColorInput.value = color;
            // Add visual indication of selection
            colorPresets.forEach(p => p.classList.remove('ring-2', 'ring-offset-2'));
            preset.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
        });
    });
}

// Load events from local storage
function loadEvents() {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        // Convert strings back to Date objects
        events.forEach(event => {
            event.date = new Date(event.date);
            if (event.reminderTime) {
                event.reminderTime = new Date(event.reminderTime);
            }
        });
    }
}

// Save events to local storage
function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Load theme from local storage
function loadTheme() {
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    if (darkTheme) {
        document.documentElement.classList.add('dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Toggle theme
function toggleTheme() {
    const isDarkTheme = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkTheme', isDarkTheme);
    
    if (isDarkTheme) {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Render the calendar
function renderCalendar() {
    const year = currentDate.year;
    const month = currentDate.month - 1; // Luxon months are 1-12, JS Date months are 0-11
    
    // Update the header with animation
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthYear.textContent = `${monthNames[month]} ${year}`;
    monthYear.classList.add('animate__animated', 'animate__fadeIn', 'animate__faster');
    setTimeout(() => {
        monthYear.classList.remove('animate__animated', 'animate__fadeIn', 'animate__faster');
    }, 500);
    
    // Clear existing tooltips
    clearTooltips();
    
    // Clear the calendar
    calendarDays.innerHTML = '';
    
    // Convert to JS Date for compatibility with existing code
    const jsCurrentDate = new Date(year, month, 1);
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Get the last day of the previous month
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    // Calculate total days to display (previous month days + current month days + next month days)
    const totalDays = 42; // 6 rows of 7 days
    
    // Get today's date for highlighting
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    
    // Create each day element with staggered animation
    for (let i = 0; i < totalDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'rounded-lg', 'border', 'border-gray-200', 'dark:border-gray-700', 
                               'overflow-hidden', 'transition-all', 'duration-200', 'hover:shadow-md');
        
        // Add staggered animation
        const delay = i * 15; // 15ms delay per item
        dayElement.style.animationDelay = `${delay}ms`;
        dayElement.classList.add('animate__animated', 'animate__fadeIn', 'animate__faster');
        
        let date;
        let dayNumber;
        
        // Previous month days
        if (i < firstDayOfWeek) {
            dayNumber = lastDayOfPrevMonth - (firstDayOfWeek - i - 1);
            date = new Date(year, month - 1, dayNumber);
            dayElement.classList.add('other-month', 'bg-gray-50', 'dark:bg-gray-800', 'opacity-50');
        } 
        // Next month days
        else if (i >= firstDayOfWeek + lastDayOfMonth.getDate()) {
            dayNumber = i - (firstDayOfWeek + lastDayOfMonth.getDate()) + 1;
            date = new Date(year, month + 1, dayNumber);
            dayElement.classList.add('other-month', 'bg-gray-50', 'dark:bg-gray-800', 'opacity-50');
        } 
        // Current month days
        else {
            dayNumber = i - firstDayOfWeek + 1;
            date = new Date(year, month, dayNumber);
            dayElement.classList.add('bg-white', 'dark:bg-gray-800');
            
            // Highlight today
            if (isCurrentMonth && dayNumber === today.getDate()) {
                dayElement.classList.add('today', 'bg-blue-50', 'dark:bg-blue-900/20', 'border-primary', 'dark:border-dark-primary');
            }
        }
        
        // Set the day number
        const dayNumberElement = document.createElement('div');
        dayNumberElement.classList.add('day-number', 'text-sm', 'font-semibold', 
                                     'text-gray-800', 'dark:text-gray-200', 'absolute', 'top-2', 'right-2');
        dayNumberElement.textContent = dayNumber;
        dayElement.appendChild(dayNumberElement);
        
        // Create a container for events
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events-container', 'mt-6', 'overflow-y-auto', 'max-h-[75px]', 'px-1');
        dayElement.appendChild(eventsContainer);
        
        // Add data attribute for the date
        dayElement.dataset.date = date.toISOString();
        
        // Append the day to the calendar
        calendarDays.appendChild(dayElement);
        
        // Add events for this day
        renderEventsForDay(date, eventsContainer);
    }
}

// Clear tooltips
function clearTooltips() {
    tooltipInstances.forEach(instance => {
        if (instance.destroy) instance.destroy();
    });
    tooltipInstances = [];
}

// Render events for a specific day
function renderEventsForDay(date, container) {
    const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date.getDate() && 
               eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
    });
    
    // Sort events by time
    dayEvents.sort((a, b) => {
        return a.time ? a.time.localeCompare(b.time || '') : -1;
    });
    
    // Render each event
    dayEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event', 'mb-1', 'p-1.5', 'rounded', 'text-xs', 
                                'overflow-hidden', 'whitespace-nowrap', 'text-ellipsis',
                                'cursor-pointer', 'transition-all', 'hover:opacity-90',
                                'animate__animated', 'animate__fadeIn', 'animate__faster');
        eventElement.style.backgroundColor = event.color || '#4e42f5';
        eventElement.style.color = '#fff';
        
        let eventText = event.name;
        if (event.time) {
            eventText = `${event.time} - ${event.name}`;
        }
        
        eventElement.textContent = eventText;
        eventElement.dataset.eventId = event.id;
        
        // Add event listeners for drag and drop
        eventElement.draggable = true;
        eventElement.addEventListener('dragstart', handleDragStart);
        eventElement.addEventListener('click', () => openEditEventModal(event));
        
        container.appendChild(eventElement);
        
        // Add tooltip for event details
        const tooltip = tippy(eventElement, {
            content: `<div class="p-2">
                        <div class="font-bold">${event.name}</div>
                        ${event.time ? `<div class="text-xs mt-1">Time: ${event.time}</div>` : ''}
                        ${event.description ? `<div class="text-xs mt-1">${event.description}</div>` : ''}
                     </div>`,
            allowHTML: true,
            animation: 'scale',
            duration: 200,
            placement: 'top',
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        });
        
        tooltipInstances.push(tooltip);
    });
}

// Handle drag start
function handleDragStart(e) {
    draggedEvent = events.find(event => event.id === e.target.dataset.eventId);
    e.target.classList.add('dragging', 'opacity-50');
    
    // Create a ghost image
    const ghostElement = e.target.cloneNode(true);
    ghostElement.style.width = `${e.target.offsetWidth}px`;
    ghostElement.classList.add('fixed', 'pointer-events-none', 'opacity-80', 'shadow-lg', 'z-50');
    document.body.appendChild(ghostElement);
    
    e.dataTransfer.setData('text/plain', e.target.dataset.eventId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // Remove ghost element after drag starts
    setTimeout(() => {
        document.body.removeChild(ghostElement);
    }, 0);
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons with animation
    prevMonthBtn.addEventListener('click', () => {
        currentDate = currentDate.minus({ months: 1 });
        animateCalendarTransition('right');
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate = currentDate.plus({ months: 1 });
        animateCalendarTransition('left');
    });
    
    // Add event button
    addEventBtn.addEventListener('click', openAddEventModal);
    
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Form submission
    eventForm.addEventListener('submit', handleEventFormSubmit);
    
    // Cancel and close buttons
    cancelEventBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Delete button
    deleteEventBtn.addEventListener('click', deleteEvent);
    
    // Drag and drop events on days
    calendarDays.addEventListener('dragover', handleDragOver);
    calendarDays.addEventListener('drop', handleDrop);
    calendarDays.addEventListener('dragleave', handleDragLeave);
    
    // Day click to add event
    calendarDays.addEventListener('click', handleDayClick);
    
    // Close notification
    closeNotificationBtn.addEventListener('click', () => {
        notification.classList.add('animate__animated', 'animate__fadeOut');
        setTimeout(() => {
            notification.classList.remove('animate__animated', 'animate__fadeOut');
            notification.classList.add('hidden');
        }, 300);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);
}

// Handle keyboard shortcuts
function handleKeyDown(e) {
    // Escape key to close modal
    if (e.key === 'Escape' && eventModal.style.display === 'flex') {
        closeModal();
    }
    
    // Left/right arrows for month navigation when not in modal
    if (eventModal.style.display !== 'flex') {
        if (e.key === 'ArrowLeft') {
            currentDate = currentDate.minus({ months: 1 });
            animateCalendarTransition('right');
        } else if (e.key === 'ArrowRight') {
            currentDate = currentDate.plus({ months: 1 });
            animateCalendarTransition('left');
        }
    }
}

// Animate calendar transition
function animateCalendarTransition(direction) {
    // Save current transform for animation
    const exitClass = direction === 'left' ? 'animate__slideOutLeft' : 'animate__slideOutRight';
    const enterClass = direction === 'left' ? 'animate__slideInRight' : 'animate__slideInLeft';
    
    calendarDays.classList.add('animate__animated', exitClass);
    
    setTimeout(() => {
        calendarDays.classList.remove('animate__animated', exitClass);
        renderCalendar();
        calendarDays.classList.add('animate__animated', enterClass);
        
        setTimeout(() => {
            calendarDays.classList.remove('animate__animated', enterClass);
        }, 500);
    }, 200);
}

// Handle day click
function handleDayClick(e) {
    const dayElement = e.target.closest('.day');
    if (dayElement && !e.target.closest('.event')) {
        const dateStr = dayElement.dataset.date;
        if (dateStr) {
            openAddEventModal(new Date(dateStr));
        }
    }
}

// Open add event modal
function openAddEventModal(date) {
    modalTitle.textContent = 'Add Event';
    
    // Reset form
    eventForm.reset();
    deleteEventBtn.style.display = 'none';
    
    // Reset color preset selection
    colorPresets.forEach(p => p.classList.remove('ring-2', 'ring-offset-2'));
    
    // If date is provided, set it
    if (date instanceof Date) {
        eventDateInput.value = date.toISOString();
    } else {
        // Default to today
        eventDateInput.value = new Date().toISOString();
    }
    
    // Show modal with animation
    eventModal.style.display = 'flex';
    setTimeout(() => {
        eventModal.querySelector('.modal-content').classList.add('animate__animated', 'animate__zoomIn', 'animate__faster');
        setTimeout(() => {
            eventModal.querySelector('.modal-content').classList.remove('animate__animated', 'animate__zoomIn', 'animate__faster');
        }, 300);
    }, 10);
}

// Open edit event modal
function openEditEventModal(event) {
    modalTitle.textContent = 'Edit Event';
    
    // Fill form with event data
    eventIdInput.value = event.id;
    eventDateInput.value = event.date.toISOString();
    eventNameInput.value = event.name;
    eventTimeInput.value = event.time || '';
    eventDescriptionInput.value = event.description || '';
    eventColorInput.value = event.color || '#4e42f5';
    eventReminderInput.value = event.reminder || 'none';
    
    // Reset and set color preset if it matches
    colorPresets.forEach(p => {
        p.classList.remove('ring-2', 'ring-offset-2');
        if (p.dataset.color === event.color) {
            p.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
        }
    });
    
    // Show delete button
    deleteEventBtn.style.display = 'block';
    
    // Show modal with animation
    eventModal.style.display = 'flex';
    setTimeout(() => {
        eventModal.querySelector('.modal-content').classList.add('animate__animated', 'animate__zoomIn', 'animate__faster');
        setTimeout(() => {
            eventModal.querySelector('.modal-content').classList.remove('animate__animated', 'animate__zoomIn', 'animate__faster');
        }, 300);
    }, 10);
}

// Close modal
function closeModal() {
    eventModal.querySelector('.modal-content').classList.add('animate__animated', 'animate__zoomOut', 'animate__faster');
    
    setTimeout(() => {
        eventModal.querySelector('.modal-content').classList.remove('animate__animated', 'animate__zoomOut', 'animate__faster');
        eventModal.style.display = 'none';
    }, 200);
}

// Handle event form submit
function handleEventFormSubmit(e) {
    e.preventDefault();
    
    const eventId = eventIdInput.value || generateId();
    const eventDate = new Date(eventDateInput.value);
    const name = eventNameInput.value;
    const time = eventTimeInput.value;
    const description = eventDescriptionInput.value;
    const color = eventColorInput.value;
    const reminder = eventReminderInput.value;
    
    let reminderTime = null;
    if (reminder !== 'none') {
        // Calculate reminder time
        const minutesBefore = parseInt(reminder);
        reminderTime = new Date(eventDate);
        
        // If time is set, use it for the reminder
        if (time) {
            const [hours, minutes] = time.split(':');
            reminderTime.setHours(parseInt(hours), parseInt(minutes) - minutesBefore);
        } else {
            // Default to beginning of day
            reminderTime.setHours(0, 0 - minutesBefore);
        }
    }
    
    // Check if editing or adding
    const existingEventIndex = events.findIndex(event => event.id === eventId);
    
    if (existingEventIndex !== -1) {
        // Update existing event
        events[existingEventIndex] = {
            ...events[existingEventIndex],
            name,
            date: eventDate,
            time,
            description,
            color,
            reminder,
            reminderTime
        };
    } else {
        // Add new event
        events.push({
            id: eventId,
            name,
            date: eventDate,
            time,
            description,
            color,
            reminder,
            reminderTime
        });
    }
    
    // Save events and refresh calendar
    saveEvents();
    
    // Close modal first (smoother animation)
    closeModal();
    
    // Then update the calendar
    setTimeout(() => {
        renderCalendar();
        
        // Show confirmation notification
        showConfirmationNotification(existingEventIndex !== -1 ? 'Event updated successfully!' : 'Event added successfully!');
        
        // Check for reminders after adding/editing
        checkReminders();
    }, 300);
}

// Delete an event
function deleteEvent() {
    const eventId = eventIdInput.value;
    
    if (eventId) {
        // Confirm delete
        if (confirm('Are you sure you want to delete this event?')) {
            events = events.filter(event => event.id !== eventId);
            saveEvents();
            
            // Close modal first (smoother animation)
            closeModal();
            
            // Then update the calendar
            setTimeout(() => {
                renderCalendar();
                
                // Show confirmation notification
                showConfirmationNotification('Event deleted successfully!');
            }, 300);
        }
    }
}

// Show confirmation notification
function showConfirmationNotification(message) {
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('animate__animated', 'animate__fadeIn');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('animate__fadeIn');
        notification.classList.add('animate__fadeOut');
        
        setTimeout(() => {
            notification.classList.remove('animate__animated', 'animate__fadeOut');
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    const dayElement = e.target.closest('.day');
    if (dayElement) {
        dayElement.classList.add('drag-over', 'ring-2', 'ring-primary', 'dark:ring-dark-primary');
    }
}

// Handle drag leave
function handleDragLeave(e) {
    const dayElement = e.target.closest('.day');
    if (dayElement) {
        dayElement.classList.remove('drag-over', 'ring-2', 'ring-primary', 'dark:ring-dark-primary');
    }
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    
    const dayElement = e.target.closest('.day');
    if (dayElement) {
        dayElement.classList.remove('drag-over', 'ring-2', 'ring-primary', 'dark:ring-dark-primary');
        
        const eventId = e.dataTransfer.getData('text/plain');
        const eventIndex = events.findIndex(event => event.id === eventId);
        
        if (eventIndex !== -1 && dayElement.dataset.date) {
            // Update the event date
            const newDate = new Date(dayElement.dataset.date);
            events[eventIndex].date = newDate;
            
            // Update reminder time if needed
            if (events[eventIndex].reminder !== 'none' && events[eventIndex].reminder) {
                const minutesBefore = parseInt(events[eventIndex].reminder);
                const reminderTime = new Date(newDate);
                
                if (events[eventIndex].time) {
                    const [hours, minutes] = events[eventIndex].time.split(':');
                    reminderTime.setHours(parseInt(hours), parseInt(minutes) - minutesBefore);
                } else {
                    reminderTime.setHours(0, 0 - minutesBefore);
                }
                
                events[eventIndex].reminderTime = reminderTime;
            }
            
            saveEvents();
            renderCalendar();
            
            // Show confirmation notification
            showConfirmationNotification('Event moved successfully!');
        }
    }
}

// Check for reminders
function checkReminders() {
    // Clear any active setTimeout
    activeReminders.forEach(reminder => clearTimeout(reminder));
    activeReminders = [];
    
    const now = new Date();
    
    events.forEach(event => {
        if (event.reminderTime) {
            const reminderTime = new Date(event.reminderTime);
            
            // If reminder time is in the future
            if (reminderTime > now) {
                const timeUntilReminder = reminderTime.getTime() - now.getTime();
                
                // Set timeout for reminder
                const timerId = setTimeout(() => {
                    showReminderNotification(event);
                }, timeUntilReminder);
                
                activeReminders.push(timerId);
            }
        }
    });
}

// Show reminder notification
function showReminderNotification(event) {
    // Use custom notification UI
    notificationText.textContent = `${event.name} ${event.time ? 'at ' + event.time : ''}`;
    notification.classList.remove('hidden');
    notification.classList.add('animate__animated', 'animate__bounceIn');
    
    // Play notification sound
    playNotificationSound();
    
    // Check if browser supports notifications
    if ('Notification' in window) {
        // Check if permission is granted
        if (Notification.permission === 'granted') {
            createNotification(event);
        }
        // Request permission if not already asked
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    createNotification(event);
                }
            });
        }
    }
}

// Play notification sound
function playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBhxQo97trFsUAw5Lnt/q1J9nLQ0LD16Yyty/kF8/GxsNDViNwtuyjWtQKCMPEWCOwOC7g1BCKhwODFigzOusZDkYDAUKMqfi+tdwCwgDDkOq6v7E46DQkWYxEAX7B1CTo97KbC0PCyFko8XQlF87GBMTMqO48MF8TiojGB5+vczhsXlDHhESPLDq5bWGVDIbEhM6xOrTpHZEISHK7t91RB0CDBs/t/XsjFsrDQ0XUbDd18+dZDYTDRNQrNfGpn9OJRkTHmu74c2ldEgfFBEy0P3gmk8kExEacbj0w41aJRMOFW/J68mSYDIVDxVbt9jPp3xNJBcTGXTH78qaVSkWETA2x+q1iWAvFxIUO8PxvZFlLxQQFErI7cKIWy4ZEhRPx+mwgFQoFxEWQ8zwzJ5uPR0WGW7I8MWaaTcRDA8YsMHbsYthNhQPFC/z/r1yIw0MET7S7s2PYjESEBpTrM7Nn3FAHhYYPLrj3Kp/SSUbGWK67cmcaj0YEhI2v+fWrYVVKRoWKcXxzaV4SiIVEhpWyu7LmmU2Ew4QJOr/yIdLIxUTIWS1182leU0lGRYq0vrIlWEyFQ4QJO3/yIVKIhQSH2i44c+mfE8mGRUp0vnHlWEyFQ4QI+3/yIVKIhQSIG6658SDVSwaEhp2y+/PnGc7FxASRbDdzq6CTyYZFSXe+caJUCcVDxdnuvvUqXxOJhoZNbfg16l/TiYZFSbJ7NCaYjUVDxIh7v7OjFAkFBAWJun9xIlQJxUPEzTG6cygbT8ZExhkr9XRr4ZbLhkWKczx1KFyQBgTFCzr/82MUSUVDxMk7f/Ji1AkFA8SIe7+zoxQJBUQFyjp/cSJUCcWEBMz3fLLnWc7GBEUJen9xIlQJxUPEyHu/s6MUSQVEBY1yu3NnGc7GBEUJOn9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBEUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBEUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBEUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBEUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBIUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBIUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBIUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBIUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAnFQ8TIu7+zoxQJBQPEiLu/s6MUSQVEBY1yu3NnGc7GBIUJen9xIlQJxYQEzPd8sudZzsYERQl6f3EiVAn');
    audio.play();
}

// Create notification
function createNotification(event) {
    const notification = new Notification('Calendar Reminder', {
        body: `${event.name} ${event.time ? 'at ' + event.time : ''}`,
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="%234e42f5" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>'
    });
    
    notification.onclick = () => {
        window.focus();
        openEditEventModal(event);
    };
}

// Initialize the calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', initCalendar); 