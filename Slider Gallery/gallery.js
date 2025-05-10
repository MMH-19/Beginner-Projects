document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const interactiveBg = document.querySelector('.interactive-bg');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let galleryItems = [];
    let currentImageIndex = 0;
    let filteredItems = [];
    let currentFilter = 'all';
    
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
            if (e.target.closest('.gallery-container, header, footer, .lightbox')) return;
            
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
            galleryItems = imageData;
            filteredItems = [...galleryItems];
            
            // Remove loading indicator
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                gsap.to(loadingIndicator, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loadingIndicator.remove();
                        // Create gallery items
                        createGalleryItems(galleryItems);
                        // Setup filter functionality
                        setupFilters();
                        // Initialize Shery effects for gallery items
                        initializeSheryEffects();
                    }
                });
            }
            
        } catch (error) {
            console.error('Error loading images:', error);
            galleryGrid.innerHTML = `<div class="error-message">Error loading images. Please try again later.</div>`;
        }
    }
    
    // Function to create gallery items
    function createGalleryItems(items) {
        galleryGrid.innerHTML = '';
        
        // Assign categories to images based on their content
        items.forEach((image, index) => {
            // Determine category based on title and description
            const imageTitle = image.title.toLowerCase();
            const imageDesc = image.description.toLowerCase();
            let category = 'nature'; // Default category
            
            if (imageTitle.includes('wildlife') || imageDesc.includes('wildlife') || 
                imageTitle.includes('creature') || imageDesc.includes('creature')) {
                category = 'wildlife';
            } else if (imageTitle.includes('city') || imageDesc.includes('city') ||
                      imageTitle.includes('urban') || imageDesc.includes('urban') ||
                      imageTitle.includes('cityscapes') || imageTitle.includes('ruins')) {
                category = 'city';
            } else if (imageTitle.includes('water') || imageDesc.includes('water') ||
                      imageTitle.includes('ocean') || imageDesc.includes('ocean') ||
                      imageTitle.includes('lake') || imageDesc.includes('lake') ||
                      imageTitle.includes('river') || imageDesc.includes('river') ||
                      imageTitle.includes('sea') || imageDesc.includes('sea')) {
                category = 'water';
            }
            
            // Assign category to the image object
            image.category = category;
            
            // Create gallery item if it matches the current filter
            if (currentFilter === 'all' || image.category === currentFilter) {
                createGalleryItem(image, index);
            }
        });
        
        // Update filtered items array
        updateFilteredItems();
    }
    
    // Function to create a single gallery item
    function createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        item.dataset.category = image.category;
        
        item.style.animationDelay = `${index * 0.05}s`;
        
        item.innerHTML = `
            <img src="${image.url}" alt="${image.alt}" loading="lazy">
            <div class="gallery-item-overlay">
                <h3 class="gallery-item-title">${image.title}</h3>
            </div>
        `;
        
        // Add click event to open lightbox
        item.addEventListener('click', () => {
            openLightbox(index);
        });
        
        galleryGrid.appendChild(item);
    }
    
    // Function to update filtered items array
    function updateFilteredItems() {
        if (currentFilter === 'all') {
            filteredItems = [...galleryItems];
        } else {
            filteredItems = galleryItems.filter(item => item.category === currentFilter);
        }
    }
    
    // Function to setup filter buttons
    function setupFilters() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update current filter
                currentFilter = btn.dataset.filter;
                
                // Apply filter
                applyFilter(currentFilter);
            });
        });
    }
    
    // Function to apply filter
    function applyFilter(filter) {
        // Clear gallery
        galleryGrid.innerHTML = '';
        
        // Create gallery items based on filter
        if (filter === 'all') {
            galleryItems.forEach((image, index) => {
                createGalleryItem(image, index);
            });
        } else {
            galleryItems.forEach((image, index) => {
                if (image.category === filter) {
                    createGalleryItem(image, index);
                }
            });
        }
        
        // Update filtered items array
        updateFilteredItems();
        
        // Reinitialize Shery effects
        initializeSheryEffects();
    }
    
    // Function to open lightbox
    function openLightbox(index) {
        // Find the actual index in the filtered items array
        const actualItem = filteredItems[index] || galleryItems[index];
        currentImageIndex = galleryItems.indexOf(actualItem);
        
        // Set lightbox content
        lightboxImage.src = galleryItems[currentImageIndex].url;
        lightboxTitle.textContent = galleryItems[currentImageIndex].title;
        lightboxDescription.textContent = galleryItems[currentImageIndex].description;
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        
        // Add keyboard event listeners
        document.addEventListener('keydown', handleLightboxKeydown);
    }
    
    // Function to close lightbox
    function closeLightboxFunc() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Remove keyboard event listeners
        document.removeEventListener('keydown', handleLightboxKeydown);
    }
    
    // Function to go to previous image in lightbox
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }
    
    // Function to go to next image in lightbox
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }
    
    // Function to update lightbox content
    function updateLightboxContent() {
        // GSAP animation for smooth transition
        gsap.to(lightboxImage, {
            opacity: 0,
            scale: 0.9,
            duration: 0.2,
            onComplete: () => {
                lightboxImage.src = galleryItems[currentImageIndex].url;
                lightboxTitle.textContent = galleryItems[currentImageIndex].title;
                lightboxDescription.textContent = galleryItems[currentImageIndex].description;
                
                gsap.to(lightboxImage, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3
                });
            }
        });
    }
    
    // Function to handle keyboard events in lightbox
    function handleLightboxKeydown(e) {
        switch (e.key) {
            case 'Escape':
                closeLightboxFunc();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
    
    // Initialize Shery.js effects for gallery items
    function initializeSheryEffects() {
        if (window.Shery && window.Shery.imageEffect) {
            Shery.imageEffect(".gallery-item img", {
                style: 5,  // Choose style from 1-6
                config: {
                    "a": { "value": 1.49, "range": [0, 30] },
                    "b": { "value": -0.98, "range": [-1, 1] },
                    "aspectRatio": { "value": 1 },
                    "gooey": { "value": true },
                    "infiniteGooey": { "value": true },
                    "durationOut": { "value": 1, "range": [0.1, 5] },
                    "durationIn": { "value": 1, "range": [0.1, 5] },
                    "displaceAmount": { "value": 0.5 },
                    "masker": { "value": true },
                    "maskVal": { "value": 1, "range": [1, 5] },
                    "scrollType": { "value": 0 },
                    "geoVertex": { "range": [1, 64], "value": 1 },
                    "noEffectGooey": { "value": true },
                    "onMouse": { "value": 1 },
                    "noise_speed": { "value": 0.84, "range": [0, 10] },
                    "metaball": { "value": 0.15, "range": [0, 2] },
                    "discard_threshold": { "value": 0.5, "range": [0, 1] },
                    "antialias_threshold": { "value": 0, "range": [0, 0.1] },
                    "noise_height": { "value": 0.47, "range": [0, 2] },
                    "noise_scale": { "value": 10.69, "range": [0, 100] }
                },
                gooey: true // Enable gooey effect for smooth transitions
            });
        }
    }
    
    // Event listeners
    closeLightbox.addEventListener('click', closeLightboxFunc);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxFunc();
        }
    });
    
    // Update gallery items on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeSheryEffects();
        }, 250);
    });
}); 