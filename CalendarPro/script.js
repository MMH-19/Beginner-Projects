// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Real-time date and clock
    const realTimeDateElement = document.getElementById('real-time-date');
    const realTimeClockElement = document.getElementById('real-time-clock');
    
    function updateDateTime() {
        const now = new Date();
        
        // Format the date: Monday, January 1, 2023
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString(undefined, options);
        
        // Format the time: 12:00:00 PM
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const timeString = now.toLocaleTimeString(undefined, timeOptions);
        
        // Update the elements
        if (realTimeDateElement) realTimeDateElement.textContent = dateString;
        if (realTimeClockElement) realTimeClockElement.textContent = timeString;
    }
    
    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Mobile Menu Toggle
    const menuButton = document.querySelector('nav button');
    const mobileMenu = document.querySelector('.md\\:hidden.hidden');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Add hero image animation class
    const heroImage = document.querySelector('#home .md\\:w-1\\/2 img');
    if (heroImage) {
        heroImage.classList.add('hero-image');
    }

    // Add custom button hover effect
    const buttons = document.querySelectorAll('.bg-indigo-600');
    buttons.forEach(button => {
        button.classList.add('custom-btn-hover');
    });

    // Add testimonial card hover effect
    const testimonialCards = document.querySelectorAll('#testimonials .bg-white');
    testimonialCards.forEach(card => {
        card.classList.add('testimonial-card');
    });

    // Add pricing card hover effect
    const pricingCards = document.querySelectorAll('#pricing .bg-white');
    pricingCards.forEach(card => {
        card.classList.add('pricing-card');
    });

    // Add today indicator in calendar
    const today = new Date();
    const todayDate = today.getDate();
    const calendarDays = document.querySelectorAll('.grid-cols-7 > div:not(.text-gray-400)');
    
    calendarDays.forEach(day => {
        if (day.textContent.trim() === todayDate.toString()) {
            day.classList.add('today-indicator');
            day.classList.add('bg-indigo-50');
            
            // Check if the day has content already
            if (day.children.length === 0) {
                // Add today number with special styling
                const dateNumber = document.createElement('div');
                dateNumber.textContent = todayDate;
                dateNumber.classList.add('font-bold', 'text-indigo-600');
                day.appendChild(dateNumber);
                
                // Add "Today" label
                const todayLabel = document.createElement('div');
                todayLabel.textContent = 'TODAY';
                todayLabel.classList.add('text-xs', 'bg-indigo-600', 'text-white', 'rounded', 'px-1', 'py-0.5', 'mt-1', 'inline-block');
                day.appendChild(todayLabel);
            } else {
                // If there's already content, just style the first child (the date number)
                if (day.firstChild) {
                    day.firstChild.classList.add('font-bold');
                    day.firstChild.classList.add('text-indigo-600');
                }
            }
        }
    });

    // Calendar Navigation
    const prevMonthBtn = document.querySelector('.fas.fa-chevron-left').parentElement;
    const nextMonthBtn = document.querySelector('.fas.fa-chevron-right').parentElement;
    const monthDisplay = document.querySelector('.flex.justify-between.items-center.mb-6 h3');
    const calendarTodayDate = document.getElementById('calendar-today-date');
    
    if (prevMonthBtn && nextMonthBtn && monthDisplay) {
        // Current date tracking
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        
        // Month names
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Update calendar title
        const updateCalendarTitle = () => {
            monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
        };

        // Add today's date to the calendar header
        const updateTodayInHeader = () => {
            if (calendarTodayDate) {
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                calendarTodayDate.textContent = `Today: ${today.toLocaleDateString(undefined, options)}`;
            }
        };
        
        // Set initial title and today's date
        updateCalendarTitle();
        updateTodayInHeader();
        
        // Previous month button
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendarTitle();
            
            // Check if we're in the current month
            const isCurrentMonth = (currentMonth === today.getMonth() && currentYear === today.getFullYear());
            
            // Show or hide the today indicator based on if we're in current month
            if (calendarTodayDate) {
                if (isCurrentMonth) {
                    calendarTodayDate.classList.remove('hidden');
                } else {
                    calendarTodayDate.classList.add('opacity-50');
                    calendarTodayDate.innerHTML = `<span class="text-xs italic">Today is ${today.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>`;
                }
            }
            
            // Here you would also update the calendar grid
            // For a full implementation, we would regenerate the calendar days
        });
        
        // Next month button
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendarTitle();
            
            // Check if we're in the current month
            const isCurrentMonth = (currentMonth === today.getMonth() && currentYear === today.getFullYear());
            
            // Show or hide the today indicator based on if we're in current month
            if (calendarTodayDate) {
                if (isCurrentMonth) {
                    calendarTodayDate.classList.remove('hidden');
                    calendarTodayDate.classList.remove('opacity-50');
                    calendarTodayDate.textContent = `Today: ${today.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`;
                } else {
                    calendarTodayDate.classList.add('opacity-50');
                    calendarTodayDate.innerHTML = `<span class="text-xs italic">Today is ${today.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>`;
                }
            }
            
            // Here you would also update the calendar grid
            // For a full implementation, we would regenerate the calendar days
        });
    }

    // Event Form Handling
    const addEventForm = document.querySelector('#calendar form');
    const addEventBtn = document.querySelector('#calendar button');
    
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('event-title')?.value;
            const date = document.getElementById('event-date')?.value;
            const startTime = document.getElementById('event-start')?.value;
            const endTime = document.getElementById('event-end')?.value;
            const description = document.getElementById('event-description')?.value;
            
            if (!title || !date) {
                alert('Please enter at least a title and date for the event.');
                return;
            }
            
            // Here you would typically send this data to a server
            // For this demo, we'll just show an alert
            alert(`Event added: ${title} on ${date} from ${startTime || 'N/A'} to ${endTime || 'N/A'}`);
            
            // Clear the form
            if (addEventForm) {
                addEventForm.reset();
            }
            
            // In a real application, you would also update the calendar
            // to show the new event
        });
    }

    // Contact Form Validation
    const contactForm = document.querySelector('#contact form');
    const contactSubmitBtn = document.querySelector('#contact button');
    
    if (contactForm && contactSubmitBtn) {
        contactSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const subject = document.getElementById('subject')?.value;
            const message = document.getElementById('message')?.value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill out all fields in the contact form.');
                return;
            }
            
            // Email validation with regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Here you would typically send this data to a server
            // For this demo, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            
            // Clear the form
            contactForm.reset();
        });
    }

    // Newsletter Subscription
    const newsletterForm = document.querySelector('footer .flex');
    const newsletterInput = document.querySelector('footer input[type="email"]');
    const newsletterBtn = document.querySelector('footer .bg-indigo-600');
    
    if (newsletterForm && newsletterInput && newsletterBtn) {
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = newsletterInput.value;
            
            // Basic validation
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Here you would typically send this to a server
            // For this demo, we'll just show an alert
            alert('Thank you for subscribing to our newsletter!');
            
            // Clear the input
            newsletterInput.value = '';
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the href is not just "#"
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });
    });

    // Pricing toggle functionality (if implemented)
    const pricingButtons = document.querySelectorAll('#pricing button');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('This would redirect to a payment/registration page in a real application.');
        });
    });
}); 