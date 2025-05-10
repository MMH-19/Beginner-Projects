# Enhanced Calendar App

A modern, feature-rich calendar application for organizing your daily life. This application allows you to create, edit, and manage events with a clean and intuitive interface, enhanced with modern animations and a responsive design.

## Features

- **Event Management**: Create, edit, and delete events
- **Drag and Drop**: Easily move events between dates with smooth animations
- **Event Reminders**: Set reminders for important events with custom notifications
- **Theme Toggle**: Switch between light and dark themes
- **Local Storage**: Your events are saved locally and persist between sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Enhanced with Tailwind CSS for a clean, modern interface
- **Smooth Animations**: Beautiful transitions and feedback throughout the application
- **Tooltips**: Hover over events to see details
- **Keyboard Shortcuts**: Navigate with arrow keys and use ESC to close modals
- **Color Presets**: Quick color selection for event categorization

## How to Use

1. **Navigation**: 
   - Use the arrow buttons to navigate between months
   - Use keyboard left/right arrows as shortcuts

2. **Add Event**: 
   - Click the "Add Event" button in the header
   - Click directly on a date to add an event for that day

3. **Edit Event**: 
   - Click on any existing event to edit its details
   - Hover over events to see detailed tooltips

4. **Delete Event**: 
   - When editing an event, click the "Delete" button

5. **Move Event**: 
   - Drag and drop events to different dates with visual feedback

6. **Set Reminder**: 
   - Choose reminder timing when creating or editing an event
   - Receive desktop notifications when reminders are triggered

7. **Toggle Theme**: 
   - Click the moon/sun icon to switch between light and dark mode

## Technical Details

### Libraries Used

- **Tailwind CSS**: For responsive, utility-first styling
- **Font Awesome**: For icons
- **Animate.css**: For predefined animation classes
- **Luxon**: For advanced date manipulation
- **Tippy.js**: For enhanced tooltips
- **Popper.js**: For positioning tooltips and popovers

### Browser Features Used

- **Web Notifications API**: For event reminders
- **LocalStorage API**: For data persistence
- **Drag and Drop API**: For interactive event management

## Setup

1. Clone or download this repository
2. Open `index.html` in your browser
3. No additional setup or installation required! Everything runs client-side.

## Browser Compatibility

This application works in all modern browsers that support:
- CSS Grid and Flexbox
- ES6 JavaScript features
- Web Notifications API
- LocalStorage API
- Tailwind CSS

## Project Structure

- `index.html` - Main HTML structure with Tailwind integration
- `styles.css` - Custom styling to complement Tailwind
- `script.js` - JavaScript functionality with animation enhancements

## Future Enhancements

- Week and year views
- Month/year selection dropdown
- Recurring events
- Export/import calendar data
- Multiple calendars support
- Collaborative sharing options 