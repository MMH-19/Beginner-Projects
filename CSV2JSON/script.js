document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const csvInput = document.getElementById('csvInput');
    const jsonInput = document.getElementById('jsonInput');
    const csvMessage = document.getElementById('csvMessage');
    const jsonMessage = document.getElementById('jsonMessage');
    const convertToJsonBtn = document.getElementById('convertToJsonBtn');
    const convertToCsvBtn = document.getElementById('convertToCsvBtn');
    const clearBtn = document.getElementById('clearBtn');
    const csvFilePath = document.getElementById('csvFilePath');
    const jsonFilePath = document.getElementById('jsonFilePath');
    const openCsvBtn = document.getElementById('openCsvBtn');
    const saveCsvBtn = document.getElementById('saveCsvBtn');
    const openJsonBtn = document.getElementById('openJsonBtn');
    const saveJsonBtn = document.getElementById('saveJsonBtn');
    const csvContainer = document.getElementById('csvContainer');
    const jsonContainer = document.getElementById('jsonContainer');
    const themeToggle = document.getElementById('themeToggle');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Setup theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }

    // Setup drag and drop for CSV
    setupDragAndDrop(csvContainer, csvInput, csvMessage, 'csv');
    
    // Setup drag and drop for JSON
    setupDragAndDrop(jsonContainer, jsonInput, jsonMessage, 'json');

    // Convert CSV to JSON
    convertToJsonBtn.addEventListener('click', () => {
        const csv = csvInput.value.trim();
        
        // Validate CSV input
        if (!csv) {
            showMessage(csvMessage, 'Please enter CSV data');
            return;
        }

        // Show loading
        showLoading();

        // Use setTimeout to allow the UI to update before processing
        setTimeout(() => {
            try {
                // Add ripple effect to button
                addRippleEffect(convertToJsonBtn);
                
                const jsonOutput = csvToJson(csv);
                jsonInput.value = JSON.stringify(jsonOutput, null, 2);
                clearMessage(csvMessage);
                clearMessage(jsonMessage);
                
                // Show success animation
                showMessage(jsonMessage, 'Conversion successful!', 'success');
                setTimeout(() => clearMessage(jsonMessage), 3000);
            } catch (error) {
                showMessage(csvMessage, `Invalid CSV: ${error.message}`);
            } finally {
                // Hide loading
                hideLoading();
            }
        }, 500);
    });

    // Convert JSON to CSV
    convertToCsvBtn.addEventListener('click', () => {
        const json = jsonInput.value.trim();
        
        // Validate JSON input
        if (!json) {
            showMessage(jsonMessage, 'Please enter JSON data');
            return;
        }

        // Show loading
        showLoading();

        // Use setTimeout to allow the UI to update before processing
        setTimeout(() => {
            try {
                // Add ripple effect to button
                addRippleEffect(convertToCsvBtn);
                
                const jsonData = JSON.parse(json);
                const csvOutput = jsonToCsv(jsonData);
                csvInput.value = csvOutput;
                clearMessage(csvMessage);
                clearMessage(jsonMessage);
                
                // Show success animation
                showMessage(csvMessage, 'Conversion successful!', 'success');
                setTimeout(() => clearMessage(csvMessage), 3000);
            } catch (error) {
                showMessage(jsonMessage, `Invalid JSON: ${error.message}`);
            } finally {
                // Hide loading
                hideLoading();
            }
        }, 500);
    });

    // Clear both input fields and messages
    clearBtn.addEventListener('click', () => {
        // Add ripple effect to button
        addRippleEffect(clearBtn);
        
        csvInput.value = '';
        jsonInput.value = '';
        csvFilePath.value = '';
        jsonFilePath.value = '';
        clearMessage(csvMessage);
        clearMessage(jsonMessage);
    });

    // File operations for CSV
    openCsvBtn.addEventListener('click', () => {
        const filePath = csvFilePath.value.trim();
        if (!filePath) {
            showMessage(csvMessage, 'Please enter a file path');
            return;
        }
        
        // Add ripple effect to button
        addRippleEffect(openCsvBtn);
        
        // Show loading
        showLoading();
        
        openFile(filePath)
            .then(content => {
                csvInput.value = content;
                clearMessage(csvMessage);
            })
            .catch(error => {
                showMessage(csvMessage, `Error opening file: ${error.message}`);
            })
            .finally(() => {
                hideLoading();
            });
    });

    saveCsvBtn.addEventListener('click', () => {
        const filePath = csvFilePath.value.trim();
        const content = csvInput.value.trim();
        
        if (!filePath) {
            showMessage(csvMessage, 'Please enter a file path');
            return;
        }
        
        if (!content) {
            showMessage(csvMessage, 'No CSV data to save');
            return;
        }
        
        // Add ripple effect to button
        addRippleEffect(saveCsvBtn);
        
        // Show loading
        showLoading();
        
        saveFile(filePath, content)
            .then(() => {
                showMessage(csvMessage, 'File saved successfully', 'success');
                setTimeout(() => clearMessage(csvMessage), 3000);
            })
            .catch(error => {
                showMessage(csvMessage, `Error saving file: ${error.message}`);
            })
            .finally(() => {
                hideLoading();
            });
    });

    // File operations for JSON
    openJsonBtn.addEventListener('click', () => {
        const filePath = jsonFilePath.value.trim();
        if (!filePath) {
            showMessage(jsonMessage, 'Please enter a file path');
            return;
        }
        
        // Add ripple effect to button
        addRippleEffect(openJsonBtn);
        
        // Show loading
        showLoading();
        
        openFile(filePath)
            .then(content => {
                jsonInput.value = content;
                clearMessage(jsonMessage);
            })
            .catch(error => {
                showMessage(jsonMessage, `Error opening file: ${error.message}`);
            })
            .finally(() => {
                hideLoading();
            });
    });

    saveJsonBtn.addEventListener('click', () => {
        const filePath = jsonFilePath.value.trim();
        const content = jsonInput.value.trim();
        
        if (!filePath) {
            showMessage(jsonMessage, 'Please enter a file path');
            return;
        }
        
        if (!content) {
            showMessage(jsonMessage, 'No JSON data to save');
            return;
        }
        
        // Add ripple effect to button
        addRippleEffect(saveJsonBtn);
        
        // Show loading
        showLoading();
        
        saveFile(filePath, content)
            .then(() => {
                showMessage(jsonMessage, 'File saved successfully', 'success');
                setTimeout(() => clearMessage(jsonMessage), 3000);
            })
            .catch(error => {
                showMessage(jsonMessage, `Error saving file: ${error.message}`);
            })
            .finally(() => {
                hideLoading();
            });
    });

    // Helper Functions
    function csvToJson(csv) {
        // Split the CSV into lines
        const lines = csv.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length === 0) {
            throw new Error('CSV is empty');
        }
        
        // Extract headers from the first line
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Process data rows
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(',');
            
            // Skip empty lines
            if (data.length === 1 && data[0] === '') continue;
            
            // Make sure we have the right number of fields
            if (data.length !== headers.length) {
                throw new Error(`Line ${i+1} has ${data.length} fields, expected ${headers.length}`);
            }
            
            const obj = {};
            headers.forEach((header, index) => {
                // Try to parse numbers and booleans
                let value = data[index].trim();
                
                // Handle quoted values
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                
                // Try to convert to appropriate type
                if (value.toLowerCase() === 'true') {
                    obj[header] = true;
                } else if (value.toLowerCase() === 'false') {
                    obj[header] = false;
                } else if (!isNaN(value) && value !== '') {
                    obj[header] = Number(value);
                } else {
                    obj[header] = value;
                }
            });
            
            result.push(obj);
        }
        
        return result;
    }

    function jsonToCsv(jsonData) {
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            throw new Error('JSON must be an array of objects');
        }
        
        // Extract headers from the first object
        const headers = Object.keys(jsonData[0]);
        
        // Create CSV header row
        let csv = headers.join(',') + '\n';
        
        // Add data rows
        jsonData.forEach(item => {
            const row = headers.map(header => {
                const value = item[header];
                
                // Format based on data type
                if (value === null || value === undefined) {
                    return '';
                } else if (typeof value === 'string') {
                    // Quote strings that contain commas
                    return value.includes(',') ? `"${value}"` : value;
                } else {
                    return String(value);
                }
            });
            
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    // Utility functions for messages
    function showMessage(element, message, type = 'error') {
        element.textContent = message;
        element.style.color = type === 'error' ? 'var(--danger-color)' : 'var(--success-color)';
        element.classList.add('fade-message');
        
        // Remove the class after animation completes
        setTimeout(() => {
            element.classList.remove('fade-message');
        }, 3000);
    }

    function clearMessage(element) {
        element.textContent = '';
        element.classList.remove('fade-message');
    }

    // File operations (simulated for web environment)
    function openFile(filePath) {
        // In a real application, this would use Node.js fs module or other file APIs
        // For this example, we'll simulate file operations
        return new Promise((resolve, reject) => {
            // For demo purposes, simulate file reading
            // In a real application, you'd use actual file I/O
            const fileExtension = filePath.split('.').pop().toLowerCase();
            
            if (!['csv', 'json'].includes(fileExtension)) {
                reject(new Error('Unsupported file extension'));
                return;
            }
            
            // Simulate network delay
            setTimeout(() => {
                if (Math.random() > 0.9) {
                    // Simulate a "file not found" error occasionally
                    reject(new Error('File not found'));
                    return;
                }
                
                // Mock data for demonstration
                if (fileExtension === 'csv') {
                    resolve('name,age,city\nJohn,30,New York\nAlice,25,Boston\nBob,35,Chicago');
                } else {
                    resolve('[\n  {\n    "name": "John",\n    "age": 30,\n    "city": "New York"\n  },\n  {\n    "name": "Alice",\n    "age": 25,\n    "city": "Boston"\n  },\n  {\n    "name": "Bob",\n    "age": 35,\n    "city": "Chicago"\n  }\n]');
                }
            }, 1000);
        });
    }

    function saveFile(filePath, content) {
        // In a real application, this would use Node.js fs module or other file APIs
        // For this example, we'll use browser's download capability
        return new Promise((resolve, reject) => {
            try {
                // Simulate network delay
                setTimeout(() => {
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = filePath.split('/').pop();
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    resolve();
                }, 1000);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Drag and drop functionality
    function setupDragAndDrop(container, textArea, messageElement, fileType) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        container.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            container.classList.add('drag-over');
        }

        function unhighlight() {
            container.classList.remove('drag-over');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length === 0) {
                showMessage(messageElement, 'No file was dropped');
                return;
            }

            const file = files[0];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Validate file type
            if (fileType === 'csv' && fileExtension !== 'csv') {
                showMessage(messageElement, 'Please drop a CSV file');
                return;
            } else if (fileType === 'json' && fileExtension !== 'json') {
                showMessage(messageElement, 'Please drop a JSON file');
                return;
            }

            // Show loading
            showLoading();

            // Read file content
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = function(e) {
                const content = e.target.result;
                textArea.value = content;
                clearMessage(messageElement);
                
                // Update file path input
                if (fileType === 'csv') {
                    csvFilePath.value = file.name;
                } else {
                    jsonFilePath.value = file.name;
                }
                
                // Hide loading after a short delay for UX
                setTimeout(hideLoading, 300);
            };

            reader.onerror = function() {
                showMessage(messageElement, 'Error reading file');
                hideLoading();
            };
        }
    }
    
    // Loading overlay functions
    function showLoading() {
        loadingOverlay.classList.add('active');
    }
    
    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }
    
    // Theme toggle function
    function toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        }
    }
    
    // Button ripple effect
    function addRippleEffect(button) {
        // Remove existing ripple
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        // Create new ripple
        const circle = document.createElement('span');
        circle.classList.add('ripple');
        button.appendChild(circle);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            circle.remove();
        }, 1000);
    }
}); 