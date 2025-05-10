document.addEventListener('DOMContentLoaded', () => {
    // Demo images
    const demoImages = [
        { name: 'Nature', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { name: 'City', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { name: 'Dog', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { name: 'Food', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { name: 'Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' }
    ];
    
    // Default image
    const defaultImageUrl = demoImages[0].url;
    
    // Elements
    const imageUrl = document.getElementById('image-url');
    const displayBtn = document.getElementById('display-btn');
    const errorMessage = document.getElementById('error-message');
    const flipBtns = document.querySelectorAll('.flip-btn');
    const rotateBtns = document.querySelectorAll('.rotate-btn');
    const resetBtns = document.querySelectorAll('.reset-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const image = document.querySelector('.flip-image');
    const demoContainer = document.getElementById('demo-images');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Current filter
    let currentFilter = 'normal';
    
    // Handle tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tab buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding tab content
            const tabId = btn.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Create demo image thumbnails
    demoImages.forEach((demo, index) => {
        const demoThumb = document.createElement('div');
        demoThumb.classList.add('demo-thumb');
        demoThumb.dataset.url = demo.url;
        
        const thumbImg = document.createElement('img');
        thumbImg.src = demo.url;
        thumbImg.alt = demo.name;
        demoThumb.appendChild(thumbImg);
        
        demoThumb.addEventListener('click', () => {
            // Update image with the demo URL
            updateImage(demo.url);
            
            // Clear any error message
            hideError();
            
            // Update thumbnail active state
            document.querySelectorAll('.demo-thumb').forEach(thumb => {
                thumb.classList.remove('active');
            });
            demoThumb.classList.add('active');
            
            // Clear the custom URL input
            imageUrl.value = '';
            
            // Reset the file input
            fileUpload.value = '';
            fileName.textContent = 'No file chosen';
            
            // Switch back to controls tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.querySelector('[data-tab="controls"]').classList.add('active');
            document.getElementById('controls-tab').classList.add('active');
        });
        
        // Set the first thumbnail as active
        if (index === 0) {
            demoThumb.classList.add('active');
        }
        
        demoContainer.appendChild(demoThumb);
    });
    
    // Keep track of transform state for the image
    const transformState = { horizontal: false, vertical: false, rotation: 0 };
    
    // Set initial image source
    image.src = defaultImageUrl;
    
    // Function to update image with a new URL
    function updateImage(newUrl) {
        image.src = newUrl;
        
        // Reset transform
        resetTransform();
    }
    
    // Handle file upload
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            fileName.textContent = file.name;
            
            // Check if the file is an image
            if (!file.type.match('image.*')) {
                showError('Please select an image file');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                
                // Update image with the uploaded image
                updateImage(imageUrl);
                
                // Remove active state from demo thumbnails
                document.querySelectorAll('.demo-thumb').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                
                // Clear any error message
                hideError();
                
                // Clear the URL input
                document.getElementById('image-url').value = '';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Handle display button click for custom URL
    displayBtn.addEventListener('click', () => {
        const newImageUrl = imageUrl.value.trim();
        
        if (!newImageUrl) {
            showError('Please enter an image URL');
            return;
        }
        
        // Test if the image URL is valid
        const testImage = new Image();
        testImage.onload = () => {
            // Valid image
            hideError();
            
            // Update image
            updateImage(newImageUrl);
            
            // Remove active state from demo thumbnails
            document.querySelectorAll('.demo-thumb').forEach(thumb => {
                thumb.classList.remove('active');
            });
            
            // Reset file input
            fileUpload.value = '';
            fileName.textContent = 'No file chosen';
        };
        
        testImage.onerror = () => {
            showError('Invalid image URL or image not found');
        };
        
        testImage.src = newImageUrl;
    });
    
    // Handle flip buttons click
    flipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            
            // Check which type of flip
            if (direction === 'horizontal-left') {
                // Toggle horizontal flip
                transformState.horizontal = !transformState.horizontal;
            } else if (direction === 'vertical-up') {
                // Toggle vertical flip
                transformState.vertical = !transformState.vertical;
            }
            
            // Apply transform
            updateImageTransform();
        });
    });
    
    // Handle rotate buttons click
    rotateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            
            // Update rotation state based on direction
            if (direction === 'clockwise') {
                transformState.rotation = (transformState.rotation + 90) % 360;
            } else if (direction === 'counterclockwise') {
                transformState.rotation = (transformState.rotation - 90 + 360) % 360;
            }
            
            // Apply transform
            updateImageTransform();
        });
    });
    
    // Handle reset button click
    resetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset transforms
            resetTransform();
        });
    });
    
    // Handle reset all button click
    resetAllBtn.addEventListener('click', () => {
        resetTransform();
    });
    
    // Handle download button click
    downloadBtn.addEventListener('click', () => {
        // Create a canvas element to render the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const imageSize = 600;
        canvas.width = imageSize;
        canvas.height = imageSize;
        
        // Draw background
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Function to draw image with its transformations
        const drawImageOnCanvas = () => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = image.src;
                
                img.onload = () => {
                    // Save context state
                    ctx.save();
                    
                    // Move to the center of the canvas
                    ctx.translate(canvas.width/2, canvas.height/2);
                    
                    // Apply transformations
                    
                    // Rotation
                    if (transformState.rotation !== 0) {
                        ctx.rotate(transformState.rotation * Math.PI / 180);
                    }
                    
                    // Flip
                    if (transformState.horizontal) {
                        ctx.scale(-1, 1);
                    }
                    if (transformState.vertical) {
                        ctx.scale(1, -1);
                    }
                    
                    // Apply filter if needed
                    if (currentFilter !== 'normal') {
                        const filterCanvas = document.createElement('canvas');
                        const filterCtx = filterCanvas.getContext('2d');
                        filterCanvas.width = img.width;
                        filterCanvas.height = img.height;
                        
                        // Draw image on filter canvas
                        filterCtx.drawImage(img, 0, 0);
                        
                        // Apply filter to pixel data
                        const imageData = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
                        applyFilterToImageData(imageData, currentFilter);
                        filterCtx.putImageData(imageData, 0, 0);
                        
                        // Draw filtered image
                        const size = Math.min(canvas.width, canvas.height) * 0.9;
                        ctx.drawImage(filterCanvas, -size/2, -size/2, size, size);
                    } else {
                        // Draw original image
                        const size = Math.min(canvas.width, canvas.height) * 0.9;
                        ctx.drawImage(img, -size/2, -size/2, size, size);
                    }
                    
                    // Restore context state
                    ctx.restore();
                    resolve();
                };
                
                img.onerror = () => {
                    // In case of error, just resolve
                    resolve();
                };
            });
        };
        
        // Draw image then download
        drawImageOnCanvas().then(() => {
            // Create download link
            const link = document.createElement('a');
            link.download = 'flipped-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Apply filter to image data
    function applyFilterToImageData(imageData, filter) {
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            switch (filter) {
                case 'grayscale':
                    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    break;
                    
                case 'sepia':
                    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                    break;
                    
                case 'invert':
                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;
                    data[i + 2] = 255 - b;
                    break;
                    
                case 'brightness':
                    data[i] = Math.min(255, r * 1.5);
                    data[i + 1] = Math.min(255, g * 1.5);
                    data[i + 2] = Math.min(255, b * 1.5);
                    break;
                    
                case 'blur':
                    // Blur is implemented via CSS, not here
                    break;
            }
        }
    }
    
    // Handle filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Update current filter
            currentFilter = filter;
            
            // Apply with animation
            // Remove all filter classes
            image.classList.remove('grayscale', 'sepia', 'invert', 'blur', 'brightness');
            
            // Add animation class
            const imageWrapper = document.getElementById('image-0');
            imageWrapper.classList.add('filter-changing');
            
            // Apply filter after short delay for animation
            setTimeout(() => {
                if (filter !== 'normal') {
                    image.classList.add(filter);
                }
            }, 150);
            
            // Remove animation class
            setTimeout(() => {
                imageWrapper.classList.remove('filter-changing');
            }, 500);
        });
    });
    
    // Update image transform based on state
    function updateImageTransform() {
        const imageWrapper = document.getElementById('image-0');
        
        // Remove all transform classes first
        image.classList.remove('flip-horizontal', 'flip-vertical', 'flip-both', 
                               'rotate-90', 'rotate-180', 'rotate-270');
        
        // Determine combined transform classes
        let classes = [];
        if (transformState.horizontal && transformState.vertical) {
            classes.push('flip-both');
        } else if (transformState.horizontal) {
            classes.push('flip-horizontal');
        } else if (transformState.vertical) {
            classes.push('flip-vertical');
        }
        
        if (transformState.rotation === 90) {
            classes.push('rotate-90');
        } else if (transformState.rotation === 180) {
            classes.push('rotate-180');
        } else if (transformState.rotation === 270) {
            classes.push('rotate-270');
        }
        
        // Apply animation class for transition effect
        imageWrapper.classList.add('animating');
        
        // Add a small delay before applying the transform to ensure animation works
        setTimeout(() => {
            // Apply the classes
            classes.forEach(cls => {
                image.classList.add(cls);
            });
            
            // Apply filter if any
            if (currentFilter !== 'normal') {
                image.classList.add(currentFilter);
            } else {
                image.classList.remove('grayscale', 'sepia', 'invert', 'blur', 'brightness');
            }
        }, 50);
        
        // Remove the animation class after transition completes
        setTimeout(() => {
            imageWrapper.classList.remove('animating');
        }, 600);
    }
    
    // Reset transform with animation
    function resetTransform() {
        // Reset transform state
        transformState.horizontal = false;
        transformState.vertical = false;
        transformState.rotation = 0;
        
        const imageWrapper = document.getElementById('image-0');
        
        // Add reset animation class
        imageWrapper.classList.add('resetting');
        
        // Apply transforms after animation
        setTimeout(() => {
            // Remove all transform classes
            image.classList.remove('flip-horizontal', 'flip-vertical', 'flip-both', 
                             'rotate-90', 'rotate-180', 'rotate-270');
            
            // Remove all filter classes if this is a full reset
            image.classList.remove('grayscale', 'sepia', 'invert', 'blur', 'brightness');
        }, 300);
        
        // Remove animation class
        setTimeout(() => {
            imageWrapper.classList.remove('resetting');
        }, 600);
        
        // Reset filter buttons
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'normal') {
                btn.classList.add('active');
            }
        });
        
        // Reset current filter
        currentFilter = 'normal';
    }
    
    // Initialize with normal filter selected
    document.querySelector('.filter-btn[data-filter="normal"]').classList.add('active');
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Hide error message
    function hideError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
}); 