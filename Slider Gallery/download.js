// This file helps ensure Shery.js is loaded correctly
// It will be used to download Shery.js locally if CDN fails

(function() {
    // Check if Shery is defined
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            if (typeof Shery === 'undefined') {
                console.error('Shery.js is not loaded correctly. Attempting to load from fallback source...');
                
                // Create script elements
                loadScript('https://unpkg.com/sheryjs@1.0.0-beta.0/dist/Shery.js')
                    .then(() => {
                        console.log('Shery.js loaded successfully from fallback source');
                        // Trigger initialization after making sure slides are loaded
                        checkSlidesAndInitialize();
                    })
                    .catch(() => {
                        console.error('Failed to load Shery.js from fallback source');
                    });
            } else {
                console.log('Shery.js loaded successfully from primary source');
            }
        }, 1000); // Check after 1 second
    });
    
    // Helper function to load script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Check if slides exist yet and initialize if they do
    function checkSlidesAndInitialize() {
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            if (typeof initSliderWithShery === 'function') {
                initSliderWithShery();
            }
        } else {
            // If slides don't exist yet, check again after a delay
            setTimeout(checkSlidesAndInitialize, 500);
        }
    }
    
    // Export a global function that can be called to initialize slider with Shery
    window.initSliderWithShery = function() {
        if (typeof Shery !== 'undefined') {
            try {
                // Make sure slides exist before applying effects
                const sheryImages = document.querySelectorAll('.shery-img');
                if (sheryImages.length === 0) {
                    console.log('No slides found yet, will retry applying Shery effects later');
                    setTimeout(window.initSliderWithShery, 500);
                    return;
                }
                
                // Basic image effects
                Shery.imageEffect(".shery-img", {
                    style: 3,
                    debug: false,
                    gooey: true
                });
                
                // Make text elements interactive
                Shery.makeMagnet(".content h1");
                
                // Animate text elements
                Shery.textAnimate(".content h1", {
                    style: 2
                });
                
                console.log('Shery effects applied successfully to', sheryImages.length, 'images');
            } catch (e) {
                console.error('Error applying Shery effects:', e);
            }
        }
    };
})(); 