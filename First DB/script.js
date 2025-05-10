class Customer {
  constructor(dbName) {
    this.dbName = dbName;
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. \
        Such and such feature will not be available.");
    }
  }

  /**
   * Remove all rows from the database
   * @memberof Customer
   */
  removeAllRows = () => {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = (event) => {
      console.log('removeAllRows - Database error: ', event.target.error.code,
        " - ", event.target.error.message);
      logMessage(`removeAllRows - Database error: ${event.target.error.code} - ${event.target.error.message}`);
    };

    request.onsuccess = (event) => {
      console.log('Deleting all customers...');
      logMessage('Deleting all customers...');
      const db = event.target.result;
      const txn = db.transaction('customers', 'readwrite');
      txn.onerror = (event) => {
        console.log('removeAllRows - Txn error: ', event.target.error.code,
          " - ", event.target.error.message);
        logMessage(`removeAllRows - Txn error: ${event.target.error.code} - ${event.target.error.message}`);
      };
      txn.oncomplete = (event) => {
        console.log('All rows removed!');
        logMessage('All rows removed!');
        notify('All customers have been removed from the database');
      };
      const objectStore = txn.objectStore('customers');
      const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = (event) => {
        getAllKeysRequest.result.forEach(key => {
          objectStore.delete(key);
        });
      }
    }
  }

  /**
   * Populate the Customer database with an initial set of customer data
   * @param {[object]} customerData Data to add
   * @memberof Customer
   */
  initialLoad = (customerData) => {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = (event) => {
      console.log('initialLoad - Database error: ', event.target.error.code,
        " - ", event.target.error.message);
      logMessage(`initialLoad - Database error: ${event.target.error.code} - ${event.target.error.message}`);
    };

    request.onupgradeneeded = (event) => {
      console.log('Populating customers...');
      logMessage('Populating customers...');
      const db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
      objectStore.onerror = (event) => {
        console.log('initialLoad - objectStore error: ', event.target.error.code,
          " - ", event.target.error.message);
        logMessage(`initialLoad - objectStore error: ${event.target.error.code} - ${event.target.error.message}`);
      };

      // Create an index to search customers by name and email
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });

      // Populate the database with the initial set of rows
      customerData.forEach(function(customer) {
        objectStore.put(customer);
      });
      db.close();
    };
    
    request.onsuccess = (event) => {
      console.log('Database initialized successfully');
      logMessage('Database initialized successfully');
      notify('Customer database has been loaded with initial data');
    };
  }
  
  /**
   * Query all rows from the database
   * @memberof Customer
   * @returns {Promise} Promise resolving to an array of customers
   */
  queryAllRows = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = (event) => {
        console.log('queryAllRows - Database error: ', event.target.error.code,
          " - ", event.target.error.message);
        logMessage(`queryAllRows - Database error: ${event.target.error.code} - ${event.target.error.message}`);
        reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
        console.log('Querying all customers...');
        logMessage('Querying all customers...');
        const db = event.target.result;
        
        // If the object store doesn't exist yet
        if (!db.objectStoreNames.contains('customers')) {
          console.log('No customers object store found');
          logMessage('No customers object store found');
          resolve([]);
          return;
        }
        
        const txn = db.transaction('customers', 'readonly');
        
        txn.onerror = (event) => {
          console.log('queryAllRows - Txn error: ', event.target.error.code,
            " - ", event.target.error.message);
          logMessage(`queryAllRows - Txn error: ${event.target.error.code} - ${event.target.error.message}`);
          reject(event.target.error);
        };
        
        const objectStore = txn.objectStore('customers');
        const getAllRequest = objectStore.getAll();
        
        getAllRequest.onsuccess = (event) => {
          resolve(getAllRequest.result);
        };
        
        getAllRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };
    });
  }
}

// Web page event handlers
const DBNAME = 'customer_db';

// DOM Elements
const loadDBBtn = document.getElementById('loadDB');
const queryDBBtn = document.getElementById('queryDB');
const clearDBBtn = document.getElementById('clearDB');
const notificationPanel = document.getElementById('notificationPanel');
const logPanel = document.getElementById('logPanel');
const queryResults = document.getElementById('queryResults');

/**
 * Clear all customer data from the database
 */
const clearDB = () => {
  console.log('Delete all rows from the Customers database');
  showLoading('Clearing database...');
  
  // Disable all buttons during operation
  setButtonsState(false);
  
  let customer = new Customer(DBNAME);
  customer.removeAllRows();
  
  // Simulate a slight delay for the operation to complete visually
  setTimeout(() => {
    hideLoading();
    // Update button states
    loadDBBtn.disabled = false;
    queryDBBtn.disabled = false;
    clearDBBtn.disabled = true;
    
    notify('All customers have been removed from the database');
    animateElement(notificationPanel);
  }, 800);
}

