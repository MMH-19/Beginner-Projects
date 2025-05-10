class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.maxDigits = 8;
        this.maxDecimalPlaces = 3;
    }

    clear() {
        this.currentOperand = '0';
        this.shouldResetScreen = false;
    }

    clearAll() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        // Handle decimal point
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Handle 0 at the beginning
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
            return;
        }

        // Check if adding this digit would exceed the max length
        if (this.currentOperand.replace('.', '').replace('-', '').length >= this.maxDigits 
            && number !== '.') return;

        // Limit decimal places
        if (this.currentOperand.includes('.')) {
            const parts = this.currentOperand.split('.');
            if (parts[1].length >= this.maxDecimalPlaces && number !== '.') return;
        }

        this.currentOperand += number;
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.startsWith('-') 
            ? this.currentOperand.slice(1) 
            : '-' + this.currentOperand;
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Format and check for error
        let result = computation.toString();
        
        // Check if result exceeds max digits
        if (result.replace('.', '').replace('-', '').length > this.maxDigits) {
            this.showError();
            return;
        }

        // Limit decimal places in result
        if (result.includes('.')) {
            const parts = result.split('.');
            if (parts[1].length > this.maxDecimalPlaces) {
                result = computation.toFixed(this.maxDecimalPlaces);
            }
        }

        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }

    showError() {
        const display = document.getElementById('current-operand');
        this.currentOperand = 'ERR';
        display.classList.add('animate-error');
        
        setTimeout(() => {
            display.classList.remove('animate-error');
            this.clearAll();
            this.updateDisplay();
        }, 1500);
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentOperandElement = document.getElementById('current-operand');
        const previousOperandElement = document.getElementById('previous-operand');
        
        currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.getOperationSymbol(this.operation)}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    getOperationSymbol(operation) {
        switch(operation) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Set up button animations
function animateButtonPress(button) {
    gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.1
            });
        }
    });
}

// Set up calculator display animation
function animateDisplay() {
    const display = document.getElementById('current-operand');
    gsap.from(display, {
        y: -10,
        opacity: 0.7,
        duration: 0.2
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            animateButtonPress(button);
            calculator.appendNumber(button.dataset.number);
            calculator.updateDisplay();
            animateDisplay();
        });
    });

    // Operation buttons
    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            animateButtonPress(button);
            calculator.chooseOperation(button.dataset.operation);
            calculator.updateDisplay();
        });
    });

    // Calculate button
    document.querySelector('[data-action="calculate"]').addEventListener('click', button => {
        animateButtonPress(button.currentTarget);
        calculator.calculate();
        calculator.updateDisplay();
        animateDisplay();
    });

    // Clear button
    document.querySelector('[data-action="clear"]').addEventListener('click', button => {
        animateButtonPress(button.currentTarget);
        calculator.clear();
        calculator.updateDisplay();
    });

    // Clear all button
    document.querySelector('[data-action="clear-all"]').addEventListener('click', button => {
        animateButtonPress(button.currentTarget);
        calculator.clearAll();
        calculator.updateDisplay();
    });

    // Toggle sign button
    document.querySelector('[data-action="toggle-sign"]').addEventListener('click', button => {
        animateButtonPress(button.currentTarget);
        calculator.toggleSign();
        calculator.updateDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        // Numbers
        if (/^[0-9.]$/.test(event.key)) {
            const button = document.querySelector(`[data-number="${event.key}"]`);
            if (button) {
                animateButtonPress(button);
                calculator.appendNumber(event.key);
                calculator.updateDisplay();
                animateDisplay();
            }
        }
        
        // Operations
        if (['+', '-', '*', '/'].includes(event.key)) {
            const button = document.querySelector(`[data-operation="${event.key}"]`);
            if (button) {
                animateButtonPress(button);
                calculator.chooseOperation(event.key);
                calculator.updateDisplay();
            }
        }
        
        // Equals / Enter
        if (event.key === '=' || event.key === 'Enter') {
            const button = document.querySelector('[data-action="calculate"]');
            animateButtonPress(button);
            calculator.calculate();
            calculator.updateDisplay();
            animateDisplay();
            event.preventDefault();
        }
        
        // Clear / Backspace
        if (event.key === 'Escape') {
            const button = document.querySelector('[data-action="clear-all"]');
            animateButtonPress(button);
            calculator.clearAll();
            calculator.updateDisplay();
        }
        
        if (event.key === 'Backspace') {
            const button = document.querySelector('[data-action="clear"]');
            animateButtonPress(button);
            calculator.clear();
            calculator.updateDisplay();
        }
    });

    // Initial animation on load
    const timeline = gsap.timeline();
    
    // Animate background shapes
    timeline.from('.shape', {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.7)'
    });
    
    // Animate calculator
    timeline.from('.calculator-container', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    }, "-=0.8");
    
    // Animate display
    timeline.from('.display-container', {
        scaleX: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, "-=0.4");
    
    // Animate buttons with staggered effect
    timeline.from('button', {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: {
            grid: [4, 5],
            from: 'center', 
            amount: 0.4
        },
        ease: 'back.out(1.7)'
    }, "-=0.2");
    
    // Add hover effect with GSAP
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power1.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: 'power1.in'
            });
        });
    });
}); 