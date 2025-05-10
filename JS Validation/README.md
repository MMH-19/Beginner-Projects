# JavaScript Validation With Regex

A modern, interactive form validation project using JavaScript, RegEx, Tailwind CSS, and animations.

## Description

This project demonstrates form validation using JavaScript and RegEx with an enhanced modern UI. It validates three input fields:

1. **Password**: Must contain 5 capital letters, 6 symbols, and 2 hyphens in any order
2. **Username**: Must contain only letters without spaces
3. **Email**: Must be a Gmail address (ending with @gmail.com)

## Features

- Real-time validation as the user types
- Visual feedback with animations for invalid inputs
- Detailed error messages
- Password strength indicator
- Toggle password visibility
- Submit button is disabled until all inputs are valid
- Modern UI with Tailwind CSS
- Responsive design
- Enhanced form submission with SweetAlert2

## How to Use

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Try entering different values in the form fields to see validation in action

## Valid Input Examples

- **Password**: `ABCDE!@#$%^--` (5 capital letters, 6 symbols, 2 hyphens)
- **Username**: `johnsmith` (letters only, no spaces)
- **Email**: `example@gmail.com` (must be a Gmail address)

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Regular Expressions (RegEx)
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Animate.css](https://animate.style/) - CSS animation library
- [SweetAlert2](https://sweetalert2.github.io/) - Beautiful, responsive, customizable alerts

## Enhanced Features

- **Debounced Validation**: Improved performance by debouncing validation events
- **Animations**: Added subtle animations for better user experience
- **Password Strength Indicator**: Visual feedback on password strength
- **Toggle Password Visibility**: Show/hide password with a click
- **Modern Form Styling**: Tailwind CSS-based responsive design
- **Enhanced Notifications**: SweetAlert2 for modern, customizable alerts

## Project Requirements

Based on the [App Ideas Collection](https://github.com/florinpop17/app-ideas) project specifications. 