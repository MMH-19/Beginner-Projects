// Sample recipe data
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        mealType: "lunch",
        servings: 4,
        difficulty: "intermediate",
        ingredients: [
            { name: "Spaghetti", amount: "400g" },
            { name: "Pancetta or Guanciale", amount: "150g" },
            { name: "Egg Yolks", amount: "4" },
            { name: "Grated Pecorino Romano", amount: "50g" },
            { name: "Grated Parmesan", amount: "50g" },
            { name: "Black Pepper", amount: "To taste" },
            { name: "Salt", amount: "To taste" }
        ],
        steps: [
            "Bring a large pot of salted water to boil and cook the spaghetti according to package instructions until al dente.",
            "While the pasta is cooking, heat a large skillet over medium heat. Add the diced pancetta and cook until crispy, about 5-7 minutes.",
            "In a mixing bowl, whisk together the egg yolks, grated cheeses, and a generous amount of black pepper.",
            "When the pasta is done, reserve 1 cup of pasta water, then drain the pasta.",
            "Working quickly, add the hot pasta to the skillet with the pancetta, tossing to combine. Remove from heat.",
            "Add the egg and cheese mixture to the pasta, stirring vigorously to coat the pasta and create a creamy sauce. If needed, add a splash of the reserved pasta water to loosen the sauce.",
            "Serve immediately with extra grated cheese and black pepper on top."
        ],
        image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Fluffy Pancakes",
        mealType: "breakfast",
        servings: 4,
        difficulty: "beginner",
        ingredients: [
            { name: "All-Purpose Flour", amount: "2 cups" },
            { name: "Sugar", amount: "3 tbsp" },
            { name: "Baking Powder", amount: "1 tbsp" },
            { name: "Salt", amount: "1/2 tsp" },
            { name: "Milk", amount: "1 1/2 cups" },
            { name: "Eggs", amount: "2" },
            { name: "Butter, melted", amount: "1/4 cup" },
            { name: "Vanilla Extract", amount: "1 tsp" }
        ],
        steps: [
            "In a large bowl, whisk together the flour, sugar, baking powder, and salt.",
            "In another bowl, beat the eggs, then add milk, melted butter, and vanilla extract. Mix well.",
            "Pour the wet ingredients into the dry ingredients and stir until just combined. Some lumps are okay.",
            "Heat a lightly oiled griddle or frying pan over medium-high heat.",
            "For each pancake, pour approximately 1/4 cup of batter onto the griddle.",
            "Cook until bubbles form on the surface and the edges look dry, about 2-3 minutes.",
            "Flip and cook until browned on the other side, about 1-2 minutes more.",
            "Serve hot with butter, maple syrup, fresh fruit, or your favorite toppings."
        ],
        image: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Classic Beef Stew",
        mealType: "dinner",
        servings: 6,
        difficulty: "intermediate",
        ingredients: [
            { name: "Beef Chuck", amount: "2 lbs, cut into 1-inch cubes" },
            { name: "All-Purpose Flour", amount: "3 tbsp" },
            { name: "Olive Oil", amount: "2 tbsp" },
            { name: "Onions", amount: "2 medium, diced" },
            { name: "Garlic", amount: "3 cloves, minced" },
            { name: "Carrots", amount: "3 large, cut into chunks" },
            { name: "Potatoes", amount: "4 medium, quartered" },
            { name: "Beef Broth", amount: "4 cups" },
            { name: "Tomato Paste", amount: "2 tbsp" },
            { name: "Bay Leaves", amount: "2" },
            { name: "Thyme", amount: "1 tsp dried" },
            { name: "Salt and Pepper", amount: "To taste" }
        ],
        steps: [
            "Season beef with salt and pepper, then coat in flour, shaking off excess.",
            "In a large pot or Dutch oven, heat olive oil over medium-high heat. Add beef in batches and brown on all sides. Transfer to a plate.",
            "In the same pot, add onions and cook until softened, about 3 minutes. Add garlic and cook for 1 minute more.",
            "Return beef to the pot. Add beef broth, tomato paste, bay leaves, and thyme. Bring to a boil, then reduce heat to low, cover, and simmer for 1 hour.",
            "Add carrots and potatoes to the pot. Continue simmering, covered, for another 45-60 minutes, until meat and vegetables are tender.",
            "If the stew is too thin, mix 1 tbsp flour with 1 tbsp water and stir into the stew to thicken.",
            "Adjust seasoning with salt and pepper. Remove bay leaves before serving.",
            "Serve hot with crusty bread."
        ],
        image: "https://s23209.pcdn.co/wp-content/uploads/2020/03/Best-Ever-Beef-StewIMG_1367.jpg"
    },
    {
        id: 4,
        title: "Chocolate Chip Cookies",
        mealType: "snack",
        servings: 24,
        difficulty: "beginner",
        ingredients: [
            { name: "All-Purpose Flour", amount: "2 1/4 cups" },
            { name: "Baking Soda", amount: "1 tsp" },
            { name: "Salt", amount: "1 tsp" },
            { name: "Unsalted Butter", amount: "1 cup, softened" },
            { name: "Brown Sugar", amount: "3/4 cup" },
            { name: "Granulated Sugar", amount: "3/4 cup" },
            { name: "Vanilla Extract", amount: "1 tsp" },
            { name: "Eggs", amount: "2 large" },
            { name: "Chocolate Chips", amount: "2 cups" }
        ],
        steps: [
            "Preheat oven to 375°F (190°C).",
            "In a small bowl, whisk together flour, baking soda, and salt.",
            "In a large bowl, cream together butter, brown sugar, and granulated sugar until smooth.",
            "Beat in vanilla extract, then add eggs one at a time, beating well after each addition.",
            "Gradually blend the dry ingredients into the wet ingredients.",
            "Stir in the chocolate chips by hand.",
            "Drop rounded tablespoons of dough onto ungreased baking sheets, spacing them about 2 inches apart.",
            "Bake for 9-11 minutes, or until golden brown.",
            "Allow cookies to cool on baking sheet for 2 minutes, then transfer to wire racks to cool completely."
        ],
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Fresh Garden Salad",
        mealType: "lunch",
        servings: 4,
        difficulty: "beginner",
        ingredients: [
            { name: "Mixed Salad Greens", amount: "8 cups" },
            { name: "Cherry Tomatoes", amount: "1 cup, halved" },
            { name: "Cucumber", amount: "1 medium, sliced" },
            { name: "Red Onion", amount: "1/2 small, thinly sliced" },
            { name: "Bell Pepper", amount: "1, diced" },
            { name: "Carrots", amount: "2, grated" },
            { name: "Avocado", amount: "1 ripe, diced" },
            { name: "Olive Oil", amount: "3 tbsp" },
            { name: "Lemon Juice", amount: "2 tbsp" },
            { name: "Dijon Mustard", amount: "1 tsp" },
            { name: "Honey", amount: "1 tsp" },
            { name: "Salt and Pepper", amount: "To taste" }
        ],
        steps: [
            "In a large salad bowl, combine the salad greens, cherry tomatoes, cucumber, red onion, bell pepper, and carrots.",
            "For the dressing, whisk together olive oil, lemon juice, Dijon mustard, honey, salt, and pepper in a small bowl.",
            "Just before serving, add the diced avocado to the salad.",
            "Drizzle the dressing over the salad and toss gently to coat.",
            "Serve immediately as a side dish or add protein like grilled chicken or chickpeas for a complete meal."
        ],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
    }
];

