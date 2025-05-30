// Advanced Scientific Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const display = document.getElementById('display');
    const calculationHistory = document.getElementById('calculation-history');
    const buttons = document.querySelectorAll('.calc-btn');
    const operationIndicator = document.querySelector('.operation-indicator');
    
    // Calculator state
    let currentInput = '0';
    let currentCalculation = '';
    let isNewCalculation = true;
    let angleMode = 'rad'; // 'rad' or 'deg'
    let memory = 0;
    
    // Initialize calculator
    updateDisplay();
    
    // Setup button event listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Add button press animation
            button.classList.add('btn-press');
            setTimeout(() => {
                button.classList.remove('btn-press');
            }, 200);
            
            // Handle different button types
            if (button.hasAttribute('data-number')) {
                handleNumberInput(button.getAttribute('data-number'));
            } else if (button.hasAttribute('data-operation')) {
                handleOperation(button.getAttribute('data-operation'));
                operationIndicator.classList.add('operation-active');
            } else if (button.hasAttribute('data-equals')) {
                calculateResult();
                operationIndicator.classList.remove('operation-active');
            } else if (button.hasAttribute('data-decimal')) {
                handleDecimal();
            } else if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
                if (action === 'clear') clearCalculator();
                if (action === 'toggle-sign') toggleSign();
                if (action === 'percent') calculatePercent();
            } else if (button.hasAttribute('data-function')) {
                handleFunction(button.getAttribute('data-function'));
            } else if (button.hasAttribute('data-constant')) {
                handleConstant(button.getAttribute('data-constant'));
            } else if (button.hasAttribute('data-parenthesis')) {
                handleParenthesis(button.getAttribute('data-parenthesis'));
            } else if (button.hasAttribute('data-memory')) {
                handleMemory(button.getAttribute('data-memory'));
            } else if (button.hasAttribute('data-bit-op')) {
                handleBitOperation(button.getAttribute('data-bit-op'));
            } else if (button.hasAttribute('data-hex')) {
                handleHexInput(button.getAttribute('data-hex'));
            } else if (button.hasAttribute('data-number-base')) {
                handleNumberBaseChange(button.getAttribute('data-number-base'));
            }
        });
    });
    
    // Set up tab switching
    const setupTabs = () => {
        const basicPanel = document.getElementById('basic-panel');
        const scientificPanel = document.getElementById('scientific-panel');
        const programmerPanel = document.getElementById('programmer-panel');
        const tabBasic = document.getElementById('tab-basic');
        const tabScientific = document.getElementById('tab-scientific');
        const tabProgrammer = document.getElementById('tab-programmer');
        
        tabBasic.addEventListener('click', function() {
            basicPanel.classList.remove('hidden');
            scientificPanel.classList.add('hidden');
            programmerPanel.classList.add('hidden');
            
            tabBasic.classList.add('bg-blue-700', 'tab-active');
            tabBasic.classList.remove('bg-gray-700');
            
            tabScientific.classList.add('bg-gray-700');
            tabScientific.classList.remove('bg-blue-700', 'tab-active');
            
            tabProgrammer.classList.add('bg-gray-700');
            tabProgrammer.classList.remove('bg-blue-700', 'tab-active');
        });
        
        tabScientific.addEventListener('click', function() {
            basicPanel.classList.add('hidden');
            scientificPanel.classList.remove('hidden');
            programmerPanel.classList.add('hidden');
            
            tabBasic.classList.add('bg-gray-700');
            tabBasic.classList.remove('bg-blue-700', 'tab-active');
            
            tabScientific.classList.add('bg-blue-700', 'tab-active');
            tabScientific.classList.remove('bg-gray-700');
            
            tabProgrammer.classList.add('bg-gray-700');
            tabProgrammer.classList.remove('bg-blue-700', 'tab-active');
        });
        
        tabProgrammer.addEventListener('click', function() {
            basicPanel.classList.add('hidden');
            scientificPanel.classList.add('hidden');
            programmerPanel.classList.remove('hidden');
            
            tabBasic.classList.add('bg-gray-700');
            tabBasic.classList.remove('bg-blue-700', 'tab-active');
            
            tabScientific.classList.add('bg-gray-700');
            tabScientific.classList.remove('bg-blue-700', 'tab-active');
            
            tabProgrammer.classList.add('bg-blue-700', 'tab-active');
            tabProgrammer.classList.remove('bg-gray-700');
        });
    };
    
    // Toggle angle mode (radians/degrees)
    const angleToggle = document.getElementById('angle-toggle');
    if (angleToggle) {
        angleToggle.addEventListener('change', function() {
            const toggleDot = document.getElementById('toggle-dot');
            if (this.checked) {
                angleMode = 'deg';
                toggleDot.classList.add('translate-x-6');
            } else {
                angleMode = 'rad';
                toggleDot.classList.remove('translate-x-6');
            }
        });
    }
    
    // Toggle history panel
    const historyPanel = document.querySelector('.history-panel');
    const toggleHistoryBtn = document.getElementById('toggle-history');
    if (toggleHistoryBtn && historyPanel) {
        toggleHistoryBtn.addEventListener('click', function() {
            historyPanel.classList.toggle('hidden');
            if (historyPanel.classList.contains('hidden')) {
                toggleHistoryBtn.innerHTML = '<i class="fas fa-history mr-1"></i> Show History';
            } else {
                toggleHistoryBtn.innerHTML = '<i class="fas fa-times mr-1"></i> Hide History';
            }
        });
    }
    
    // Keyboard shortcuts
    const keyboardHelpBtn = document.getElementById('keyboard-help-btn');
    const keyboardShortcuts = document.getElementById('keyboard-shortcuts');
    const closeShortcuts = document.getElementById('close-shortcuts');
    
    if (keyboardHelpBtn && keyboardShortcuts && closeShortcuts) {
        keyboardHelpBtn.addEventListener('click', function() {
            keyboardShortcuts.style.display = 'block';
        });
        
        closeShortcuts.addEventListener('click', function() {
            keyboardShortcuts.style.display = 'none';
        });
    }
    
    // Calculator Functions
    function handleNumberInput(number) {
        if (isNewCalculation) {
            currentInput = number;
            isNewCalculation = false;
        } else {
            if (currentInput === '0' && number !== '0' && !currentInput.includes('.')) {
                currentInput = number;
            } else {
                currentInput += number;
            }
        }
        updateDisplay();
    }
    
    function handleDecimal() {
        if (isNewCalculation) {
            currentInput = '0.';
            isNewCalculation = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }
    
    function handleOperation(operation) {
        if (currentCalculation === '') {
            currentCalculation = currentInput + ' ' + operation + ' ';
        } else {
            if (isNewCalculation) {
                currentCalculation = currentInput + ' ' + operation + ' ';
            } else {
                currentCalculation += currentInput + ' ' + operation + ' ';
                calculateIntermediateResult();
            }
        }
        isNewCalculation = true;
        updateDisplay();
    }
    
    function calculateResult() {
        if (currentCalculation !== '') {
            let calculation = currentCalculation + currentInput;
            
            try {
                // Replace visual operators with JavaScript operators
                let evalStr = calculation.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                
                // Handle power operations
                evalStr = evalStr.replace(/(\d+(\.\d+)?|\)) \^ (\d+(\.\d+)?|\()/g, function(match) {
                    const parts = match.split(' ^ ');
                    return `Math.pow(${parts[0]}, ${parts[1]})`;
                });
                
                // Calculate result
                const result = Function(`'use strict'; return (${evalStr})`)();
                
                // Format and update
                currentInput = formatResult(result);
                
                // Add to history
                addHistoryEntry(calculation, currentInput);
                
                currentCalculation = '';
                isNewCalculation = true;
            } catch (error) {
                currentInput = 'Error';
                isNewCalculation = true;
            }
            
            updateDisplay();
        }
    }
    
    function calculateIntermediateResult() {
        try {
            // Replace visual operators with JavaScript operators
            let evalStr = currentCalculation.trim().replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            
            // Handle power operations
            evalStr = evalStr.replace(/(\d+(\.\d+)?|\)) \^ (\d+(\.\d+)?|\()/g, function(match) {
                const parts = match.split(' ^ ');
                return `Math.pow(${parts[0]}, ${parts[1]})`;
            });
            
            // Remove trailing operator
            evalStr = evalStr.replace(/[\+\-\*\/\^]\s*$/, '');
            
            // Calculate result
            const result = Function(`'use strict'; return (${evalStr})`)();
            
            // Update display
            currentInput = formatResult(result);
        } catch (e) {
            // If calculation fails, just continue with current input
        }
    }
    
    function clearCalculator() {
        currentInput = '0';
        currentCalculation = '';
        isNewCalculation = true;
        updateDisplay();
        
        // Reset operation indicator
        if (operationIndicator) {
            operationIndicator.classList.remove('operation-active');
        }
    }
    
    function toggleSign() {
        if (currentInput !== '0') {
            if (currentInput.startsWith('-')) {
                currentInput = currentInput.substring(1);
            } else {
                currentInput = '-' + currentInput;
            }
            updateDisplay();
        }
    }
    
    function calculatePercent() {
        const value = parseFloat(currentInput);
        currentInput = formatResult(value / 100);
        updateDisplay();
    }
    
    function handleFunction(func) {
        const value = parseFloat(currentInput);
        let result;
        
        switch(func) {
            case 'sin':
                result = angleMode === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
                break;
            case 'cos':
                result = angleMode === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
                break;
            case 'tan':
                result = angleMode === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
                break;
            case 'asin':
                result = Math.asin(value);
                if (angleMode === 'deg') result = result * 180 / Math.PI;
                break;
            case 'acos':
                result = Math.acos(value);
                if (angleMode === 'deg') result = result * 180 / Math.PI;
                break;
            case 'atan':
                result = Math.atan(value);
                if (angleMode === 'deg') result = result * 180 / Math.PI;
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'factorial':
                result = factorial(value);
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            default:
                result = value;
        }
        
        currentInput = formatResult(result);
        isNewCalculation = true;
        updateDisplay();
    }
    
    function handleConstant(constant) {
        switch(constant) {
            case 'pi':
                currentInput = Math.PI.toString();
                break;
            case 'e':
                currentInput = Math.E.toString();
                break;
        }
        isNewCalculation = true;
        updateDisplay();
    }
    
    function handleParenthesis(parenthesis) {
        if (isNewCalculation) {
            currentInput = '0';
            isNewCalculation = false;
        }
        
        if (parenthesis === '(') {
            currentCalculation += '( ';
        } else {
            currentCalculation += currentInput + ' ) ';
            isNewCalculation = true;
        }
        
        updateDisplay();
    }
    
    function handleMemory(action) {
        switch(action) {
            case 'mc':
                memory = 0;
                break;
            case 'mr':
                currentInput = memory.toString();
                isNewCalculation = true;
                break;
            case 'm+':
                memory += parseFloat(currentInput);
                isNewCalculation = true;
                break;
            case 'm-':
                memory -= parseFloat(currentInput);
                isNewCalculation = true;
                break;
        }
        updateDisplay();
    }
    
    function handleBitOperation(operation) {
        // Basic implementation (can be expanded)
        const value = parseInt(currentInput);
        let result;
        
        switch(operation) {
            case 'AND':
                if (currentCalculation.includes('AND')) {
                    const leftValue = parseInt(currentCalculation.split('AND')[0].trim());
                    result = leftValue & value;
                } else {
                    currentCalculation = currentInput + ' AND ';
                    isNewCalculation = true;
                    updateDisplay();
                    return;
                }
                break;
            case 'OR':
                if (currentCalculation.includes('OR')) {
                    const leftValue = parseInt(currentCalculation.split('OR')[0].trim());
                    result = leftValue | value;
                } else {
                    currentCalculation = currentInput + ' OR ';
                    isNewCalculation = true;
                    updateDisplay();
                    return;
                }
                break;
            case 'XOR':
                if (currentCalculation.includes('XOR')) {
                    const leftValue = parseInt(currentCalculation.split('XOR')[0].trim());
                    result = leftValue ^ value;
                } else {
                    currentCalculation = currentInput + ' XOR ';
                    isNewCalculation = true;
                    updateDisplay();
                    return;
                }
                break;
            case 'NOT':
                result = ~value;
                break;
            case 'LSHIFT':
                if (currentCalculation.includes('<<')) {
                    const leftValue = parseInt(currentCalculation.split('<<')[0].trim());
                    result = leftValue << value;
                } else {
                    currentCalculation = currentInput + ' << ';
                    isNewCalculation = true;
                    updateDisplay();
                    return;
                }
                break;
            case 'RSHIFT':
                if (currentCalculation.includes('>>')) {
                    const leftValue = parseInt(currentCalculation.split('>>')[0].trim());
                    result = leftValue >> value;
                } else {
                    currentCalculation = currentInput + ' >> ';
                    isNewCalculation = true;
                    updateDisplay();
                    return;
                }
                break;
            case 'MOD':
                if (currentCalculation.includes('MOD')) {
                    const leftValue = parseInt(currentCalculation.split('MOD')[0].trim());
                    result = leftValue % value;
                } else {
                    currentCalculation = currentInput + ' MOD ';
                    isNewCalculation = true;
                    updateDisplay();
                    return;
                }
                break;
        }
        
        currentInput = result.toString();
        currentCalculation = '';
        isNewCalculation = true;
        updateDisplay();
    }
    
    function handleHexInput(hex) {
        if (isNewCalculation) {
            currentInput = hex;
            isNewCalculation = false;
        } else {
            if (currentInput === '0') {
                currentInput = hex;
            } else {
                currentInput += hex;
            }
        }
        updateDisplay();
    }
    
    function handleNumberBaseChange(base) {
        // Simplified implementation
        if (currentInput === '0' || currentInput === 'Error') return;
        
        const value = parseInt(currentInput);
        
        switch(base) {
            case 'HEX':
                currentInput = value.toString(16).toUpperCase();
                break;
            case 'DEC':
                currentInput = value.toString(10);
                break;
            case 'OCT':
                currentInput = value.toString(8);
                break;
            case 'BIN':
                currentInput = value.toString(2);
                break;
        }
        
        updateDisplay();
    }
    
    // Helper functions
    function updateDisplay() {
        if (display) {
            display.textContent = currentInput;
            
            // Animation effect
            display.classList.add('number-updated');
            setTimeout(() => {
                display.classList.remove('number-updated');
            }, 300);
        }
        
        if (calculationHistory) {
            calculationHistory.textContent = currentCalculation;
        }
    }
    
    function formatResult(result) {
        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        }
        
        // Limit decimal places for readability
        if (Math.abs(result) < 1e-10) return '0';
        
        if (result.toString().includes('.')) {
            const maxDecimals = 10;
            const parts = result.toString().split('.');
            if (parts[1].length > maxDecimals) {
                return result.toFixed(maxDecimals);
            }
        }
        
        return result.toString();
    }
    
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    function addHistoryEntry(calculation, result) {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        const entry = document.createElement('div');
        entry.className = 'history-entry py-1 border-b border-gray-700';
        entry.innerHTML = `
            <div class="flex justify-between">
                <span>${calculation}</span>
                <span class="font-bold">${result}</span>
            </div>
        `;
        historyList.prepend(entry);
    }
    
    // Initialize functionality
    setupTabs();
    
    // Add sample history entries
    addHistoryEntry('2 + 2', '4');
    addHistoryEntry('sin(45°)', '0.7071');
    addHistoryEntry('10 × 5', '50');
});
