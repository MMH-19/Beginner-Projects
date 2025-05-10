document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const languageInput = document.getElementById('language');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const viewMapBtn = document.getElementById('view-map-btn');
    const allowLocationBtn = document.getElementById('allow-location-btn');
    const messageContainer = document.getElementById('message-container');
    const permissionNotification = document.getElementById('permission-notification');
    const geoInfo = document.getElementById('geo-info');
    const geoDetails = document.getElementById('geo-details');
    const locationAccuracy = document.querySelector('.location-accuracy');
    const accuracyNote = document.querySelector('.accuracy-note');
    const locationStatus = document.querySelector('.location-status');
    
    // Store location data globally to be accessed by map button
    let userLocationData = null;
    let preciseLocationData = null;
    let usingPreciseLocation = false;
    let permissionRequested = false;

    // Function to validate inputs
    function validateInputs() {
        let isValid = true;
        
        if (!usernameInput.value.trim()) {
            usernameInput.classList.add('error');
            isValid = false;
        } else {
            usernameInput.classList.remove('error');
        }
        
        if (!passwordInput.value.trim()) {
            passwordInput.classList.add('error');
            isValid = false;
        } else {
            passwordInput.classList.remove('error');
        }
        
        if (!isValid) {
            messageContainer.textContent = 'Please fill in all required fields.';
            messageContainer.style.color = '#e74c3c';
        }
        
        return isValid;
    }

    // Function to decode HTML entities
    function decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // Function to get user's IP and location data
    async function getLocationData() {
        try {
            const response = await fetch('http://ip-api.com/json/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching location data:', error);
            return null;
        }
    }

    // Function to get user's precise location using browser Geolocation API
    function getPreciseLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const preciseData = {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            isPrecise: true
                        };
                        
                        // Try to get additional info based on coordinates
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${preciseData.lat}&lon=${preciseData.lon}&zoom=18&addressdetails=1`)
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.address) {
                                    preciseData.city = data.address.city || data.address.town || data.address.village || 'Unknown';
                                    preciseData.country = data.address.country || 'Unknown';
                                    preciseData.regionName = data.address.state || data.address.county || 'Unknown';
                                    preciseData.zip = data.address.postcode || 'N/A';
                                    preciseData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                }
                                resolve(preciseData);
                            })
                            .catch(() => {
                                // If reverse geocoding fails, still return coordinates
                                resolve(preciseData);
                            });
                    },
                    (error) => {
                        let errorMessage;
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = "Location access was denied by the user.";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = "Location information is unavailable.";
                                break;
                            case error.TIMEOUT:
                                errorMessage = "The request to get location timed out.";
                                break;
                            default:
                                errorMessage = "An unknown error occurred.";
                                break;
                        }
                        reject(errorMessage);
                    }
                );
            } else {
                reject("Geolocation is not supported by this browser.");
            }
        });
    }

    // Function to get greeting in user's language
    async function getGreeting(countryCode, ipAddress) {
        try {
            // If user provided a language code, use it instead
            const langCode = languageInput.value.trim() || countryCode;
            
            const response = await fetch(`https://www.fourtonfish.com/hellosalut/hello/?lang=${langCode}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return decodeHtmlEntities(data.hello);
        } catch (error) {
            console.error('Error fetching greeting:', error);
            return 'Hello';
        }
    }

    // Function to display geolocation information
    function displayGeoInfo(data, isPrecise = false) {
        geoDetails.innerHTML = '';
        
        let geoItems = [];
        
        if (isPrecise) {
            geoItems = [
                { label: 'Latitude', value: data.lat },
                { label: 'Longitude', value: data.lon },
                { label: 'City', value: data.city || 'Unknown' },
                { label: 'Region', value: data.regionName || 'Unknown' },
                { label: 'Country', value: data.country || 'Unknown' },
                { label: 'ZIP Code', value: data.zip || 'N/A' },
                { label: 'Timezone', value: data.timezone || 'Unknown' },
                { label: 'Accuracy', value: data.accuracy ? `±${Math.round(data.accuracy)} meters` : 'N/A' }
            ];
            
            // Update the UI to indicate precise location is being used
            locationAccuracy.classList.add('using-precise');
            accuracyNote.textContent = 'Using precise location from your device';
            locationStatus.textContent = `Accuracy: ±${Math.round(data.accuracy)} meters`;
            
            // Store that we're using precise location
            usingPreciseLocation = true;
        } else {
            geoItems = [
                { label: 'IP Address', value: data.query },
                { label: 'City', value: data.city },
                { label: 'Region', value: data.regionName },
                { label: 'Country', value: data.country },
                { label: 'ZIP Code', value: data.zip || 'N/A' },
                { label: 'Latitude', value: data.lat },
                { label: 'Longitude', value: data.lon },
                { label: 'Timezone', value: data.timezone }
            ];
            
            // Reset UI
            locationAccuracy.classList.remove('using-precise');
            accuracyNote.textContent = 'IP-based location may not be accurate';
            locationStatus.textContent = 'For better accuracy, allow location access';
            
            // Reset flag
            usingPreciseLocation = false;
        }
        
        geoItems.forEach(item => {
            const geoItem = document.createElement('div');
            geoItem.classList.add('geo-item');
            geoItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
            geoDetails.appendChild(geoItem);
        });
        
        geoInfo.classList.remove('hidden');
    }
    
    // Function to open Google Maps with the most accurate location data available
    function openGoogleMaps() {
        // Use precise location if available, otherwise fall back to IP-based location
        const locationToUse = usingPreciseLocation && preciseLocationData ? 
                              preciseLocationData : 
                              userLocationData;
        
        if (locationToUse && locationToUse.lat && locationToUse.lon) {
            const mapUrl = `https://www.google.com/maps?q=${locationToUse.lat},${locationToUse.lon}`;
            window.open(mapUrl, '_blank');
        } else {
            messageContainer.textContent = 'Location data is not available.';
            messageContainer.style.color = '#e74c3c';
        }
    }
    
    // Function to request precise location
    async function requestPreciseLocation() {
        try {
            messageContainer.textContent = 'Requesting precise location...';
            messageContainer.style.color = '#3498db';
            
            // Mark that we've requested permission so we don't show notification again
            permissionRequested = true;
            
            const preciseData = await getPreciseLocation();
            
            // Store the precise location data
            preciseLocationData = preciseData;
            
            // Display the precise location
            displayGeoInfo(preciseData, true);
            
            messageContainer.textContent = 'Precise location obtained!';
            messageContainer.style.color = '#27ae60';
            
            // Hide the permission notification since we got permission
            permissionNotification.classList.add('hidden');
        } catch (error) {
            console.error('Error getting precise location:', error);
            messageContainer.textContent = `Error: ${error}`;
            messageContainer.style.color = '#e74c3c';
            
            // If there was an error, still hide the notification and show the IP-based info
            permissionNotification.classList.add('hidden');
            if (userLocationData) {
                displayGeoInfo(userLocationData);
            }
        }
    }

    // Login button click handler
    loginBtn.addEventListener('click', async () => {
        if (!validateInputs()) {
            return;
        }
        
        const username = usernameInput.value.trim();
        
        // Get user's location data
        const locationData = await getLocationData();
        
        if (locationData && locationData.status === 'success') {
            // Store location data for map button
            userLocationData = locationData;
            
            // Get greeting in user's language
            const greeting = await getGreeting(locationData.countryCode, locationData.query);
            
            // Display success message
            messageContainer.textContent = `${greeting} ${username}, you have successfully logged in!`;
            messageContainer.style.color = '#27ae60';
            
            // Show permission notification first instead of geolocation info
            permissionNotification.classList.remove('hidden');
        } else {
            messageContainer.textContent = `Hello ${username}, you have successfully logged in!`;
            messageContainer.style.color = '#27ae60';
        }
    });

    // Logout button click handler
    logoutBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        
        // Clear inputs
        usernameInput.value = '';
        passwordInput.value = '';
        languageInput.value = '';
        
        // Remove error classes
        usernameInput.classList.remove('error');
        passwordInput.classList.remove('error');
        
        // Display logout message
        if (username) {
            messageContainer.textContent = `Have a great day ${username}!`;
            messageContainer.style.color = '#3498db';
        } else {
            messageContainer.textContent = '';
        }
        
        // Hide all info panels
        geoInfo.classList.add('hidden');
        permissionNotification.classList.add('hidden');
        
        // Reset location data
        userLocationData = null;
        preciseLocationData = null;
        usingPreciseLocation = false;
        permissionRequested = false;
    });
    
    // View on Map button click handler
    viewMapBtn.addEventListener('click', openGoogleMaps);
    
    // Allow location access button click handler
    allowLocationBtn.addEventListener('click', requestPreciseLocation);
    
    // Auto-dismiss permission notification after 30 seconds if user hasn't interacted with it
    // This ensures the app continues to work even if the user ignores the notification
    setTimeout(() => {
        if (permissionNotification.classList.contains('hidden') === false && !permissionRequested) {
            permissionNotification.classList.add('hidden');
            if (userLocationData) {
                displayGeoInfo(userLocationData);
            }
        }
    }, 30000);
}); 