// API Key for WeatherAPI.com - You need to sign up and get your own key
const API_KEY = '94afe25ee54744019d5150629250104'; // Replace with your actual API key
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherContainer = document.getElementById('weather-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const cityEl = document.getElementById('city');
const regionCountryEl = document.getElementById('region-country');
const temperatureEl = document.getElementById('temperature');
const feelsLikeEl = document.getElementById('feels-like');
const weatherIconEl = document.getElementById('weather-icon');
const conditionTextEl = document.getElementById('condition-text');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const precipitationEl = document.getElementById('precipitation');
const forecastContainer = document.getElementById('forecast-container');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Initialize with a default city
window.addEventListener('load', () => {
  getWeatherData('London');
});

// Function to handle search
function handleSearch() {
  const city = searchInput.value.trim();
  if (city) {
    getWeatherData(city);
    searchInput.value = '';
  }
}

// Function to fetch weather data
async function getWeatherData(city) {
  try {
    // Show loading state
    showLoading();
    
    // Fetch weather data
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes`);
    
    if (!response.ok) {
      throw new Error('Location not found. Please try again!');
    }
    
    const data = await response.json();
    
    // Update UI with the fetched data
    updateWeatherUI(data);
    
    // Hide error container if it was visible
    errorContainer.classList.add('hidden');
    
    // Show weather container
    weatherContainer.classList.remove('hidden');
  } catch (error) {
    // Show error message
    errorMessage.textContent = error.message;
    errorContainer.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
  }
}

// Function to show loading state
function showLoading() {
  // For now, we'll just disable the search button
  searchBtn.disabled = true;
  
  // You could add a loading spinner here
  
  // Re-enable after a short delay
  setTimeout(() => {
    searchBtn.disabled = false;
  }, 1000);
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
  // Update location info
  cityEl.textContent = data.location.name;
  regionCountryEl.textContent = `${data.location.region}, ${data.location.country}`;
  
  // Update current weather
  const current = data.current;
  temperatureEl.textContent = `${Math.round(current.temp_c)}°C`;
  feelsLikeEl.textContent = `Feels like: ${Math.round(current.feelslike_c)}°C`;
  weatherIconEl.src = `https:${current.condition.icon}`;
  conditionTextEl.textContent = current.condition.text;
  
  // Update weather details
  windEl.textContent = `${current.wind_kph} km/h`;
  humidityEl.textContent = `${current.humidity}%`;
  precipitationEl.textContent = `${current.precip_mm} mm`;
  
  // Update forecast
  updateForecast(data.forecast.forecastday);
}

// Function to update the forecast section
function updateForecast(forecastData) {
  // Clear previous forecast
  forecastContainer.innerHTML = '';
  
  // Add forecast for the next 3 days (hourly for first day)
  const todayHours = forecastData[0].hour;
  
  // Get current hour
  const currentHour = new Date().getHours();
  
  // Display next 8 hours of forecast from current hour
  for (let i = currentHour; i < currentHour + 8; i++) {
    const hourIndex = i % 24; // Wrap around to next day if needed
    const hourData = todayHours[hourIndex];
    
    if (hourData) {
      const time = new Date(hourData.time).getHours();
      const displayTime = time === 0 ? '12 AM' : time < 12 ? `${time} AM` : time === 12 ? '12 PM' : `${time - 12} PM`;
      
      const forecastCard = document.createElement('div');
      forecastCard.classList.add('forecast-card');
      
      forecastCard.innerHTML = `
        <p class="time">${displayTime}</p>
        <img src="https:${hourData.condition.icon}" alt="${hourData.condition.text}">
        <p class="temp">${Math.round(hourData.temp_c)}°C</p>
      `;
      
      forecastContainer.appendChild(forecastCard);
    }
  }
}

// Function to toggle between Celsius and Fahrenheit (bonus feature)
function toggleTemperatureUnit() {
  // This could be implemented as an extension
} 