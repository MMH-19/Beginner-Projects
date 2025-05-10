document.addEventListener('DOMContentLoaded', () => {
    const dollarInput = document.getElementById('dollarAmount');
    const convertBtn = document.getElementById('convertBtn');
    const totalCentsElement = document.getElementById('totalCents');
    const quartersElement = document.getElementById('quarters');
    const dimesElement = document.getElementById('dimes');
    const nickelsElement = document.getElementById('nickels');
    const penniesElement = document.getElementById('pennies');
    const resultsSection = document.querySelector('.results');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // Theme Toggle Functionality
    function setTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme(true);
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        setTheme(!isDarkTheme);
        
        // Add rotation animation
        themeToggle.classList.add('rotate');
        setTimeout(() => {
            themeToggle.classList.remove('rotate');
        }, 500);
    });

    // Ensure we handle floating point precision issues
    function roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }

    // Convert dollar amount to total cents
    function convertToCents(dollarAmount) {
        // Multiply by 100 and round to handle floating point precision issues
        return Math.round(dollarAmount * 100);
    }

    // Calculate the minimum number of coins needed
    function calculateCoins(cents) {
        const coins = {
            quarters: 0,
            dimes: 0,
            nickels: 0,
            pennies: 0
        };

        // Calculate quarters (25¢)
        coins.quarters = Math.floor(cents / 25);
        cents = cents % 25;

        // Calculate dimes (10¢)
        coins.dimes = Math.floor(cents / 10);
        cents = cents % 10;

        // Calculate nickels (5¢)
        coins.nickels = Math.floor(cents / 5);
        cents = cents % 5;

        // Remaining cents are pennies (1¢)
        coins.pennies = cents;

        return coins;
    }

    // Add animation to number elements
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    // Update the UI with results
    function updateResults(totalCents, coins) {
        // First hide results to prepare for animation
        resultsSection.classList.remove('show');
        
        // Use setTimeout to create a slight delay before showing results
        setTimeout(() => {
            // Update values
            totalCentsElement.textContent = '0';
            quartersElement.textContent = '0';
            dimesElement.textContent = '0';
            nickelsElement.textContent = '0';
            penniesElement.textContent = '0';
            
            // Show results section
            resultsSection.classList.add('show');
            
            // Animate counting up the values
            animateValue(totalCentsElement, 0, totalCents, 1000);
            animateValue(quartersElement, 0, coins.quarters, 800);
            animateValue(dimesElement, 0, coins.dimes, 800);
            animateValue(nickelsElement, 0, coins.nickels, 800);
            animateValue(penniesElement, 0, coins.pennies, 800);
        }, 300);
    }

    // Handle the conversion when the button is clicked
    convertBtn.addEventListener('click', () => {
        const dollarValue = parseFloat(dollarInput.value);
        
        // Validate input
        if (isNaN(dollarValue) || dollarValue < 0) {
            alert('Please enter a valid dollar amount');
            return;
        }

        // Add button animation
        convertBtn.classList.add('processing');
        
        // Round to two decimal places to handle potential input like 1.999
        const roundedDollarValue = roundToTwoDecimals(dollarValue);
        
        // Simulate processing delay for better UX
        setTimeout(() => {
            // Convert to cents
            const totalCents = convertToCents(roundedDollarValue);
            
            // Calculate coins
            const coins = calculateCoins(totalCents);
            
            // Update UI
            updateResults(totalCents, coins);
            
            // Remove button animation
            convertBtn.classList.remove('processing');
        }, 400);
    });

    // Allow pressing Enter to trigger conversion
    dollarInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
    
    // Initialize - make sure results section is hidden on load
    resultsSection.classList.remove('show');
}); 