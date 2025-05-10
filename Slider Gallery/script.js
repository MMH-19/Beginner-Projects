document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentSlideEl = document.querySelector('.slide-counter .current');
    const totalSlidesEl = document.querySelector('.slide-counter .total');
    const interactiveBg = document.querySelector('.interactive-bg');
    let slides = [];
    let currentSlide = 0;
    let isAnimating = false;
    
    // Create a progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.querySelector('.slider-container').appendChild(progressBar);
    
    // Setup interactive background
    setupInteractiveBackground();
    
    // Load images from JSON
    loadImagesFromJSON();
    
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
            if (e.target.closest('.slider-container, header, footer')) return;
            
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
    
    // Function to load images from JSON
    async function loadImagesFromJSON() {
        try {
            // Fetch the JSON file
            const response = await fetch('images.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const imageData = await response.json();
            
            // Update total slides count in UI
            if (totalSlidesEl) {
                totalSlidesEl.textContent = imageData.length;
            }
            
            // Remove loading indicator
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                gsap.to(loadingIndicator, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                loadingIndicator.remove();
                    }
                });
            }
            
            // Create slides from JSON data
            createSlides(imageData);
            
            // Initialize the slider after slides are created
            setTimeout(() => {
                slides = document.querySelectorAll('.slide');
                initSlider();
                
                // Initialize Shery.js with enhanced effects
                initializeSheryEffects();
            }, 100);
            
        } catch (error) {
            console.error('Error loading images:', error);
            sliderContainer.innerHTML = `<div class="error-message">Error loading images. Please try again later.</div>`;
        }
    }
    
    // Function to create slides from JSON data
    function createSlides(imageData) {
        let slidesHTML = '';
        
        imageData.forEach((image, index) => {
            slidesHTML += `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <div class="content">
                        <h1>${image.title}</h1>
                        <p>${image.description}</p>
                    </div>
                    <img class="shery-img" src="${image.url}" alt="${image.alt}">
                </div>
            `;
        });
        
        sliderContainer.innerHTML = slidesHTML;
    }
    
    // Initialize the slider
    function initSlider() {
        // Make sure at least one slide is active
        if (slides.length > 0 && !document.querySelector('.slide.active')) {
            slides[0].classList.add('active');
            animateSlideContent(0);
        }
        
        // Update slide counter
        updateSlideCounter(currentSlide);
        
        // Add event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                // Swiped left
                nextSlide();
            } else if (touchEndX - touchStartX > threshold) {
                // Swiped right
                prevSlide();
            }
        }
        
        // Initial content animation
        animateSlideContent(currentSlide);
        
        // Change background color based on active slide
        updateBackgroundColor(currentSlide);
        
        // Enhance button interactions
        enhanceButtonInteractions();
    }
    
    // Update background color based on slide
    function updateBackgroundColor(slideIndex) {
        // Array of gradient colors for background
        const gradients = [
            'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
            'linear-gradient(-45deg, #330867, #30cfd0)',
            'linear-gradient(-45deg, #fc466b, #3f5efb)',
            'linear-gradient(-45deg, #c94b4b, #4b134f)',
            'linear-gradient(-45deg, #4facfe, #00f2fe)',
            'linear-gradient(-45deg, #6a11cb, #2575fc)',
            'linear-gradient(-45deg, #ff9a9e, #fad0c4)'
        ];
        
        // Select color based on slide index, repeat if necessary
        const gradientIndex = slideIndex % gradients.length;
        
        if (interactiveBg) {
            gsap.to(interactiveBg, {
                background: gradients[gradientIndex],
                duration: 1.5,
                ease: 'power2.inOut'
            });
        }
    }
    
    // Update slide counter
    function updateSlideCounter(slideIndex) {
        if (currentSlideEl) {
            currentSlideEl.textContent = slideIndex + 1;
        }
    }
    
    // Handle keyboard navigation
    function handleKeyDown(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    }
    
    // Go to previous slide
    function prevSlide() {
        if (isAnimating) return;
        goToSlide(currentSlide - 1);
    }
    
    // Go to next slide
    function nextSlide() {
        if (isAnimating) return;
        goToSlide(currentSlide + 1);
    }
    
    // Animate slide content (title and description)
    function animateSlideContent(slideIndex) {
        const heading = slides[slideIndex].querySelector('h1');
        const paragraph = slides[slideIndex].querySelector('p');
        const content = slides[slideIndex].querySelector('.content');
        
        // Reset opacity to ensure animations work
        gsap.set(content, { opacity: 0, y: 30 });
        gsap.set(heading, { opacity: 0, y: 10 });
        gsap.set(paragraph, { opacity: 0, y: 10 });
        
        // Create a timeline for smooth sequenced animations
        const tl = gsap.timeline({ delay: 0.2 });
        
        tl.to(content, {
            opacity: 1, 
            y: 0, 
            duration: 0.7, 
            ease: "power2.out"
        })
        .to(heading, {
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            ease: "back.out(1.5)"
        }, "-=0.5")
        .to(paragraph, {
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            ease: "power2.out"
        }, "-=0.3");
        
        // Update progress bar
        updateProgressBar(slideIndex);
    }
    
    // Update progress bar based on current slide
    function updateProgressBar(slideIndex) {
        const progressPercentage = ((slideIndex + 1) / slides.length) * 100;
        gsap.to(progressBar, {
            width: `${progressPercentage}%`,
            duration: 0.5,
            ease: "power1.inOut"
        });
    }
    
    // Go to a specific slide with enhanced GSAP animations
    function goToSlide(slideIndex) {
        // Ensure slides array is populated
        if (!slides.length) return;
        
        // Set animating flag
        isAnimating = true;
        
        // Handle edge cases
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        
        // Get previous and current slide elements
        const prevSlide = slides[currentSlide];
        
        // Update currentSlide
        currentSlide = slideIndex;
        
        // Get new slide element
        const newSlide = slides[currentSlide];
        
        // Update slide counter
        updateSlideCounter(currentSlide);
        
        // Update background color
        updateBackgroundColor(currentSlide);
        
        // Create a timeline for transition
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
            }
        });
        
        // Hide current slide
        tl.to(prevSlide, {
            opacity: 0,
            scale: 1.1,
            duration: 0.7,
            ease: "power2.inOut",
            onComplete: () => {
                prevSlide.classList.remove('active');
            }
        });
        
        // Show new slide
        tl.fromTo(newSlide, 
            {
                opacity: 0,
                scale: 0.9
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "power2.out",
                onStart: () => {
                    newSlide.classList.add('active');
                }
            }, 
            "-=0.3" // Slight overlap for smoother transition
        );
        
        // Animate content of new slide
        animateSlideContent(currentSlide);
    }
    
    // Initialize Shery.js with enhanced effects
    function initializeSheryEffects() {
        if (typeof Shery !== 'undefined') {
            // Add the slider-canvas class to the canvas element
            setTimeout(() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.classList.add('slider-canvas');
                }
            }, 100);
            
            // Initialize image effects
            Shery.imageEffect(".slider-container", {
                style: 3, // Style number from Shery.js
                config: {
                    "uColor": { "value": true },
                    "uSpeed": { "value": 0.6, "range": [0.1, 1], "rangep": [1, 10] },
                    "uAmplitude": { "value": 1.5, "range": [0, 5] },
                    "uFrequency": { "value": 3.5, "range": [0, 10] },
                    "geoVertex": { "range": [1, 64], "value": 32 },
                    "zindex": { "value": -9996999, "range": [-9999999, 9999999] },
                    "aspect": { "value": 2.0551948703386897 },
                    "ignoreShapeAspect": { "value": true },
                    "shapePosition": { "value": { "x": 0, "y": 0 } },
                    "shapeScale": { "value": { "x": 0.5, "y": 0.5 } },
                    "shapeEdgeSoftness": { "value": 0, "range": [0, 0.5] },
                    "shapeRadius": { "value": 0, "range": [0, 2] },
                    "currentScroll": { "value": 0 },
                    "scrollLerp": { "value": 0.07 },
                    "gooey": { "value": true },
                    "infiniteGooey": { "value": true },
                    "growSize": { "value": 4, "range": [1, 15] },
                    "durationOut": { "value": 1, "range": [0.1, 5] },
                    "durationIn": { "value": 1.5, "range": [0.1, 5] },
                    "displaceAmount": { "value": 0.5 },
                    "masker": { "value": true },
                    "maskVal": { "value": 1, "range": [1, 5] },
                    "scrollType": { "value": 0 },
                    "gooeySpeed": { "value": 0.75, "range": [0, 2] }
                },
                debug: false,
                gooey: true
            });
            
            // Add hover effects to the navigation buttons
            document.querySelectorAll('.arrow').forEach(arrow => {
                arrow.addEventListener('mouseenter', () => {
                    gsap.to(arrow, {
                        scale: 1.15,
                        duration: 0.3,
                        ease: "back.out(2)"
                    });
                });
                
                arrow.addEventListener('mouseleave', () => {
                    gsap.to(arrow, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        }
    }
    
    // Add this function after the initSlider function
    function enhanceButtonInteractions() {
        const buttons = document.querySelectorAll('.arrow');
        
        buttons.forEach(button => {
            // Add pulse effect on initial load
            gsap.fromTo(button, 
                { scale: 0, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 0.7, 
                    duration: 0.8, 
                    ease: "elastic.out(1, 0.5)",
                    delay: 1
                }
            );
            
            // Add click effect
            button.addEventListener('mousedown', () => {
                gsap.to(button.querySelector('i'), {
                    scale: 0.8,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            button.addEventListener('mouseup', () => {
                gsap.to(button.querySelector('i'), {
                    scale: 1,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.5)"
                });
            });
            
            // Enhanced hover effect
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.15,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                
                gsap.to(button.querySelector('i'), {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(button.querySelector('i'), {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
}); 