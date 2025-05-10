document.addEventListener('DOMContentLoaded', () => {
    const paragraphsInput = document.getElementById('paragraphs');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputText = document.getElementById('output-text');

    // Generate lorem ipsum text based on user input
    function generateLoremIpsum() {
        const numParagraphs = parseInt(paragraphsInput.value);
        
        if (isNaN(numParagraphs) || numParagraphs < 1) {
            showNotification('Please enter a valid number of paragraphs (minimum 1).', 'error');
            return;
        }

        // Add loading animation
        generateBtn.classList.add('loading');
        
        // Small delay to show the loading animation
        setTimeout(() => {
            // Generate the paragraphs using our global LoremIpsum object
            const paragraphs = LoremIpsum.generateParagraphs(numParagraphs);
            
            // Format the output with paragraph tags
            outputText.innerHTML = paragraphs
                .split('\n\n')
                .map(p => `<p>${p}</p>`)
                .join('');
            
            // Remove loading animation
            generateBtn.classList.remove('loading');
            
            // Scroll to the output with a nice smooth scroll
            outputText.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            showNotification(`${numParagraphs} paragraph${numParagraphs > 1 ? 's' : ''} generated successfully!`, 'success');
        }, 500); // Just enough delay to show the loading animation
    }

    // Copy generated text to clipboard
    function copyToClipboard() {
        // Create a temporary element to hold plain text
        const tempElement = document.createElement('div');
        tempElement.innerHTML = outputText.innerHTML;
        
        const textToCopy = tempElement.textContent;
        
        if (!textToCopy.trim()) {
            showNotification('No text to copy. Generate some text first.', 'error');
            return;
        }

        // Use the Clipboard API if available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Visual feedback on successful copy
                    const originalText = copyBtn.textContent;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    showNotification('Text copied to clipboard!', 'success');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    fallbackCopyMethod(textToCopy);
                });
        } else {
            // Fallback for browsers without Clipboard API
            fallbackCopyMethod(textToCopy);
        }
    }

    // Fallback copy method using a temporary textarea
    function fallbackCopyMethod(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                showNotification('Text copied to clipboard!', 'success');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
                }, 2000);
            } else {
                showNotification('Failed to copy text', 'error');
            }
        } catch (err) {
            console.error('Error during copy', err);
            showNotification('Failed to copy text', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add style for the notification container
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '1000';
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style the notification
        notification.style.backgroundColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3';
        notification.style.color = 'white';
        notification.style.padding = '12px 16px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.minWidth = '250px';
        notification.style.transform = 'translateX(150%)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Trigger animation by setting a small delay
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            
            // Remove from DOM after transition
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Event listeners
    generateBtn.addEventListener('click', generateLoremIpsum);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Also generate on Enter key in the input field
    paragraphsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateLoremIpsum();
        }
    });

    // Generate initial text
    generateLoremIpsum();
}); 