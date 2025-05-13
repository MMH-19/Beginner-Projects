document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset all error messages
            resetErrors();
            
            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Get error elements
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const subjectError = document.getElementById('subject-error');
            const messageError = document.getElementById('message-error');
            
            // Form status elements
            const formStatus = document.getElementById('form-status');
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');
            
            // Validate fields
            let isValid = true;
            
            // Validate name
            if (!name.value.trim()) {
                showError(nameError, 'Please enter your name');
                highlightField(name);
                isValid = false;
            }
            
            // Validate email
            if (!email.value.trim()) {
                showError(emailError, 'Please enter your email address');
                highlightField(email);
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(emailError, 'Please enter a valid email address');
                highlightField(email);
                isValid = false;
            }
            
            // Validate subject
            if (!subject.value.trim()) {
                showError(subjectError, 'Please enter a subject');
                highlightField(subject);
                isValid = false;
            }
            
            // Validate message
            if (!message.value.trim()) {
                showError(messageError, 'Please enter your message');
                highlightField(message);
                isValid = false;
            }
            
            // If form is valid, simulate form submission
            if (isValid) {
                // Here you would typically send the form data via AJAX/fetch
                // For now, we'll just simulate success
                
                // Clear form fields
                contactForm.reset();
                
                // Show success message
                formStatus.classList.remove('hidden');
                successMessage.classList.remove('hidden');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                    successMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }
    
    // Helper functions for form validation
    function resetErrors() {
        // Hide all error messages
        const errorElements = document.querySelectorAll('[id$="-error"]');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.add('hidden');
        });
        
        // Reset form status messages
        const formStatus = document.getElementById('form-status');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
        
        if (formStatus && successMessage && errorMessage) {
            formStatus.classList.add('hidden');
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
        }
        
        // Reset field highlights
        const formFields = document.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.classList.remove('border-red-500');
        });
    }
    
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }
    
    function highlightField(field) {
        if (field) {
            field.classList.add('border-red-500');
            
            // Add focus event to remove highlight when user starts typing
            field.addEventListener('focus', function onFocus() {
                field.classList.remove('border-red-500');
                const errorElement = document.getElementById(`${field.id}-error`);
                if (errorElement) {
                    errorElement.classList.add('hidden');
                }
                // Remove this event listener after it's triggered
                field.removeEventListener('focus', onFocus);
            });
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const html = document.documentElement;
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply the right theme based on saved preference or OS preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    // Function to toggle theme
    function toggleTheme() {
        html.classList.toggle('dark');
        
        // Save preference to localStorage
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Handle theme toggle click on desktop
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Handle theme toggle click on mobile
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    if (mobileMenuButton && mobileMenu && hamburgerIcon) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            hamburgerIcon.classList.toggle('hamburger-active');
            
            // Slide down animation for mobile menu
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            } else {
                mobileMenu.style.maxHeight = '0';
            }
        });
    }

    // Sticky header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                header.classList.add('shadow-lg');
                header.classList.remove('shadow-md');
            } else {
                header.classList.remove('shadow-lg');
                header.classList.add('shadow-md');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if it's open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Binary to Decimal Converter
    const binaryInput = document.getElementById('binary-input');
    const convertBtn = document.getElementById('convert-btn');
    const decimalResult = document.getElementById('decimal-result');
    const errorMessage = document.getElementById('error-message');

    if (binaryInput && convertBtn && decimalResult && errorMessage) {
        // Add input validation to check for only 0s and 1s
        binaryInput.addEventListener('input', function() {
            const value = this.value;
            
            // Use regex to validate binary input
            if (value === '') {
                errorMessage.textContent = '';
                return;
            }
            
            if (!/^[01]+$/.test(value)) {
                errorMessage.textContent = 'Please enter only 0s and 1s';
                // Remove any invalid characters
                this.value = value.replace(/[^01]/g, '');
            } else {
                errorMessage.textContent = '';
            }
        });

        // Convert binary to decimal when button is clicked
        convertBtn.addEventListener('click', convertBinaryToDecimal);
        
        // Also convert when Enter key is pressed
        binaryInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                convertBinaryToDecimal();
            }
        });

        function convertBinaryToDecimal() {
            const binary = binaryInput.value;
            
            if (binary === '') {
                errorMessage.textContent = 'Please enter a binary number';
                return;
            }
            
            if (!/^[01]+$/.test(binary)) {
                errorMessage.textContent = 'Please enter only 0s and 1s';
                return;
            }
            
            // Convert binary to decimal using parseInt() with a radix of 2
            const decimal = parseInt(binary, 2);
            
            // Display the result
            decimalResult.textContent = decimal;
        }
    }

    // Hex Color Generator
    const colorPreview = document.getElementById('color-preview');
    const colorHex = document.getElementById('color-hex');
    const generateColorBtn = document.getElementById('generate-color-btn');
    const copyHexBtn = document.getElementById('copy-hex-btn');
    const saveColorBtn = document.getElementById('save-color-btn');

    if (colorPreview && colorHex && generateColorBtn && copyHexBtn && saveColorBtn) {
        // Generate initial random color
        generateRandomColor();

        // Generate new random color when button is clicked
        generateColorBtn.addEventListener('click', generateRandomColor);

        // Copy hex code to clipboard
        copyHexBtn.addEventListener('click', function() {
            const hexText = colorHex.textContent;
            navigator.clipboard.writeText(hexText)
                .then(() => {
                    const originalText = copyHexBtn.textContent;
                    copyHexBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyHexBtn.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });

        // Save color to local storage
        const savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
        saveColorBtn.addEventListener('click', function() {
            const hexValue = colorHex.textContent;
            
            // Don't save duplicates
            if (!savedColors.includes(hexValue)) {
                savedColors.push(hexValue);
                localStorage.setItem('savedColors', JSON.stringify(savedColors));
                
                const originalText = saveColorBtn.textContent;
                saveColorBtn.textContent = 'Saved!';
                setTimeout(() => {
                    saveColorBtn.textContent = originalText;
                }, 2000);
            } else {
                const originalText = saveColorBtn.textContent;
                saveColorBtn.textContent = 'Already Saved';
                setTimeout(() => {
                    saveColorBtn.textContent = originalText;
                }, 2000);
            }
        });

        function generateRandomColor() {
            // Generate random RGB values
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            
            // Convert to hex format
            const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
            
            // Update preview and text
            colorPreview.style.backgroundColor = hexColor;
            colorHex.textContent = hexColor;
            
            // Set text color to either black or white based on background brightness
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            colorHex.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        }
    }

    // JSON Formatter
    const jsonInput = document.getElementById('json-input');
    const formatJsonBtn = document.getElementById('format-json-btn');
    const minifyJsonBtn = document.getElementById('minify-json-btn');
    const jsonError = document.getElementById('json-error');

    if (jsonInput && formatJsonBtn && minifyJsonBtn && jsonError) {
        formatJsonBtn.addEventListener('click', function() {
            formatJSON(true);
        });

        minifyJsonBtn.addEventListener('click', function() {
            formatJSON(false);
        });

        function formatJSON(shouldFormat) {
            const json = jsonInput.value.trim();
            
            if (!json) {
                jsonError.textContent = 'Please enter JSON to format';
                return;
            }
            
            try {
                // Parse the JSON to validate it
                const parsed = JSON.parse(json);
                
                // Pretty print or minify based on parameter
                if (shouldFormat) {
                    jsonInput.value = JSON.stringify(parsed, null, 2);
                    jsonError.textContent = 'JSON formatted successfully';
                } else {
                    jsonInput.value = JSON.stringify(parsed);
                    jsonError.textContent = 'JSON minified successfully';
                }
                
                // Make error message green for success
                jsonError.classList.remove('text-red-600');
                jsonError.classList.add('text-green-600');
                
                // Reset after 3 seconds
                setTimeout(() => {
                    jsonError.textContent = '';
                    jsonError.classList.remove('text-green-600');
                    jsonError.classList.add('text-red-600');
                }, 3000);
                
            } catch (e) {
                jsonError.textContent = 'Invalid JSON: ' + e.message;
                jsonError.classList.add('text-red-600');
                jsonError.classList.remove('text-green-600');
            }
        }
    }

    // Tools Category Filtering
    const toolCategoryBtns = document.querySelectorAll('.tool-category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    const toolsSearch = document.getElementById('tools-search');
    
    if (toolCategoryBtns.length > 0 && toolCards.length > 0) {
        // Category filtering
        toolCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button style
                toolCategoryBtns.forEach(b => b.classList.remove('active', 'bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-300'));
                toolCategoryBtns.forEach(b => b.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300'));
                
                btn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                btn.classList.add('active', 'bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-300');
                
                const category = btn.getAttribute('data-category');
                
                // Filter tool cards
                toolCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Search functionality
        if (toolsSearch) {
            toolsSearch.addEventListener('input', () => {
                const searchTerm = toolsSearch.value.toLowerCase().trim();
                
                // Reset category buttons
                if (searchTerm) {
                    toolCategoryBtns.forEach(b => b.classList.remove('active', 'bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-300'));
                    toolCategoryBtns.forEach(b => b.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300'));
                    
                    const allButton = document.querySelector('[data-category="all"]');
                    if (allButton) {
                        allButton.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                        allButton.classList.add('active', 'bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-300');
                    }
                }
                
                // Filter cards based on search term
                toolCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        // Tool Cards Interactive Hover Effects
        toolCards.forEach(card => {
            // Get the main color based on the category
            let hoverColor, hoverRingClass, hoverShadowClass;
            const category = card.getAttribute('data-category');
            
            switch(category) {
                case 'converters':
                    hoverColor = 'text-blue-600 dark:text-blue-400';
                    hoverRingClass = 'ring-2 ring-blue-300 dark:ring-blue-700';
                    hoverShadowClass = 'shadow-lg shadow-blue-100 dark:shadow-blue-900/20';
                    break;
                case 'generators':
                    hoverColor = 'text-purple-600 dark:text-purple-400';
                    hoverRingClass = 'ring-2 ring-purple-300 dark:ring-purple-700';
                    hoverShadowClass = 'shadow-lg shadow-purple-100 dark:shadow-purple-900/20';
                    break;
                case 'formatters':
                    hoverColor = 'text-green-600 dark:text-green-400';
                    hoverRingClass = 'ring-2 ring-green-300 dark:ring-green-700';
                    hoverShadowClass = 'shadow-lg shadow-green-100 dark:shadow-green-900/20';
                    break;
                case 'encoders':
                    hoverColor = 'text-yellow-600 dark:text-yellow-400';
                    hoverRingClass = 'ring-2 ring-yellow-300 dark:ring-yellow-700';
                    hoverShadowClass = 'shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20';
                    break;
                default:
                    hoverColor = 'text-indigo-600 dark:text-indigo-400';
                    hoverRingClass = 'ring-2 ring-indigo-300 dark:ring-indigo-700';
                    hoverShadowClass = 'shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20';
            }
            
            // Add mouse enter event
            card.addEventListener('mouseenter', () => {
                // Add ring and shadow
                card.classList.add('transform', 'scale-[1.02]', 'transition-all', 'duration-300');
                card.classList.add(...hoverRingClass.split(' '), ...hoverShadowClass.split(' '));
                
                // Change title color
                const title = card.querySelector('h3');
                if (title) {
                    title.classList.add(...hoverColor.split(' '));
                }
                
                // Animate the icon
                const iconContainer = card.querySelector('.fas, .far, .fa');
                if (iconContainer) {
                    iconContainer.style.transform = 'rotate(12deg) scale(1.1)';
                    iconContainer.style.transition = 'transform 0.3s ease';
                }
                
                // Brighten the description
                const description = card.querySelector('p');
                if (description) {
                    description.classList.add('text-gray-800', 'dark:text-gray-200');
                    description.classList.remove('text-gray-600', 'dark:text-gray-400');
                }
                
                // Scale the icon background
                const iconBg = card.querySelector('.rounded-full');
                if (iconBg) {
                    iconBg.style.transform = 'scale(1.1)';
                    iconBg.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
                    
                    // Also change background color based on category
                    if (category === 'converters') {
                        iconBg.classList.add('bg-blue-200', 'dark:bg-blue-800');
                        iconBg.classList.remove('bg-blue-100', 'dark:bg-blue-900');
                    } else if (category === 'generators') {
                        iconBg.classList.add('bg-purple-200', 'dark:bg-purple-800');
                        iconBg.classList.remove('bg-purple-100', 'dark:bg-purple-900');
                    } else if (category === 'formatters') {
                        iconBg.classList.add('bg-green-200', 'dark:bg-green-800');
                        iconBg.classList.remove('bg-green-100', 'dark:bg-green-900');
                    } else if (category === 'encoders') {
                        iconBg.classList.add('bg-yellow-200', 'dark:bg-yellow-800');
                        iconBg.classList.remove('bg-yellow-100', 'dark:bg-yellow-900');
                    }
                }
                
                // Scale buttons on hover
                const buttons = card.querySelectorAll('button');
                buttons.forEach(button => {
                    button.addEventListener('mouseenter', () => {
                        button.classList.add('scale-[1.03]');
                    });
                    
                    button.addEventListener('mouseleave', () => {
                        button.classList.remove('scale-[1.03]');
                    });
                });
            });
            
            // Add mouse leave event
            card.addEventListener('mouseleave', () => {
                // Remove ring and shadow
                card.classList.remove('transform', 'scale-[1.02]');
                card.classList.remove(...hoverRingClass.split(' '), ...hoverShadowClass.split(' '));
                
                // Restore title color
                const title = card.querySelector('h3');
                if (title) {
                    title.classList.remove(...hoverColor.split(' '));
                }
                
                // Restore icon
                const iconContainer = card.querySelector('.fas, .far, .fa');
                if (iconContainer) {
                    iconContainer.style.transform = '';
                }
                
                // Restore the description
                const description = card.querySelector('p');
                if (description) {
                    description.classList.remove('text-gray-800', 'dark:text-gray-200');
                    description.classList.add('text-gray-600', 'dark:text-gray-400');
                }
                
                // Restore the icon background
                const iconBg = card.querySelector('.rounded-full');
                if (iconBg) {
                    iconBg.style.transform = '';
                    
                    // Restore background color based on category
                    if (category === 'converters') {
                        iconBg.classList.remove('bg-blue-200', 'dark:bg-blue-800');
                        iconBg.classList.add('bg-blue-100', 'dark:bg-blue-900');
                    } else if (category === 'generators') {
                        iconBg.classList.remove('bg-purple-200', 'dark:bg-purple-800');
                        iconBg.classList.add('bg-purple-100', 'dark:bg-purple-900');
                    } else if (category === 'formatters') {
                        iconBg.classList.remove('bg-green-200', 'dark:bg-green-800');
                        iconBg.classList.add('bg-green-100', 'dark:bg-green-900');
                    } else if (category === 'encoders') {
                        iconBg.classList.remove('bg-yellow-200', 'dark:bg-yellow-800');
                        iconBg.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
                    }
                }
            });
        });
    }

    // Decimal to Binary Converter
    const decimalInput = document.getElementById('decimal-input');
    const convertToBinaryBtn = document.getElementById('convert-to-binary-btn');
    const binaryResult = document.getElementById('binary-result');
    const decimalError = document.getElementById('decimal-error');
    
    if (decimalInput && convertToBinaryBtn && binaryResult && decimalError) {
        convertToBinaryBtn.addEventListener('click', function() {
            const decimalValue = decimalInput.value.trim();
            
            if (!decimalValue || isNaN(decimalValue) || decimalValue < 0 || !Number.isInteger(Number(decimalValue))) {
                decimalError.textContent = "Please enter a valid non-negative integer";
                binaryResult.textContent = "0";
                return;
            }
            
            decimalError.textContent = "";
            const binaryValue = parseInt(decimalValue, 10).toString(2);
            binaryResult.textContent = binaryValue;
        });
    }
    
    // Base64 Encoder/Decoder
    const base64Input = document.getElementById('base64-input');
    const encodeBase64Btn = document.getElementById('encode-base64-btn');
    const decodeBase64Btn = document.getElementById('decode-base64-btn');
    const base64Result = document.getElementById('base64-result');
    
    if (base64Input && encodeBase64Btn && decodeBase64Btn && base64Result) {
        encodeBase64Btn.addEventListener('click', function() {
            const text = base64Input.value;
            try {
                const encoded = btoa(text);
                base64Result.textContent = encoded;
            } catch (e) {
                base64Result.textContent = "Error: " + e.message;
            }
        });
        
        decodeBase64Btn.addEventListener('click', function() {
            const base64 = base64Input.value;
            try {
                const decoded = atob(base64);
                base64Result.textContent = decoded;
            } catch (e) {
                base64Result.textContent = "Error: Invalid Base64 string";
            }
        });
    }
    
    // URL Encoder/Decoder
    const urlInput = document.getElementById('url-input');
    const encodeUrlBtn = document.getElementById('encode-url-btn');
    const decodeUrlBtn = document.getElementById('decode-url-btn');
    const urlResult = document.getElementById('url-result');
    
    if (urlInput && encodeUrlBtn && decodeUrlBtn && urlResult) {
        encodeUrlBtn.addEventListener('click', function() {
            const text = urlInput.value;
            try {
                const encoded = encodeURIComponent(text);
                urlResult.textContent = encoded;
            } catch (e) {
                urlResult.textContent = "Error: " + e.message;
            }
        });
        
        decodeUrlBtn.addEventListener('click', function() {
            const encodedUrl = urlInput.value;
            try {
                const decoded = decodeURIComponent(encodedUrl);
                urlResult.textContent = decoded;
            } catch (e) {
                urlResult.textContent = "Error: Invalid encoded URL";
            }
        });
    }
}); 
// Parallax effect for elements with parallax-element class
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        parallaxElements.forEach(element => {
            const depth = element.getAttribute('data-parallax-depth') || 20;
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-15px)`;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ question buttons
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Get all FAQ answers and initialize them to be closed
    const faqAnswers = document.querySelectorAll('.faq-answer');
    faqAnswers.forEach(answer => {
        // Set initial state for all answers
        answer.style.maxHeight = '0px';
        // Force a reflow
        answer.offsetHeight;
        // Add hidden class
        answer.classList.add('hidden');
    });
    
    // Add click event listener to each question
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle the active class on the question
            this.classList.toggle('active');
            
            // Get the corresponding answer
            const answer = this.nextElementSibling;
            
            // Toggle the visibility of the answer
            if (answer.classList.contains('active')) {
                // Close the answer
                answer.classList.remove('active');
                answer.style.maxHeight = '0px';
                
                // Rotate the chevron icon back
                this.querySelector('i').classList.remove('rotate-180');
                
                // After animation completes, add hidden class
                setTimeout(() => {
                    if (!answer.classList.contains('active')) {
                        answer.classList.add('hidden');
                    }
                }, 500); // Match transition duration (500ms)
            } else {
                // Remove hidden first to calculate height
                answer.classList.remove('hidden');
                
                // Force a reflow to ensure the transition works
                answer.offsetHeight;
                
                // Open the answer
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 40 + 'px'; // Add padding space
                
                // Rotate the chevron icon
                this.querySelector('i').classList.add('rotate-180');
            }
        });
    });
});