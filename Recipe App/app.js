// DOM Elements
const recipeList = document.getElementById('recipe-list');
const recipeDetails = document.getElementById('recipe-details');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// State variables
let currentRecipes = [...recipes]; // Start with default recipes
let savedRecipes = [...recipes]; // For storing user's saved recipes

// Initialize the app
function init() {
    renderRecipeList(currentRecipes);
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Render recipe list
function renderRecipeList(recipesToRender) {
    recipeList.innerHTML = '';
    
    if (recipesToRender.length === 0) {
        recipeList.innerHTML = '<p class="no-results">No recipes found</p>';
        return;
    }
    
    recipesToRender.forEach(recipe => {
        const li = document.createElement('li');
        li.textContent = recipe.title;
        li.setAttribute('data-id', recipe.id);
        
        li.addEventListener('click', () => {
            // Remove active class from all list items
            document.querySelectorAll('#recipe-list li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            li.classList.add('active');
            
            // Display recipe details
            displayRecipeDetails(recipe);
        });
        
        recipeList.appendChild(li);
    });
    
    // Display first recipe by default if available
    if (recipesToRender.length > 0) {
        const firstRecipe = recipesToRender[0];
        document.querySelector(`#recipe-list li[data-id="${firstRecipe.id}"]`)?.classList.add('active');
        displayRecipeDetails(firstRecipe);
    } else {
        recipeDetails.innerHTML = '<p class="placeholder-message">No recipes available</p>';
    }
}

// Display recipe details
function displayRecipeDetails(recipe) {
    // Create HTML structure for recipe details
    const recipeHTML = `
        <div class="recipe-header">
            <h2 class="recipe-title">${recipe.title}</h2>
            <div class="recipe-meta">
                <span class="meal-type">Meal: ${capitalizeFirstLetter(recipe.mealType)}</span>
                <span class="servings">Serves: ${recipe.servings}</span>
                <span class="difficulty">Difficulty: ${capitalizeFirstLetter(recipe.difficulty)}</span>
            </div>
        </div>
        
        ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">` : ''}
        
        <div class="ingredients-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
                ${recipe.ingredients.map(ingredient => `
                    <li>${ingredient.name}: ${ingredient.amount}</li>
                `).join('')}
            </ul>
        </div>
        
        <div class="steps-section">
            <h3>Instructions</h3>
            <ol class="steps-list">
                ${recipe.steps.map(step => `
                    <li>${step}</li>
                `).join('')}
            </ol>
        </div>
        
        ${recipe.source === 'API' ? `
            <button class="save-button" data-id="${recipe.id}">Save Recipe</button>
        ` : ''}
    `;
    
    // Set the HTML content
    recipeDetails.innerHTML = recipeHTML;
    
    // Add event listener to save button if present
    const saveButton = recipeDetails.querySelector('.save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => saveRecipe(recipe));
    }
}

// Handle search functionality
async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        // If search is empty, show saved recipes
        currentRecipes = [...savedRecipes];
        renderRecipeList(currentRecipes);
        return;
    }
    
    // Show loading state
    recipeDetails.innerHTML = '<p class="placeholder-message">Searching recipes...</p>';
    
    // Search API for recipes
    const apiResults = await searchMealsByName(searchTerm);
    
    if (apiResults.length === 0) {
        // No results found
        recipeDetails.innerHTML = '<p class="placeholder-message">No matching recipes found. Try a different search term.</p>';
        currentRecipes = [];
        renderRecipeList(currentRecipes);
    } else {
        // Convert API results to our recipe format
        const formattedResults = apiResults.map(meal => convertApiMealToRecipe(meal));
        currentRecipes = formattedResults;
        renderRecipeList(currentRecipes);
    }
}

// Save a recipe from API to saved recipes
function saveRecipe(recipe) {
    // Check if recipe already exists in savedRecipes
    const existingRecipeIndex = savedRecipes.findIndex(r => r.title === recipe.title);
    
    if (existingRecipeIndex === -1) {
        // Add to saved recipes
        savedRecipes.push({...recipe, source: undefined}); // Remove API source flag
        
        // Show success message
        const saveButton = recipeDetails.querySelector('.save-button');
        saveButton.textContent = 'Saved!';
        saveButton.disabled = true;
        
        // Optionally save to localStorage for persistence
        // localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
}

// Helper function to capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 