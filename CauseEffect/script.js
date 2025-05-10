// Test data - People information
const people = [
    {
        name: "John Smith",
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        country: "USA",
        telephone: "(555) 123-4567",
        birthday: "January 15, 1985"
    },
    {
        name: "Emma Johnson",
        street: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        telephone: "(555) 987-6543",
        birthday: "March 22, 1990"
    },
    {
        name: "Michael Brown",
        street: "789 Pine Road",
        city: "Chicago",
        state: "IL",
        country: "USA",
        telephone: "(555) 456-7890",
        birthday: "October 8, 1978"
    },
    {
        name: "Sophia Garcia",
        street: "321 Maple Drive",
        city: "Miami",
        state: "FL",
        country: "USA",
        telephone: "(555) 234-5678",
        birthday: "July 30, 1992"
    },
    {
        name: "David Wilson",
        street: "654 Cedar Lane",
        city: "Seattle",
        state: "WA",
        country: "USA",
        telephone: "(555) 345-6789",
        birthday: "December 12, 1982"
    }
];

// DOM elements
const peopleListEl = document.getElementById('people-list');
const personDetailsEl = document.getElementById('person-details');
const detailPane = document.querySelector('.detail-pane');

// Function to populate the people list
function populatePeopleList() {
    people.forEach((person, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = person.name;
        
        // Add a slight delay to each item for a staggered animation effect
        listItem.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        listItem.style.opacity = '0';
        
        listItem.addEventListener('click', () => {
            displayPersonDetails(person);
            selectPerson(listItem);
        });
        peopleListEl.appendChild(listItem);
    });
}

// Function to display person details with animation
function displayPersonDetails(person) {
    // Add animation class for exit
    personDetailsEl.classList.add('fade-out');
    
    // Wait for exit animation to complete
    setTimeout(() => {
        // Update content
        personDetailsEl.innerHTML = `
            <div class="detail-item"><strong>Name:</strong> ${person.name}</div>
            <div class="detail-item"><strong>Address:</strong> ${person.street}, ${person.city}, ${person.state}, ${person.country}</div>
            <div class="detail-item"><strong>Telephone:</strong> ${person.telephone}</div>
            <div class="detail-item"><strong>Birthday:</strong> ${person.birthday}</div>
        `;
        
        // Remove exit class and add entrance animation
        personDetailsEl.classList.remove('fade-out');
        personDetailsEl.classList.add('fade-in');
        
        // Clean up animation classes after animation completes
        setTimeout(() => {
            personDetailsEl.classList.remove('fade-in');
        }, 300);
    }, 150);
}

// Function to handle selection effect
function selectPerson(selectedItem) {
    // Remove selection from all items
    const allItems = peopleListEl.querySelectorAll('li');
    allItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to the clicked item
    selectedItem.classList.add('selected');
}

// Add CSS classes for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-in forwards;
        }
        
        .fade-out {
            opacity: 0;
            transform: translateX(10px);
            transition: opacity 0.15s ease-out, transform 0.15s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Initialize the app
function init() {
    addAnimationStyles();
    populatePeopleList();
    
    // Show a welcome message that fades out after a few seconds
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.textContent = 'Welcome to CauseEffect App! Click on a person to view their details.';
    document.querySelector('.container').prepend(welcomeMessage);
    
    setTimeout(() => {
        welcomeMessage.style.opacity = '0';
        setTimeout(() => welcomeMessage.remove(), 500);
    }, 3000);
}

// Run the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 