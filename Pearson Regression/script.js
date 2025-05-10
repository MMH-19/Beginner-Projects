document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const xValueInput = document.getElementById('x-value');
    const yValueInput = document.getElementById('y-value');
    const addButton = document.getElementById('add-button');
    const calculateButton = document.getElementById('calculate-button');
    const clearButton = document.getElementById('clear-button');
    const errorMessage = document.getElementById('error-message');
    const dataBody = document.getElementById('data-body');
    const resultsContainer = document.getElementById('results-container');
    const scatterPlotContainer = document.getElementById('scatter-plot-container');
    const scatterPlot = document.getElementById('scatter-plot');

    // Results elements
    const xMeanElement = document.getElementById('x-mean');
    const yMeanElement = document.getElementById('y-mean');
    const xStdElement = document.getElementById('x-std');
    const yStdElement = document.getElementById('y-std');
    const correlationElement = document.getElementById('correlation');
    const interpretationElement = document.getElementById('interpretation');

    // Data storage
    let data = [];

    // Event listeners
    addButton.addEventListener('click', addDataPoint);
    calculateButton.addEventListener('click', calculateResults);
    clearButton.addEventListener('click', clearAllData);
    xValueInput.addEventListener('input', validateInputs);
    yValueInput.addEventListener('input', validateInputs);

    // Add data point
    function addDataPoint() {
        const xValue = parseFloat(xValueInput.value);
        const yValue = parseFloat(yValueInput.value);

        if (isNaN(xValue) || isNaN(yValue)) {
            showError('Please enter valid numeric values for X and Y.');
            return;
        }

        hideError();
        
        // Add to data array
        const dataPoint = { x: xValue, y: yValue };
        data.push(dataPoint);
        
        // Add to table
        addToTable(dataPoint, data.length - 1);
        
        // Clear inputs
        xValueInput.value = '';
        yValueInput.value = '';
        
        // Enable calculate button if we have at least 2 data points
        calculateButton.disabled = data.length < 2;
    }

    // Add data to table
    function addToTable(dataPoint, index) {
        const row = document.createElement('tr');
        
        const xCell = document.createElement('td');
        xCell.textContent = dataPoint.x;
        
        const yCell = document.createElement('td');
        yCell.textContent = dataPoint.y;
        
        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => {
            deleteDataPoint(index);
        });
        
        actionCell.appendChild(deleteButton);
        
        row.appendChild(xCell);
        row.appendChild(yCell);
        row.appendChild(actionCell);
        
        row.dataset.index = index;
        dataBody.appendChild(row);
    }

    // Delete data point
    function deleteDataPoint(index) {
        data.splice(index, 1);
        refreshTable();
        calculateButton.disabled = data.length < 2;
        
        // Hide results if there's not enough data
        if (data.length < 2) {
            resultsContainer.classList.add('hidden');
            scatterPlotContainer.classList.add('hidden');
        }
    }

    // Refresh the data table
    function refreshTable() {
        dataBody.innerHTML = '';
        data.forEach((point, index) => {
            addToTable(point, index);
        });
    }

    // Clear all data
    function clearAllData() {
        data = [];
        dataBody.innerHTML = '';
        calculateButton.disabled = true;
        resultsContainer.classList.add('hidden');
        scatterPlotContainer.classList.add('hidden');
    }

    // Validate inputs
    function validateInputs() {
        const xValue = xValueInput.value.trim();
        const yValue = yValueInput.value.trim();
        
        if (xValue === '' || yValue === '') {
            return;
        }
        
        const xNum = parseFloat(xValue);
        const yNum = parseFloat(yValue);
        
        if (isNaN(xNum) || isNaN(yNum)) {
            showError('Please enter valid numeric values.');
        } else {
            hideError();
        }
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Hide error message
    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Calculate statistical results
    function calculateResults() {
        if (data.length < 2) {
            showError('Need at least 2 data points to calculate correlation.');
            return;
        }
        
        // Extract X and Y arrays
        const xValues = data.map(point => point.x);
        const yValues = data.map(point => point.y);
        
        // Calculate means
        const xMean = calculateMean(xValues);
        const yMean = calculateMean(yValues);
        
        // Calculate standard deviations
        const xStd = calculateStandardDeviation(xValues, xMean);
        const yStd = calculateStandardDeviation(yValues, yMean);
        
        // Calculate Pearson correlation coefficient
        const pearsonCorrelation = calculatePearsonCorrelation(xValues, yValues, xMean, yMean, xStd, yStd);
        
        // Determine interpretation
        const interpretation = interpretCorrelation(pearsonCorrelation);
        
        // Update results
        xMeanElement.textContent = xMean.toFixed(4);
        yMeanElement.textContent = yMean.toFixed(4);
        xStdElement.textContent = xStd.toFixed(4);
        yStdElement.textContent = yStd.toFixed(4);
        correlationElement.textContent = pearsonCorrelation.toFixed(4);
        interpretationElement.textContent = interpretation;
        
        // Show results
        resultsContainer.classList.remove('hidden');
        
        // Draw scatter plot
        drawScatterPlot(xValues, yValues, pearsonCorrelation, xMean, yMean);
    }

    // Calculate mean
    function calculateMean(values) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    // Calculate standard deviation
    function calculateStandardDeviation(values, mean) {
        const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
        const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / values.length;
        return Math.sqrt(variance);
    }

    // Calculate Pearson correlation coefficient
    function calculatePearsonCorrelation(xValues, yValues, xMean, yMean, xStd, yStd) {
        let numerator = 0;
        
        for (let i = 0; i < xValues.length; i++) {
            numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        }
        
        const denominator = xStd * yStd * xValues.length;
        
        if (denominator === 0) {
            return 0; // Avoiding division by zero
        }
        
        return numerator / denominator;
    }

    // Interpret correlation coefficient
    function interpretCorrelation(correlation) {
        const absCorrelation = Math.abs(correlation);
        
        if (absCorrelation < 0.3) {
            return 'No correlation';
        } else if (absCorrelation < 0.5) {
            return 'Weak correlation';
        } else if (absCorrelation < 0.7) {
            return 'Moderate correlation';
        } else if (absCorrelation < 0.9) {
            return 'Strong correlation';
        } else {
            return 'Very strong correlation';
        }
    }

    // Draw scatter plot
    function drawScatterPlot(xValues, yValues, correlation, xMean, yMean) {
        const ctx = scatterPlot.getContext('2d');
        const width = scatterPlot.width;
        const height = scatterPlot.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Find min and max values for scaling
        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);
        
        // Add some margin
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        const xMargin = xRange * 0.1;
        const yMargin = yRange * 0.1;
        
        const scaledXMin = xMin - xMargin;
        const scaledXMax = xMax + xMargin;
        const scaledYMin = yMin - yMargin;
        const scaledYMax = yMax + yMargin;
        
        // Function to scale X coordinate to canvas
        const scaleX = (x) => {
            return 50 + ((x - scaledXMin) / (scaledXMax - scaledXMin)) * (width - 100);
        };
        
        // Function to scale Y coordinate to canvas (inverted because canvas Y is top to bottom)
        const scaleY = (y) => {
            return height - 50 - ((y - scaledYMin) / (scaledYMax - scaledYMin)) * (height - 100);
        };
        
        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width - 50, height - 50);
        
        // Y-axis
        ctx.moveTo(50, 50);
        ctx.lineTo(50, height - 50);
        
        ctx.stroke();
        
        // Draw labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        
        // X-axis labels
        ctx.fillText(scaledXMin.toFixed(1), 50, height - 30);
        ctx.fillText(scaledXMax.toFixed(1), width - 60, height - 30);
        ctx.fillText('X', width - 30, height - 30);
        
        // Y-axis labels
        ctx.fillText(scaledYMin.toFixed(1), 20, height - 50);
        ctx.fillText(scaledYMax.toFixed(1), 20, 60);
        ctx.fillText('Y', 20, 30);
        
        // Draw data points
        ctx.fillStyle = '#3498db';
        
        for (let i = 0; i < xValues.length; i++) {
            const x = scaleX(xValues[i]);
            const y = scaleY(yValues[i]);
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw regression line if correlation is significant
        if (Math.abs(correlation) > 0.1) {
            // Calculate slope and intercept using means
            const xStd = calculateStandardDeviation(xValues, xMean);
            const yStd = calculateStandardDeviation(yValues, yMean);
            const slope = correlation * (yStd / xStd);
            const intercept = yMean - slope * xMean;
            
            // Calculate line endpoints
            const x1 = scaledXMin;
            const y1 = slope * x1 + intercept;
            const x2 = scaledXMax;
            const y2 = slope * x2 + intercept;
            
            // Draw the line
            ctx.beginPath();
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.moveTo(scaleX(x1), scaleY(y1));
            ctx.lineTo(scaleX(x2), scaleY(y2));
            ctx.stroke();
        }
        
        // Show the plot
        scatterPlotContainer.classList.remove('hidden');
    }
}); 