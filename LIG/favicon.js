document.addEventListener('DOMContentLoaded', () => {
    // This script converts the SVG favicon to PNG fallback for older browsers
    // Only run this if the browser supports necessary canvas features
    if (window.fetch && document.createElement('canvas').getContext) {
        createPngFavicon();
    }
});

async function createPngFavicon() {
    try {
        // Fetch the SVG file
        const response = await fetch('favicon.svg');
        const svgText = await response.text();
        
        // Create a Blob URL for the SVG
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Create an Image element to load the SVG
        const img = new Image();
        img.onload = function() {
            // Create canvas with double the size for better quality
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            
            // Draw the SVG on the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 64, 64);
            
            // Generate PNG data URL
            const pngDataUrl = canvas.toDataURL('image/png');
            
            // Create a link to download the PNG
            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            link.href = pngDataUrl;
            document.head.appendChild(link);
            
            // Clean up
            URL.revokeObjectURL(svgUrl);
        };
        
        // Set the source of the image to the Blob URL
        img.src = svgUrl;
    } catch (error) {
        console.error('Error generating PNG favicon:', error);
    }
} 