/**
 * Add customer data to the database
 */
const loadDB = () => {
  console.log('Load the Customers database');
  showLoading('Loading database...');
  
  // Disable all buttons during operation
  setButtonsState(false);

  // Customers to add to initially populate the database with
  const customerData = [
    { userid: '444', name: 'Bill', email: 'bill@company.com', lastOrder: '2023-09-15', totalSales: 1250.50 },
    { userid: '555', name: 'Donna', email: 'donna@home.org', lastOrder: '2023-10-22', totalSales: 875.25 }
  ];
  let customer = new Customer(DBNAME);
  customer.initialLoad(customerData);
  
  // Simulate a slight delay for the operation to complete visually
  setTimeout(() => {
    hideLoading();
    // Update button states
    loadDBBtn.disabled = true;
    queryDBBtn.disabled = false;
    clearDBBtn.disabled = false;
  }, 800);
}

/**
 * Query the database and display results
 */
const queryDB = async () => {
  console.log('Query all customers from the database');
  showLoading('Querying database...');
  
  // Disable all buttons during operation
  setButtonsState(false);
  
  let customer = new Customer(DBNAME);
  try {
    const customers = await customer.queryAllRows();
    
    // Add a slight delay for visual effect
    setTimeout(() => {
      hideLoading();
      // Re-enable buttons
      setButtonsState(true);
      loadDBBtn.disabled = true;
      
      // Display results
      if (customers.length === 0) {
        queryResults.innerHTML = '<div class="no-results">No customers found in the database</div>';
        notify('Query completed: No customers found');
      } else {
        let tableHTML = `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Last Order</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        customers.forEach((customer, index) => {
          tableHTML += `
            <tr style="animation-delay: ${index * 0.05}s">
              <td>${customer.userid}</td>
              <td>${customer.name}</td>
              <td>${customer.email}</td>
              <td>${customer.lastOrder || 'N/A'}</td>
              <td>${customer.totalSales ? '$' + customer.totalSales.toFixed(2) : 'N/A'}</td>
            </tr>
          `;
        });
        
        tableHTML += `
            </tbody>
          </table>
        `;
        
        queryResults.innerHTML = tableHTML;
        animateElement(queryResults);
        notify(`Query completed: ${customers.length} customers found`);
      }
    }, 800);
  } catch (error) {
    console.error('Error querying database:', error);
    hideLoading();
    setButtonsState(true);
    loadDBBtn.disabled = true;
    logMessage(`Error querying database: ${error.message}`);
    notify('Error occurred while querying the database');
  }
}

/**
 * Show loading indicator with message
 * @param {string} message Loading message to display
 */
const showLoading = (message) => {
  const loadingMessage = `<div class="loading-indicator"></div>${message}`;
  notify(loadingMessage);
}

/**
 * Hide loading indicator
 */
const hideLoading = () => {
  // The next notification will replace the loading one
}

/**
 * Set state for all buttons
 * @param {boolean} enabled Whether buttons should be enabled
 */
const setButtonsState = (enabled) => {
  loadDBBtn.disabled = !enabled;
  queryDBBtn.disabled = !enabled;
  clearDBBtn.disabled = !enabled;
}

/**
 * Add notification message to the notification panel
 * @param {string} message Message to display
 */
const notify = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
  
  // Add notification with animation
  notificationPanel.appendChild(notification);
  notificationPanel.scrollTop = notificationPanel.scrollHeight;
  
  // Add to log as well
  logMessage(message);
}

/**
 * Animate element with attention-grabbing effect
 * @param {HTMLElement} element Element to animate
 */
const animateElement = (element) => {
  element.style.animation = 'none';
  element.offsetHeight; // Trigger reflow
  element.style.animation = 'fadeIn 0.5s ease-in-out';
}

/**
 * Add log message to the log panel
 * @param {string} message Message to log
 */
const logMessage = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
  logPanel.appendChild(logEntry);
  logPanel.scrollTop = logPanel.scrollHeight;
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Button event listeners
  loadDBBtn.addEventListener('click', loadDB);
  queryDBBtn.addEventListener('click', queryDB);
  clearDBBtn.addEventListener('click', clearDB);
  
  // Add hover effect to panels
  document.querySelectorAll('.panel').forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      panel.style.transform = 'translateY(-5px)';
    });
    
    panel.addEventListener('mouseleave', () => {
      panel.style.transform = 'translateY(0)';
    });
  });
  
  // Initial message with animation
  setTimeout(() => {
    notify('Application initialized');
    logMessage('Application ready. Click "Load DB" to populate the database with initial data.');
  }, 300);
}); 