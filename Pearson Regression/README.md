# Pearson Regression Calculator

A web application for calculating Pearson correlation coefficient between two sets of data.

## Features

- Enter X and Y coordinate pairs
- View data in a tabular format
- Calculate statistical results:
  - Arithmetic means
  - Standard deviations
  - Pearson correlation coefficient
  - Interpretation of correlation
- Visualize data with a scatter plot
- View regression line for correlated data

## How to Use

1. Open `index.html` in your web browser.
2. Enter X and Y values in the input fields.
3. Click "Add" to add data points to the table.
4. Continue adding multiple data points (at least 2 are required).
5. Click "Calculate" to see statistical results and visualization.
6. Use the "Clear All" button to reset the application.

## Interpretation of Correlation

The Pearson correlation coefficient (r) ranges from -1 to 1:

- 0.0 to 0.3 (or -0.3 to 0.0): No correlation
- 0.3 to 0.5 (or -0.5 to -0.3): Weak correlation
- 0.5 to 0.7 (or -0.7 to -0.5): Moderate correlation
- 0.7 to 0.9 (or -0.9 to -0.7): Strong correlation
- 0.9 to 1.0 (or -1.0 to -0.9): Very strong correlation

A positive correlation means both variables increase together, while a negative correlation means one variable increases as the other decreases.

## Implementation

This application is implemented using:

- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas for data visualization

All statistical calculations are implemented manually without using any external libraries. 