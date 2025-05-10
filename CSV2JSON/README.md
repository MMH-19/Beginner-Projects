# CSV2JSON Converter

A web application that allows conversion between CSV and JSON formats. This application fulfills the requirements specified in the [CSV2JSON App Challenge](CSV2JSON-App.md).

## Features

- Convert CSV to JSON and JSON to CSV
- Validate input for both formats
- Display error messages for invalid inputs
- Clear text fields with a single button
- Save and open files from the local file system
- Drag and drop CSV or JSON files directly into the application
- Dark mode support with theme toggle
- Modern UI with animations and visual feedback
- Responsive design for all device sizes

## How to Use

1. Open `index.html` in any modern web browser
2. To convert CSV to JSON:
   - Paste your CSV data in the left text area
   - Or drag and drop a CSV file into the left text area
   - Click the "Convert to JSON" button
   - View the resulting JSON in the right text area
3. To convert JSON to CSV:
   - Paste your JSON data in the right text area
   - Or drag and drop a JSON file into the right text area
   - Click the "Convert to CSV" button
   - View the resulting CSV in the left text area
4. File operations (for demonstration purposes):
   - Enter a file path in the input field
   - Click "Open" to load a file (simulated in this demo)
   - Click "Save" to download the current content

## CSV Format Requirements

- The first line must contain column headers
- All data rows must have the same number of fields as the header
- Fields are separated by commas
- Values containing commas should be quoted

## JSON Format Requirements

- Must be a valid JSON array of objects
- All objects should have the same structure

## Technical Details

- Pure HTML, CSS, and JavaScript
- No external libraries or frameworks
- Responsive design works on desktop and mobile devices
- File operations use browser's download capabilities for saving files

## Example Data

### CSV Example
```
name,age,city
John,30,New York
Alice,25,Boston
```

### JSON Example
```json
[
  {
    "name": "John",
    "age": 30,
    "city": "New York"
  },
  {
    "name": "Alice",
    "age": 25,
    "city": "Boston"
  }
]
```

## Limitations

- Nested JSON structures are not supported
- File operations are simulated in this web version 