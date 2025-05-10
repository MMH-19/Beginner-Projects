document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('.generate-btn');
    const mealContainer = document.getElementById('meal');

    // Event listener for the generate button
    generateBtn.addEventListener('click', () => {
        fetchRandomMeal();
    });

    // Function to fetch random meal from API
    async function fetchRandomMeal() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            const meal = data.meals[0];
            
            displayMeal(meal);
        } catch (error) {
            console.error('Error fetching meal:', error);
            mealContainer.innerHTML = `<p class="error">Failed to fetch a meal. Please try again.</p>`;
        }
    }

    // Function to display meal data
    function displayMeal(meal) {
        // Get ingredients and measures
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim() !== '') {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }

        // HTML for meal display
        const html = `
            <div class="meal-item">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal-details">
                    <h2 class="meal-title">${meal.strMeal}</h2>
                    <div class="meal-info">
                        ${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ''}
                        ${meal.strArea ? `<p><strong>Origin:</strong> ${meal.strArea}</p>` : ''}
                    </div>
                    
                    <div class="meal-ingredients">
                        <h3>Ingredients:</h3>
                        <ul>
                            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="meal-instructions">
                        <h3>Instructions:</h3>
                        <p>${meal.strInstructions}</p>
                    </div>
                    
                    ${meal.strYoutube ? `
                    <div class="meal-video">
                        <h3>Video Recipe:</h3>
                        <iframe src="https://www.youtube.com/embed/${getYoutubeId(meal.strYoutube)}" allowfullscreen></iframe>
                    </div>` : ''}
                </div>
            </div>
        `;

        mealContainer.innerHTML = html;
    }

    // Helper function to extract YouTube video ID
    function getYoutubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : '';
    }

    // Fetch a random meal on initial load
    fetchRandomMeal();
}); 