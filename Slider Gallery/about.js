document.addEventListener('DOMContentLoaded', () => {
    const interactiveBg = document.querySelector('.interactive-bg');
    const sectionImages = document.querySelectorAll('.section-image img');
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Setup interactive background
    setupInteractiveBackground();
    
    // Initialize animations with GSAP
    initializeAnimations();
    
    // Initialize Shery.js effects
    initializeSheryEffects();
    
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
            if (e.target.closest('.about-container, header, footer')) return;
            
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
    
    // Initialize scroll animations
    function initializeAnimations() {
        // Detect when elements are in viewport
        const aboutSections = document.querySelectorAll('.about-section');
        const teamSection = document.querySelector('.team-section');
        
        // Create scroll observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.1 });
        
        // Observe about sections
        aboutSections.forEach(section => {
            section.style.animationPlayState = 'paused';
            observer.observe(section);
        });
        
        // Observe team section
        if (teamSection) {
            teamSection.style.animationPlayState = 'paused';
            observer.observe(teamSection);
        }
        
        // Add hover effects to team members
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                gsap.to(member, {
                    y: -10,
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                    duration: 0.3
                });
            });
            
            member.addEventListener('mouseleave', () => {
                gsap.to(member, {
                    y: 0,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    duration: 0.3
                });
            });
        });
        
        // Add parallax effect to section images on scroll
        if ('requestAnimationFrame' in window) {
            let scrollY = window.scrollY || window.pageYOffset;
            
            function parallaxScroll() {
                const newScrollY = window.scrollY || window.pageYOffset;
                const scrollDiff = newScrollY - scrollY;
                
                sectionImages.forEach(img => {
                    const containerRect = img.parentElement.getBoundingClientRect();
                    const isVisible = containerRect.top < window.innerHeight && containerRect.bottom > 0;
                    
                    if (isVisible) {
                        const translateY = parseFloat(img.getAttribute('data-translate-y') || 0);
                        const newTranslateY = translateY + (scrollDiff * 0.1);
                        
                        img.setAttribute('data-translate-y', newTranslateY);
                        img.style.transform = `translateY(${newTranslateY}px)`;
                    }
                });
                
                scrollY = newScrollY;
                requestAnimationFrame(parallaxScroll);
            }
            
            requestAnimationFrame(parallaxScroll);
        }
    }
    
    // Initialize Shery.js effects
    function initializeSheryEffects() {
        if (window.Shery && window.Shery.imageEffect) {
            // Add hover effect to team member images
            Shery.imageEffect(".member-image img", {
                style: 3, // Choose style from 1-6
                config: {
                    "uColor": { "value": false },
                    "uSpeed": { "value": 0.6, "range": [0.1, 1], "rangep": [1, 10] },
                    "uAmplitude": { "value": 1.5, "range": [0, 5] },
                    "uFrequency": { "value": 3.5, "range": [0, 10] },
                    "gooey": { "value": true },
                    "infiniteGooey": { "value": true },
                    "durationOut": { "value": 1, "range": [0.1, 5] },
                    "durationIn": { "value": 1, "range": [0.1, 5] }
                },
                gooey: true
            });
            
            // Add effect to section images
            Shery.imageEffect(".hover-effect", {
                style: 5,
                config: {
                    "a": { "value": 2, "range": [0, 30] },
                    "b": { "value": -0.7, "range": [-1, 1] },
                    "zindex": { "value": -9996999, "range": [-9999999, 9999999] },
                    "aspect": { "value": 2.0617551462621633 },
                    "gooey": { "value": true },
                    "infiniteGooey": { "value": true },
                    "growSize": { "value": 4, "range": [1, 15] },
                    "durationOut": { "value": 1, "range": [0.1, 5] },
                    "durationIn": { "value": 1.5, "range": [0.1, 5] },
                    "displaceAmount": { "value": 0.5 },
                    "masker": { "value": true },
                    "maskVal": { "value": 1, "range": [1, 5] },
                    "scrollType": { "value": 0 },
                    "geoVertex": { "range": [1, 64], "value": 1 },
                    "noEffectGooey": { "value": true },
                    "onMouse": { "value": 1 },
                    "noise_speed": { "value": 0.76, "range": [0, 10] },
                    "metaball": { "value": 0.2, "range": [0, 2] },
                    "discard_threshold": { "value": 0.5, "range": [0, 1] },
                    "antialias_threshold": { "value": 0, "range": [0, 0.1] },
                    "noise_height": { "value": 0.47, "range": [0, 2] },
                    "noise_scale": { "value": 11.45, "range": [0, 100] }
                },
                gooey: true,
                preset: "wigglewobble"
            });
        }
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