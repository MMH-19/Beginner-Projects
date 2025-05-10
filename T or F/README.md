# TrueOrFalse Application

A simple web application to help JavaScript developers understand conditional expressions and truthiness by testing various value comparisons.

## Features

- Compare two values using different JavaScript conditional operators
- See the result as TRUE or FALSE
- Specify the data type for each value (String, Number, Boolean, or As Is)
- Get warnings for invalid inputs or conversions

## How to Use

1. Enter the first value you want to compare
2. Select the data type for the first value
3. Choose a conditional operator (===, ==, !=, !==, >, <, >=, <=)
4. Enter the second value you want to compare
5. Select the data type for the second value
6. Click "Evaluate" to see the result

## Data Types

- **As Is**: Attempts to automatically convert to the most appropriate type
- **String**: Treats the value as a string
- **Number**: Converts the value to a number
- **Boolean**: Converts the value to a boolean (true/false)

## Examples to Try

- `1 == '1'` (should be TRUE with == operator)
- `1 === '1'` (should be FALSE with === operator)
- `0 == false` (should be TRUE with == operator)
- `'' == false` (should be TRUE with == operator)
- `[] == 0` (should be TRUE with == operator)
- `[] === 0` (should be FALSE with === operator)

## Project Structure

- `index.html`: Main HTML file
- `style.css`: CSS styles
- `script.js`: JavaScript code for evaluating expressions

## Run Locally

Simply open the `index.html` file in a web browser.

## Implementation Notes

The application evaluates conditional expressions without using `eval()` for security reasons. Instead, it uses a switch statement to apply the selected operator to the converted values. 