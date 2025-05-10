# GitHub Status App

A modern web application that displays the current status of GitHub services by fetching data from the GitHub Status API.

## Features

- View the current status for various GitHub components
- Refresh status data with a "Get Status" button
- Modern UI with smooth animations and transitions
- Visual indicators for different status levels (operational, degraded, incidents)
- Components with non-operational status are highlighted with different colors and animations
- Responsive design that works on desktop and mobile devices
- Last updated timestamp
- **Auto-refresh** with customizable intervals
- **Browser notifications** for status changes
- **Incident history** with detailed updates view
- **Filter status components** by operational status
- **Detailed component information** on click
- **Overall status summary** at a glance
- **Custom favicon** that matches the app's design

## How to Use

### Method 1: Open directly in browser
1. Open `index.html` in a web browser
2. Click the "Get Status" button to fetch the latest GitHub service status
3. Review the status of each GitHub component displayed on the page

Note: Due to CORS restrictions, you may need to use one of the alternative methods below.

### Method 2: Run using Node.js local server (recommended)
1. Make sure you have Node.js installed
2. Open a terminal/command prompt in the project directory
3. Run the command: `node server.js`
4. Open your browser and navigate to `http://localhost:3000`
5. Click the "Get Status" button to fetch the latest GitHub service status

### Method 3: Request CORS Anywhere temporary access
1. Visit https://cors-anywhere.herokuapp.com/corsdemo
2. Click the button to request temporary access
3. Return to the GitHub Status App and try again

## Enhanced Features Guide

### Auto-Refresh
- Toggle auto-refresh with the "Auto-Refresh" button
- Customize refresh interval in settings (10-3600 seconds)
- Your preferences are saved between sessions

### Notifications
- Enable browser notifications to get alerts when service status changes
- Click the "Notifications" button to toggle this feature
- Requires browser permission for notifications

### Incident History
- View recent GitHub incidents by clicking the "View Incident History" button
- See detailed incident updates and status changes
- Toggle between showing and hiding detailed updates

### Component Filtering
- Use the filter buttons to show only specific status types
- Filter by "All", "Operational", "Degraded", or "Incidents"

### Component Details
- Click on any component to view detailed information
- See additional data including creation time, update time, and more

### Custom Favicon
- The app includes a custom GitHub-themed favicon that matches the design
- Uses SVG format for sharp display on all devices
- Includes fallbacks for maximum browser compatibility

## Technical Notes

This app uses:
- Vanilla JavaScript with the Fetch API
- Modern CSS features (variables, animations, flexbox, grid)
- Multiple methods to handle CORS issues (direct API, CORS proxies)
- GitHub Status API (https://www.githubstatus.com/api/v2/summary.json)
- Browser Notifications API
- Local Storage for saving user preferences
- Simple Node.js server for local hosting
- SVG-based favicon with fallbacks for compatibility

## UI Features

- Smooth entrance animations for status items
- Responsive design for all screen sizes
- Card-based UI with hover effects
- Animated status indicators for non-operational services
- Button animations for better user feedback
- Timestamp updates with subtle animation
- Modal windows for settings and detailed views
- Customizable appearance with dark/light mode toggle
- Custom favicon with GitHub-themed design

## License

This project is open source and available under the MIT License. 