# ColorCycle

A beginner-friendly web application that helps developers better understand RGB colors by visualizing small changes to color values over time.

## Features

- Specify a starting color using hexadecimal RGB values (00-FF for each component)
- Set increment values for each color component that will be added every update interval
- Watch the color change over time to see how small adjustments affect visual appearance
- Disable color component and increment changes while the app is running
- Start/Stop button to control the color cycling
- Validation to ensure proper hexadecimal values are entered
- Bonus features:
  - Adjustable update interval
  - Support for both RGB and HSL color formats

## How to Use

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Set your starting color using the three hex input fields (Red, Green, Blue)
4. Set the increment values for each color component
5. Optionally, adjust the update interval or color format
6. Click the "Start" button to begin cycling
7. Click "Stop" to pause and adjust values if needed

## Color Input

- Each color component accepts hexadecimal values from `00` to `FF`
- Invalid entries will trigger a warning message
- Values are automatically formatted to two digits (e.g., `5` becomes `05`)

## Technical Details

- Built with pure HTML, CSS, and JavaScript
- No external libraries or dependencies required
- Responsive design that works on mobile and desktop devices
- Includes conversion functions for RGB and HSL color formats

## Educational Value

This app helps you visualize:
- How incremental changes to RGB values affect perceived color
- The relationship between numeric color values and visual appearance
- The difference between RGB and HSL color models

## License

This project is available under the MIT License.

---

Created as a beginner web development project to help understand color manipulation in CSS. 