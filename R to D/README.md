# Roman to Decimal Converter

A web application that allows users to convert between Roman numerals and decimal numbers.

## Features

- Convert Roman numerals to decimal numbers
- Convert decimal numbers to Roman numerals
- Real-time conversion as you type
- Validation for incorrect Roman numeral formats
- Responsive design that works on mobile and desktop

## Roman Numeral Rules

Roman numerals use the following symbols:

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

## Usage

1. Open `index.html` in any web browser
2. To convert Roman to Decimal:
   - Enter a valid Roman numeral in the "Roman Numeral" input field
   - The decimal equivalent will be displayed automatically, or click the "Convert" button
3. To convert Decimal to Roman:
   - Enter a decimal number (1-3999) in the "Decimal Number" input field
   - The Roman numeral equivalent will be displayed automatically, or click the "Convert" button

## Validation Rules

The converter validates Roman numerals according to these rules:
- Only the characters I, V, X, L, C, D, M are allowed
- No more than three consecutive identical characters (e.g., IIII is invalid, use IV instead)
- Certain combinations are not allowed (e.g., IL is invalid, use XLIX for 49)
- The decimal to Roman converter only accepts numbers between 1 and 3999

## Technical Details

This project is built with:
- HTML5
- CSS3
- JavaScript (ES6+)

No external libraries or frameworks are used, making it lightweight and easy to run.