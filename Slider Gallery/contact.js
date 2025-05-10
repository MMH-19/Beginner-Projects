document.addEventListener('DOMContentLoaded', () => {
    const interactiveBg = document.querySelector('.interactive-bg');
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const closeSuccessBtn = document.getElementById('close-success');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    const socialIcons = document.querySelectorAll('.social-icon');
    
    // Setup interactive background
    setupInteractiveBackground();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize form validation and submission
    initializeForm();
    
    // Function to make background interactive
    function setupInteractiveBackground() {
        // Handle mousemove for background parallax effect
        document.addEventListener('mousemove', (e) => {
            if (!interactiveBg) return;
            
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Adjust background position for parallax effect
            gsap.to(interactiveBg, {
                backgroundPosition: `${mouseX * 10 + 45}% ${mouseY * 10 + 45}%`,
                duration: 1,
                ease: 'power1.out'
            });
        });
        
        // Handle click for ripple effect on background
        document.addEventListener('click', (e) => {
            if (e.target.closest('.contact-container, header, footer')) return;
            
            createRippleEffect(e.clientX, e.clientY);
        });
    }
    
    // Create ripple effect on background
    function createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        
        // Animate ripple and remove after animation
        gsap.to(ripple, {
            scale: 20,
            opacity: 0,
            duration: 1,
            onComplete: () => {
                ripple.remove();
            }
        });
    }
    
    // Initialize animations
    function initializeAnimations() {
        // Animate form inputs on focus
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    borderColor: 'rgba(35, 213, 171, 0.5)',
                    boxShadow: '0 0 15px rgba(35, 213, 171, 0.2)',
                    duration: 0.3
                });
            });
            
            input.addEventListener('blur', () => {
                gsap.to(input, {
                    borderColor: input.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 0 rgba(35, 213, 171, 0)',
                    duration: 0.3
                });
            });
        });
        
        // Animate social icons
        socialIcons.forEach((icon, index) => {
            // Initial state
            gsap.set(icon, {
                y: 20,
                opacity: 0
            });
            
            // Animation on load
            gsap.to(icon, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                delay: 1 + (index * 0.1),
                ease: 'back.out(1.7)'
            });
            
            // Hover animation
            icon.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    y: -5,
                    backgroundColor: 'rgba(35, 166, 213, 0.8)',
                    boxShadow: '0 5px 15px rgba(35, 166, 213, 0.4)',
                    duration: 0.3
                });
            });
            
            icon.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    y: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0 0 rgba(35, 166, 213, 0)',
                    duration: 0.3
                });
            });
        });
        
        // Animate submit button
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.addEventListener('mouseenter', () => {
            gsap.to(submitBtn, {
                y: -3,
                boxShadow: '0 5px 15px rgba(35, 166, 213, 0.4)',
                duration: 0.3
            });
        });
        
        submitBtn.addEventListener('mouseleave', () => {
            gsap.to(submitBtn, {
                y: 0,
                boxShadow: '0 0 0 rgba(35, 166, 213, 0)',
                duration: 0.3
            });
        });
    }
    
    // Initialize form validation and submission
    function initializeForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!validateForm(name, email, message)) {
                return;
            }
            
            // Show loading state on button
            const submitBtn = contactForm.querySelector('.submit-btn');
            const btnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual AJAX call in production)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = btnText;
                
                // Show success message
                showSuccessMessage();
            }, 1500);
        });
        
        // Form validation
        function validateForm(name, email, message) {
            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Validate name
            if (name.trim() === '') {
                showError('name', 'Please enter your name');
                isValid = false;
            } else {
                clearError('name');
            }
            
            // Validate email
            if (!emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('email');
            }
            
            // Validate message
            if (message.trim() === '') {
                showError('message', 'Please enter your message');
                isValid = false;
            } else {
                clearError('message');
            }
            
            return isValid;
        }
        
        // Show error message
        function showError(inputId, errorMessage) {
            const inputElement = document.getElementById(inputId);
            let errorElement = inputElement.parentElement.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = '#ff6b6b';
                errorElement.style.fontSize = '0.8rem';
                errorElement.style.marginTop = '5px';
                inputElement.parentElement.appendChild(errorElement);
            }
            
            errorElement.textContent = errorMessage;
            
            // Highlight input
            gsap.to(inputElement, {
                borderColor: '#ff6b6b',
                boxShadow: '0 0 10px rgba(255, 107, 107, 0.2)',
                duration: 0.3
            });
        }
        
        // Clear error message
        function clearError(inputId) {
            const inputElement = document.getElementById(inputId);
            const errorElement = inputElement.parentElement.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.textContent = '';
            }
            
            // Reset input style
            gsap.to(inputElement, {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 0 rgba(255, 107, 107, 0)',
                duration: 0.3
            });
        }
    }
    
    // Show success message
    function showSuccessMessage() {
        if (!successMessage) return;
        
        successMessage.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add confetti effect
        createConfetti();
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiCount = 100;
        const colors = ['#23a6d5', '#23d5ab', '#ffffff', '#5ae9ff', '#a3fccd'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.position = 'absolute';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 5 + 5}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.opacity = Math.random();
            confetti.style.zIndex = 1000;
            
            // Starting position
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            gsap.fromTo(confetti, 
                {
                    x: startX,
                    y: startY,
                    scale: 0,
                    rotation: Math.random() * 360
                },
                {
                    x: startX + (Math.random() * 400 - 200),
                    y: startY + (Math.random() * 200 - 300),
                    scale: Math.random() * 1.5 + 0.5,
                    rotation: Math.random() * 360,
                    opacity: 0,
                    duration: Math.random() * 2 + 2,
                    ease: 'power2.out',
                    onComplete: () => {
                        confetti.remove();
                    }
                }
            );
        }
    }
    
    // Close success message
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successMessage.classList.remove('show');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }
    
    // Change background gradient on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPosition / maxScroll;
        
        // Create dynamic gradient based on scroll position
        const hue1 = Math.floor(180 + scrollPercentage * 180); // 180-360 range
        const hue2 = Math.floor(240 + scrollPercentage * 120); // 240-360 range
        const hue3 = Math.floor(120 + scrollPercentage * 240); // 120-360 range
        const hue4 = Math.floor(60 + scrollPercentage * 300);  // 60-360 range
        
        if (interactiveBg) {
            interactiveBg.style.background = `linear-gradient(-45deg, 
                hsl(${hue1}, 70%, 60%), 
                hsl(${hue2}, 80%, 50%), 
                hsl(${hue3}, 60%, 60%), 
                hsl(${hue4}, 70%, 60%))`;
        }
    });
}); 