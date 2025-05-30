// Enhanced animations for calculator buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements with specific delays for staggered appearance
    const setupStaggeredAnimations = () => {
        const calcButtons = document.querySelectorAll('.calc-btn');
        calcButtons.forEach((btn, index) => {
            btn.style.setProperty('--delay', index * 0.05);
            btn.classList.add('animate-delay');
        });
    };

    // Add button press animation effect
    const setupButtonPressEffects = () => {
        const calcButtons = document.querySelectorAll('.calc-btn');
        calcButtons.forEach(btn => {
            btn.addEventListener('mousedown', function() {
                this.classList.add('btn-press');
            });
            
            btn.addEventListener('mouseup', function() {
                setTimeout(() => {
                    this.classList.remove('btn-press');
                }, 100);
            });
            
            btn.addEventListener('mouseleave', function() {
                this.classList.remove('btn-press');
            });
        });
    };

    // Add glow effect to the display
    const setupDisplayGlow = () => {
        const display = document.getElementById('display');
        if (display) {
            display.addEventListener('change', function() {
                display.classList.add('number-updated');
                setTimeout(() => {
                    display.classList.remove('number-updated');
                }, 300);
            });
        }
    };

    // Add bounce animation to operation buttons
    const setupOperationButtonEffects = () => {
        const operationButtons = document.querySelectorAll('[data-operation]');
        operationButtons.forEach(btn => {
            btn.addEventListener('mouseover', function() {
                this.classList.add('bounce-effect');
            });
            
            btn.addEventListener('mouseout', function() {
                this.classList.remove('bounce-effect');
            });
        });
    };

    // Add keyboard shortcut toggle
    const setupKeyboardShortcutToggle = () => {
        document.addEventListener('keydown', function(e) {
            if (e.key === '?') {
                const keyboardShortcuts = document.getElementById('keyboard-shortcuts');
                if (keyboardShortcuts) {
                    if (keyboardShortcuts.style.display === 'block') {
                        keyboardShortcuts.style.display = 'none';
                    } else {
                        keyboardShortcuts.style.display = 'block';
                    }
                }
            }
        });
    };

    // Initialize all animation features
    const initAnimations = () => {
        setupStaggeredAnimations();
        setupButtonPressEffects();
        setupDisplayGlow();
        setupOperationButtonEffects();
        setupKeyboardShortcutToggle();
    };

    // Start animations
    initAnimations();

    // Add CSS for bounce effect
    const addExtraStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            .bounce-effect {
                animation: bounce 0.5s ease infinite;
            }
        `;
        document.head.appendChild(style);
    };

    addExtraStyles();
});
