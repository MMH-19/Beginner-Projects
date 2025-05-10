document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultContainer = document.getElementById('resultContainer');
    const tableBody = document.getElementById('tableBody');
    const chartContainer = document.getElementById('chartContainer');
    const bubbleChart = document.getElementById('bubbleChart');
    
    // Event listeners
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearAll);
    
    function analyzeText() {
        // Clear previous results
        clearResults();
        
        // Get the input text
        const text = textInput.value.trim();
        
        // Check if text is empty
        if (!text) {
            showError('Please enter some text to analyze.');
            return;
        }
        
        // Hide error message if it was previously shown
        errorMessage.classList.add('hidden');
        
        // Analyze the text
        const wordFrequency = calculateWordFrequency(text);
        
        // Display the results
        displayResults(wordFrequency);
        
        // Show the result container
        resultContainer.classList.remove('hidden');
        
        // Generate and display the bubble chart
        generateBubbleChart(wordFrequency);
    }
    
    function calculateWordFrequency(text) {
        // Convert to lowercase and replace all non-alphanumeric characters with spaces
        const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
        
        // Split the text into words
        const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
        
        // Count frequency of each word
        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        // Convert to array and sort by frequency (descending)
        const sortedFrequency = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1]);
            
        return sortedFrequency;
    }
    
    function displayResults(wordFrequency) {
        // Clear previous table data
        tableBody.innerHTML = '';
        
        // Create table rows for each word and its frequency
        wordFrequency.forEach(([word, frequency]) => {
            const row = document.createElement('tr');
            
            const wordCell = document.createElement('td');
            wordCell.textContent = word;
            
            const freqCell = document.createElement('td');
            freqCell.textContent = frequency;
            
            row.appendChild(wordCell);
            row.appendChild(freqCell);
            
            tableBody.appendChild(row);
        });
    }
    
    function generateBubbleChart(wordFrequency) {
        // Clear previous chart
        bubbleChart.innerHTML = '';
        
        // Show the chart container
        chartContainer.classList.remove('hidden');
        
        // Get the top 30 words (or fewer if there aren't that many)
        const topWords = wordFrequency.slice(0, Math.min(30, wordFrequency.length));
        
        // Find the maximum frequency to scale bubble sizes
        const maxFrequency = topWords.length > 0 ? topWords[0][1] : 0;
        
        // Generate bubbles for each word
        topWords.forEach(([word, frequency]) => {
            // Calculate bubble size based on frequency (between 30px and 100px)
            const size = 30 + (frequency / maxFrequency) * 70;
            
            // Create a bubble
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = word;
            
            // Generate a random color (biased toward more vibrant colors)
            const hue = Math.floor(Math.random() * 360);
            const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
            const lightness = 45 + Math.floor(Math.random() * 15);  // 45-60%
            
            bubble.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.fontSize = `${Math.max(10, size / 6)}px`;
            
            // Add a title attribute to show the frequency
            bubble.title = `${word}: ${frequency}`;
            
            bubbleChart.appendChild(bubble);
        });
    }
    
    function clearResults() {
        tableBody.innerHTML = '';
        bubbleChart.innerHTML = '';
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
        resultContainer.classList.add('hidden');
        chartContainer.classList.add('hidden');
    }
    
    function clearAll() {
        // Clear the input text
        textInput.value = '';
        
        // Clear results and error messages
        clearResults();
        
        // Focus on the input field
        textInput.focus();
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}); 