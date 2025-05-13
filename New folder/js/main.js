/**
 * Culinary Canvas - Main JavaScript File
 * Contains functionality for mobile menu toggle and hero slider
 */

// Document ready function
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Functionality
    initMobileMenu();
    
    // Hero Slider Functionality (if exists on page)
    if (document.getElementById('hero-slider')) {
        initHeroSlider();
    }
    
    // Horizontal Recipe Scroller (if exists on page)
    if (document.getElementById('latest-recipes-container')) {
        initHorizontalScroller();
    }
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize hero slider functionality
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    // Initialize the first slide
    if (slides.length > 0) {
        slides[0].classList.add('opacity-100');
        dots[0].classList.add('bg-opacity-100');

        // Function to change slide
        const goToSlide = (n) => {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('opacity-100');
                slide.classList.add('opacity-0');
            });
            
            // Remove active state from all dots
            dots.forEach(dot => {
                dot.classList.remove('bg-opacity-100');
                dot.classList.add('bg-opacity-50');
            });
            
            // Show the selected slide
            slides[n].classList.remove('opacity-0');
            slides[n].classList.add('opacity-100');
            
            // Add active state to the selected dot
            dots[n].classList.remove('bg-opacity-50');
            dots[n].classList.add('bg-opacity-100');
            
            // Update current slide index
            currentSlide = n;
        };

        // Function for next slide
        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        // Start automatic slideshow
        const startSlideshow = () => {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        };

        // Stop slideshow on user interaction
        const stopSlideshow = () => {
            clearInterval(slideInterval);
        };

        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideshow();
                goToSlide(index);
                startSlideshow();
            });
        });

        // Start the slideshow
        startSlideshow();
    }
}

/**
 * Initialize horizontal recipe scroller
 */
function initHorizontalScroller() {
    const container = document.getElementById('latest-recipes-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    if (container && scrollLeftBtn && scrollRightBtn) {
        // Calculate scroll amount (approximately 2 cards)
        const scrollAmount = 640; // 2 cards at 320px width
        
        // Scroll right button click
        scrollRightBtn.addEventListener('click', () => {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Scroll left button click
        scrollLeftBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Add scrollbar-hide class (since some browsers don't support it via Tailwind)
        container.classList.add('hide-scrollbar');
    }
} 