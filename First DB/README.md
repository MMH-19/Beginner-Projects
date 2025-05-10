# Your First DB App

This is a simple application that demonstrates the use of IndexedDB in a web browser. It allows you to create, query, and clear a customer database.

## Features

- Load sample customer data into IndexedDB
- Query and display all customers
- Clear all customer data from the database
- View notifications and logs of operations

## How to Use

1. Open `index.html` in a modern web browser.
2. Use the control panel buttons to interact with the database:
   - **Load DB**: Populates the database with sample customer data
   - **Query DB**: Displays all customers in the database
   - **Clear DB**: Removes all customers from the database
3. View operation notifications in the Notification Panel
4. View detailed logs in the Log Panel
5. View query results in the Query Results area

## Browser Support

This application requires a browser that supports IndexedDB. Most modern browsers (Chrome, Firefox, Safari, Edge) support IndexedDB.

## Technical Details

- The application uses native browser IndexedDB API
- The customer data includes:
  - User ID
  - Name
  - Email
  - Last Order Date
  - Total Sales

## Learning Resources

If you're interested in learning more about IndexedDB, check out these resources:

- [IndexedDB Concepts (MDN)](http://tinyw.in/7TIr)
- [Using IndexedDB (MDN)](http://tinyw.in/w6k0)
- [IndexedDB API (MDN)](http://tinyw.in/GqnF)
- [IndexedDB Browser Support](https://caniuse.com/#feat=indexeddb) 