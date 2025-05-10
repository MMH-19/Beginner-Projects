# Countdown Timer Application

A modern, interactive web-based countdown timer that allows users to create and track multiple countdown events with beautiful animations and visual effects.

## Features

- Create countdowns for important events with name, date, and optional time
- Real-time countdown display showing days, hours, minutes, and seconds
- Animated number transitions when countdown values change
- Form validation with visual feedback and error animations
- Automatically decrementing countdown timer with fluid animations
- Save events to localStorage for persistence across sessions
- Load and delete saved events with smooth animations
- Alert notification when an event is reached
- Support for multiple countdown events
- Visual urgency indicator when event is less than 1 hour away
- Celebration animation when event is reached
- Responsive design that works on mobile and desktop devices
- Dark mode support

## Visual Enhancements

- Modern color scheme with gradient buttons and backgrounds
- Sleek card-based UI with subtle shadows and hover effects
- Number flip animations on countdown digits
- Smooth transition animations between states
- Staggered fade-in animations for saved events
- Shake animation for validation errors
- Pulse animation for urgent countdowns
- Celebration animation when events are reached

## How to Use

1. Open `index.html` in any modern web browser
2. Fill in the event details:
   - Event Name (required)
   - Event Date (required)
   - Event Time (optional, defaults to midnight)
3. Click "Start Countdown" to begin the countdown
4. The countdown will automatically update in real-time with animations
5. When an event countdown finishes, you will see an alert and celebration
6. Saved events appear in the "Saved Events" section with time remaining
7. You can load a saved event by clicking "Load" or delete it with "Delete"

## Browser Support

This application works in all modern browsers that support:
- ES6 JavaScript
- CSS Variables and modern CSS features
- localStorage API
- Flexbox CSS layout
- CSS animations and transitions

## Development Notes

This project uses:
- Vanilla JavaScript (no external libraries)
- Custom CSS with variables and modern features
- CSS animations and transitions
- HTML5 form elements
- localStorage for data persistence
- Responsive design techniques
- Google Fonts (Montserrat and Poppins)
- Custom SVG favicon with fallback for all browsers

## Favicon

The project includes:
- Custom SVG favicon with an hourglass design
- Inline SVG emoji fallback for browsers without SVG support
- A favicon generator tool (`generate-favicon.html`) that allows you to:
  - Preview the favicon in different sizes
  - Download a PNG version for maximum compatibility
  - View implementation instructions

To generate a PNG favicon:
1. Open `generate-favicon.html` in a browser
2. Click the "Download PNG Favicon" button
3. Add the downloaded PNG to your project folder
4. Use both SVG and PNG references for maximum browser compatibility

## License

This project is open source and available for personal and educational use. 