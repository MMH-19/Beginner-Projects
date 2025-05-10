document.addEventListener('DOMContentLoaded', () => {
    const getStatusButton = document.getElementById('get-status');
    const statusContainer = document.getElementById('status-container');
    const timestampElement = document.getElementById('timestamp');
    const themeToggleButton = document.getElementById('theme-toggle');
    
    // Auto-refresh variables
    let autoRefreshInterval = null;
    let autoRefreshTime = 60; // Default to 60 seconds
    
    // Notification variables
    let notificationsEnabled = false;
    let previousComponentStatuses = {};
    
    // Theme management
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
    }
    
    // Theme toggle functionality
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Update localStorage
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        // Add animation to theme toggle
        themeToggleButton.querySelector('svg').style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggleButton.querySelector('svg').style.transform = '';
        }, 500);
    });

    getStatusButton.addEventListener('click', fetchGitHubStatus);

    // Function to format date
    function formatDateTime(date) {
        const options = { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    // Function to update timestamp
    function updateTimestamp(date = new Date()) {
        timestampElement.textContent = `Last updated: ${formatDateTime(date)}`;
        timestampElement.classList.add('updated');
        setTimeout(() => {
            timestampElement.classList.remove('updated');
        }, 2000);
    }

    // Add button click effects
    getStatusButton.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        ripple.classList.add('active');
        
        // Add dynamic feedback for button click
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
            ripple.remove();
        }, 600);
    });

    // Function to fetch GitHub status
    async function fetchGitHubStatus() {
        statusContainer.innerHTML = '<div class="loading">Loading GitHub status...</div>';
        getStatusButton.disabled = true;
        
        // Try different methods to bypass CORS
        await tryDifferentApproaches();
        
        getStatusButton.disabled = false;
    }

    // Auto-refresh functions
    function startAutoRefresh() {
        stopAutoRefresh(); // Clear any existing interval
        autoRefreshInterval = setInterval(fetchGitHubStatus, autoRefreshTime * 1000);
        updateAutoRefreshUI(true);
        // Save preference
        localStorage.setItem('autoRefresh', 'true');
        localStorage.setItem('refreshInterval', autoRefreshTime.toString());
    }

    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
        updateAutoRefreshUI(false);
        // Save preference
        localStorage.setItem('autoRefresh', 'false');
    }

    function updateAutoRefreshUI(isActive) {
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.classList.toggle('active', isActive);
            autoRefreshToggle.textContent = isActive ? 'Auto-Refresh: ON' : 'Auto-Refresh: OFF';
        }
    }

    // Notification functions
    function requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return;
        }
        
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notificationsEnabled = true;
                updateNotificationUI(true);
                localStorage.setItem('notifications', 'true');
                
                // Show confirmation notification
                new Notification("GitHub Status Notifications", {
                    body: "You will now receive notifications when GitHub service status changes",
                    icon: "favicon.ico"
                });
            } else {
                notificationsEnabled = false;
                updateNotificationUI(false);
                localStorage.setItem('notifications', 'false');
            }
        });
    }
    
    function toggleNotifications() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return;
        }
        
        if (Notification.permission === "granted") {
            notificationsEnabled = !notificationsEnabled;
            updateNotificationUI(notificationsEnabled);
            localStorage.setItem('notifications', notificationsEnabled.toString());
        } else if (Notification.permission !== "denied") {
            requestNotificationPermission();
        } else {
            alert("Notification permission is denied. Please enable notifications in your browser settings.");
        }
    }
    
    function updateNotificationUI(isEnabled) {
        const notificationToggle = document.getElementById('notification-toggle');
        if (notificationToggle) {
            notificationToggle.classList.toggle('active', isEnabled);
            notificationToggle.textContent = isEnabled ? 'Notifications: ON' : 'Notifications: OFF';
        }
    }
    
    function checkForStatusChanges(components) {
        if (!notificationsEnabled) return;
        
        const changedComponents = [];
        
        components.forEach(component => {
            // Skip components that don't correspond to services
            if (component.name.includes('Visit')) return;
            
            const previousStatus = previousComponentStatuses[component.id];
            
            // If we have a previous status and it's different
            if (previousStatus && previousStatus !== component.status) {
                changedComponents.push({
                    name: component.name,
                    oldStatus: previousStatus,
                    newStatus: component.status
                });
            }
            
            // Update stored status
            previousComponentStatuses[component.id] = component.status;
        });
        
        // If there are changed components, show a notification
        if (changedComponents.length > 0) {
            showStatusChangeNotification(changedComponents);
        }
    }
    
    function showStatusChangeNotification(changedComponents) {
        if (!notificationsEnabled || !("Notification" in window) || Notification.permission !== "granted") {
            return;
        }
        
        let notificationTitle;
        let notificationBody;
        
        if (changedComponents.length === 1) {
            const component = changedComponents[0];
            notificationTitle = `GitHub ${component.name} Status Change`;
            notificationBody = `Status changed from ${formatStatus(component.oldStatus)} to ${formatStatus(component.newStatus)}`;
        } else {
            notificationTitle = "GitHub Services Status Changes";
            notificationBody = changedComponents.map(comp => 
                `${comp.name}: ${formatStatus(comp.oldStatus)} → ${formatStatus(comp.newStatus)}`
            ).join('\n');
        }
        
        const notification = new Notification(notificationTitle, {
            body: notificationBody,
            icon: "favicon.ico"
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    // Function to create auto-refresh controls
    function createAutoRefreshControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'auto-refresh-controls';
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'auto-refresh-toggle';
        toggleButton.className = 'auto-refresh-toggle';
        toggleButton.textContent = 'Auto-Refresh: OFF';
        
        // Create settings button
        const settingsButton = document.createElement('button');
        settingsButton.className = 'auto-refresh-settings';
        settingsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        
        // Create notification toggle button
        const notificationToggle = document.createElement('button');
        notificationToggle.id = 'notification-toggle';
        notificationToggle.className = 'notification-toggle';
        notificationToggle.textContent = 'Notifications: OFF';
        
        controlsContainer.appendChild(toggleButton);
        controlsContainer.appendChild(settingsButton);
        controlsContainer.appendChild(notificationToggle);
        
        // Add event listeners
        toggleButton.addEventListener('click', function() {
            if (autoRefreshInterval) {
                stopAutoRefresh();
            } else {
                startAutoRefresh();
            }
        });
        
        settingsButton.addEventListener('click', function() {
            showRefreshSettingsModal();
        });
        
        notificationToggle.addEventListener('click', function() {
            toggleNotifications();
        });
        
        // Add to the DOM
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(controlsContainer, header.nextSibling);
        
        // Load saved preferences
        const savedAutoRefresh = localStorage.getItem('autoRefresh');
        const savedInterval = localStorage.getItem('refreshInterval');
        const savedNotifications = localStorage.getItem('notifications');
        
        if (savedInterval) {
            autoRefreshTime = parseInt(savedInterval, 10);
        }
        
        if (savedAutoRefresh === 'true') {
            startAutoRefresh();
        }
        
        if (savedNotifications === 'true' && Notification.permission === 'granted') {
            notificationsEnabled = true;
            updateNotificationUI(true);
        }
    }
    
    // Function to show refresh settings modal
    function showRefreshSettingsModal() {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Auto-Refresh Settings</h3>
                <div class="setting-group">
                    <label for="refresh-interval">Refresh Interval (seconds):</label>
                    <input type="number" id="refresh-interval" min="10" max="3600" value="${autoRefreshTime}">
                </div>
                <div class="modal-actions">
                    <button class="modal-save">Save</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-save').addEventListener('click', () => {
            const newInterval = parseInt(document.getElementById('refresh-interval').value, 10);
            
            if (newInterval >= 10 && newInterval <= 3600) {
                autoRefreshTime = newInterval;
                localStorage.setItem('refreshInterval', autoRefreshTime.toString());
                
                // If auto-refresh is active, restart with new interval
                if (autoRefreshInterval) {
                    startAutoRefresh();
                }
                
                document.body.removeChild(modal);
            } else {
                alert('Please enter a valid interval between 10 and 3600 seconds.');
            }
        });
    }

    // Try different approaches to get GitHub status data
    async function tryDifferentApproaches() {
        let success = false;

        // Method 1: Direct API call (may fail due to CORS)
        try {
            const response = await fetch('https://www.githubstatus.com/api/v2/summary.json');
            if (response.ok) {
                const data = await response.json();
                displayStatus(data);
                checkForStatusChanges(data.components);
                updateTimestamp(data.page.updated_at);
                success = true;
                return;
            }
        } catch (error) {
            console.log('Direct API call failed, trying alternative methods...');
        }

        // Method 2: Using cors-anywhere proxy
        if (!success) {
            try {
                const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.githubstatus.com/api/v2/summary.json');
                if (response.ok) {
                    const data = await response.json();
                    displayStatus(data);
                    checkForStatusChanges(data.components);
                    updateTimestamp(data.page.updated_at);
                    success = true;
                    return;
                }
            } catch (error) {
                console.log('CORS-anywhere proxy failed, trying alternative methods...');
            }
        }

        // Method 3: Using allorigins.win proxy
        if (!success) {
            try {
                const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.githubstatus.com/api/v2/summary.json'));
                if (response.ok) {
                    const responseData = await response.json();
                    const data = JSON.parse(responseData.contents);
                    displayStatus(data);
                    checkForStatusChanges(data.components);
                    updateTimestamp(data.page.updated_at);
                    success = true;
                    return;
                }
            } catch (error) {
                console.log('AllOrigins proxy failed, showing error message');
            }
        }

        // If all methods fail, show error message with instructions
        if (!success) {
            statusContainer.innerHTML = `
                <div class="loading error">
                    <p>Unable to fetch GitHub status due to CORS restrictions.</p>
                    <p>Please try one of the following:</p>
                    <ol>
                        <li>Visit <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">CORS Anywhere Demo</a> and request temporary access</li>
                        <li>Run this app using a local server instead of opening the file directly</li>
                        <li>Use a browser extension to disable CORS for testing</li>
                    </ol>
                </div>
            `;
            updateTimestamp();
        }
    }

    // Function to display GitHub status
    function displayStatus(data) {
        statusContainer.innerHTML = '';
        
        // Add filter/sort controls
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <div class="filter-controls">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="operational">Operational</button>
                <button class="filter-btn" data-filter="degraded">Degraded</button>
                <button class="filter-btn" data-filter="incident">Incidents</button>
            </div>
        `;
        statusContainer.appendChild(filterContainer);
        
        // Add incident history button
        const historyButton = document.createElement('button');
        historyButton.className = 'history-button';
        historyButton.innerHTML = 'View Incident History <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        statusContainer.appendChild(historyButton);
        
        // Create container for status items
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'status-items-container';
        statusContainer.appendChild(itemsContainer);
        
        // Display the current status for each component
        data.components.forEach((component, index) => {
            // Skip components that don't correspond to services we want to show
            if (component.name.includes('Visit')) return;
            
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            
            // Add appropriate status class based on status
            const statusClass = getStatusClass(component.status);
            statusItem.classList.add(statusClass.toLowerCase());
            statusItem.dataset.status = statusClass.toLowerCase();
            
            statusItem.innerHTML = `
                <div class="service-name">${component.name}</div>
                <div class="status-indicator ${statusClass}">${formatStatus(component.status)}</div>
            `;
            
            // Add event listeners for hover effects
            statusItem.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--hover-shadow)';
            });
            
            statusItem.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            // Add click event for detailed view
            statusItem.addEventListener('click', function() {
                showComponentDetails(component);
            });
            
            itemsContainer.appendChild(statusItem);
        });
        
        // Add filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                const items = document.querySelectorAll('.status-item');
                items.forEach(item => {
                    if (filter === 'all' || item.dataset.status === filter) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Add incident history functionality
        historyButton.addEventListener('click', function() {
            fetchIncidentHistory();
        });
        
        // Add a summary section at the top
        const overallStatus = data.status.indicator;
        const summary = document.createElement('div');
        summary.className = 'status-summary ' + getStatusClass(overallStatus).toLowerCase();
        
        let summaryText;
        switch (overallStatus) {
            case 'none':
                summaryText = 'All systems operational';
                break;
            case 'minor':
                summaryText = 'Some systems experiencing issues';
                break;
            case 'major':
                summaryText = 'Major system outage';
                break;
            case 'critical':
                summaryText = 'Critical system outage';
                break;
            default:
                summaryText = data.status.description;
        }
        
        summary.innerHTML = `
            <div class="summary-indicator ${getStatusClass(overallStatus).toLowerCase()}"></div>
            <div class="summary-text">${summaryText}</div>
        `;
        
        // Insert the summary at the top
        statusContainer.insertBefore(summary, filterContainer);
    }
    
    // Function to show component details
    function showComponentDetails(component) {
        const modal = document.createElement('div');
        modal.className = 'modal component-modal';
        
        const statusClass = getStatusClass(component.status);
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="component-header ${statusClass.toLowerCase()}">
                    <h3>${component.name}</h3>
                    <div class="status-badge ${statusClass.toLowerCase()}">${formatStatus(component.status)}</div>
                </div>
                <div class="component-details">
                    <p><strong>ID:</strong> ${component.id}</p>
                    <p><strong>Status:</strong> ${formatStatus(component.status)}</p>
                    <p><strong>Created At:</strong> ${formatDateTime(component.created_at)}</p>
                    <p><strong>Updated At:</strong> ${formatDateTime(component.updated_at)}</p>
                    <p><strong>Description:</strong> ${component.description || 'No description available'}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    // Function to fetch incident history
    async function fetchIncidentHistory() {
        // Show loading modal
        const modal = document.createElement('div');
        modal.className = 'modal history-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Incident History</h3>
                <div class="history-container">
                    <div class="loading">Loading incident history...</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Fetch incidents
        try {
            let incidents = null;
            let success = false;
            
            // Try direct API call
            try {
                const response = await fetch('https://www.githubstatus.com/api/v2/incidents.json');
                if (response.ok) {
                    const data = await response.json();
                    incidents = data.incidents;
                    success = true;
                }
            } catch (error) {
                console.log('Direct incidents API call failed, trying alternative methods...');
            }
            
            // Try cors-anywhere proxy
            if (!success) {
                try {
                    const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.githubstatus.com/api/v2/incidents.json');
                    if (response.ok) {
                        const data = await response.json();
                        incidents = data.incidents;
                        success = true;
                    }
                } catch (error) {
                    console.log('CORS-anywhere proxy failed for incidents, trying alternative methods...');
                }
            }
            
            // Try allorigins proxy
            if (!success) {
                try {
                    const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.githubstatus.com/api/v2/incidents.json'));
                    if (response.ok) {
                        const responseData = await response.json();
                        const data = JSON.parse(responseData.contents);
                        incidents = data.incidents;
                        success = true;
                    }
                } catch (error) {
                    console.log('AllOrigins proxy failed for incidents');
                }
            }
            
            // Display incidents if successful
            if (success && incidents) {
                displayIncidents(incidents);
            } else {
                document.querySelector('.history-container').innerHTML = `
                    <div class="loading error">
                        <p>Unable to fetch incident history due to CORS restrictions.</p>
                    </div>
                `;
            }
        } catch (error) {
            document.querySelector('.history-container').innerHTML = `
                <div class="loading error">
                    <p>Error fetching incident history: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Function to display incidents
    function displayIncidents(incidents) {
        const historyContainer = document.querySelector('.history-container');
        
        if (!incidents || incidents.length === 0) {
            historyContainer.innerHTML = '<p>No incidents found.</p>';
            return;
        }
        
        historyContainer.innerHTML = '';
        
        incidents.forEach(incident => {
            const incidentEl = document.createElement('div');
            incidentEl.className = 'incident-item';
            
            // Determine incident status class
            let statusClass = 'resolved';
            if (incident.status !== 'resolved') {
                statusClass = 'ongoing';
            }
            
            incidentEl.classList.add(statusClass);
            
            // Format incident date
            const incidentDate = formatDateTime(incident.created_at);
            
            // Format incident updates
            let updatesHtml = '';
            if (incident.incident_updates && incident.incident_updates.length > 0) {
                updatesHtml = '<div class="incident-updates">';
                incident.incident_updates.forEach(update => {
                    updatesHtml += `
                        <div class="incident-update">
                            <div class="update-time">${formatDateTime(update.created_at)}</div>
                            <div class="update-status">${update.status}</div>
                            <div class="update-body">${update.body}</div>
                        </div>
                    `;
                });
                updatesHtml += '</div>';
            }
            
            incidentEl.innerHTML = `
                <div class="incident-header">
                    <h4 class="incident-name">${incident.name}</h4>
                    <div class="incident-badge ${statusClass}">${incident.status}</div>
                </div>
                <div class="incident-date">${incidentDate}</div>
                <div class="incident-message">${incident.incident_updates[0]?.body || 'No details available'}</div>
                <button class="toggle-updates">Show Updates</button>
                ${updatesHtml}
            `;
            
            historyContainer.appendChild(incidentEl);
            
            // Add toggle functionality for updates
            const toggleBtn = incidentEl.querySelector('.toggle-updates');
            const updatesSection = incidentEl.querySelector('.incident-updates');
            
            if (updatesSection) {
                updatesSection.style.display = 'none';
                
                toggleBtn.addEventListener('click', function() {
                    if (updatesSection.style.display === 'none') {
                        updatesSection.style.display = 'block';
                        this.textContent = 'Hide Updates';
                    } else {
                        updatesSection.style.display = 'none';
                        this.textContent = 'Show Updates';
                    }
                });
            } else {
                toggleBtn.style.display = 'none';
            }
        });
    }

    // Function to map status to CSS class
    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'operational':
            case 'none':
                return 'operational';
            case 'degraded_performance':
            case 'partial_outage':
            case 'minor':
                return 'degraded';
            case 'major_outage':
            case 'major':
            case 'critical':
                return 'incident';
            case 'under_maintenance':
                return 'maintenance';
            default:
                return '';
        }
    }

    // Function to format status text
    function formatStatus(status) {
        switch (status.toLowerCase()) {
            case 'operational':
                return 'Operational';
            case 'degraded_performance':
                return 'Degraded';
            case 'partial_outage':
                return 'Partial Outage';
            case 'major_outage':
                return 'Major Outage';
            case 'under_maintenance':
                return 'Maintenance';
            default:
                return status;
        }
    }
    
    // Initialize auto-refresh and notification controls
    createAutoRefreshControls();
    
    // Initial fetch
    fetchGitHubStatus();
}); 