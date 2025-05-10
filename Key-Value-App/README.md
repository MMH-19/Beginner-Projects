# Key Value App

An interactive web application that displays information about keyboard events when keys are pressed, with advanced visual feedback and customization options.

## Features

- Displays the key value and key code when any key is pressed
- Shows the status (True/False) of modifier keys (Alt, Control, Meta, Shift)
- Visual keyboard that highlights keys as they are pressed
- Key history tracking to show recently pressed keys
- Dark/Light theme toggle with persistent preferences
- Enhanced audio feedback using the Web Audio API with pleasant musical tones
- Sound toggle functionality
- Smooth animations and visual feedback

## How to Use

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Press any key on your keyboard to see its key value and key code
4. Watch the visual keyboard to see which key was pressed
5. Toggle the theme using the button in the top-right corner
6. Enable/disable sound using the toggle at the bottom

## Implementation Details

This project is built with:
- HTML5
- CSS3
- Vanilla JavaScript

### Enhanced Features

- **Visual Keyboard**: Shows a visual representation of a standard QWERTY keyboard that highlights keys when pressed
- **Key History**: Tracks and displays the last 10 keys pressed
- **Theme Toggle**: Switch between light and dark themes with persistent preference using localStorage
- **Sound Enhancement**: Musical tones based on a pentatonic scale for more pleasant audio feedback
- **Animations**: Smooth animations and transitions for better visual feedback
- **Responsive Design**: Works well on different screen sizes

## Browser Compatibility

This application works in modern browsers that support:
- ES6 JavaScript
- Web Audio API
- CSS Grid Layout
- localStorage API 