// API functions for meal search
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

// Function to search meals by name
async function searchMealsByName(name) {
    try {
        const response = await fetch(`${API_BASE_URL}search.php?s=${encodeURIComponent(name)}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Error searching for meals:', error);
        return [];
    }
}

// Function to convert API meal to our format
function convertApiMealToRecipe(apiMeal) {
    // Extract ingredients and their measures from the API response
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = apiMeal[`strIngredient${i}`];
        const measure = apiMeal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push({
                name: ingredient,
                amount: measure || 'To taste'
            });
        }
    }

    // Split instructions into steps
    const steps = apiMeal.strInstructions
        .split(/\r\n|\r|\n/)
        .filter(step => step.trim() !== '')
        .map(step => step.trim());

    // Create recipe object in our format
    return {
        id: Date.now(), // Generate a unique ID
        title: apiMeal.strMeal,
        mealType: determineMealType(apiMeal.strCategory),
        servings: 4, // Default value as API doesn't provide this
        difficulty: "intermediate", // Default value as API doesn't provide this
        ingredients: ingredients,
        steps: steps,
        image: apiMeal.strMealThumb,
        source: 'API'
    };
}

// Helper function to determine meal type based on category
function determineMealType(category) {
    const breakfastCategories = ['Breakfast', 'Pancake'];
    const lunchCategories = ['Pasta', 'Seafood', 'Vegetarian', 'Salad', 'Side'];
    const dinnerCategories = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Goat', 'Vegan'];
    
    if (breakfastCategories.includes(category)) return 'breakfast';
    if (lunchCategories.includes(category)) return 'lunch';
    if (dinnerCategories.includes(category)) return 'dinner';
    
    return 'snack'; // Default
} 