// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '0.5rem 5%';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1rem 5%';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Make FAQ items expandable
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        answer.style.opacity = '0';
        
        // Add plus icon to questions
        question.style.position = 'relative';
        question.style.cursor = 'pointer';
        
        const icon = document.createElement('span');
        icon.innerHTML = '+';
        icon.style.position = 'absolute';
        icon.style.right = '0';
        icon.style.fontSize = '1.5rem';
        icon.style.transition = 'transform 0.3s ease';
        
        question.appendChild(icon);
        
        // Toggle answer visibility on click
        question.addEventListener('click', () => {
            const isExpanded = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
            
            if (isExpanded) {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0';
                answer.style.marginTop = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.padding = '0.75rem 0 0';
                answer.style.marginTop = '0.5rem';
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.getElementById('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real application, you would send this data to a server
            alert(`Thank you for your message, ${name}! We will get back to you soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            if (!email) {
                alert('Please enter your email');
                return;
            }
            
            // In a real application, you would send this data to a server
            alert(`Thank you for subscribing with ${email}! You'll receive our updates soon.`);
            
            // Reset form
            newsletterForm.reset();
        });
    }
    
    // Product purchase buttons
    const buyButtons = document.querySelectorAll('.buy-button');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.pricing-card').querySelector('h3').textContent;
            
            // In a real application, this would redirect to a checkout page
            alert(`You selected ${product}. In a real store, you would be redirected to checkout.`);
        });
    });
}); 