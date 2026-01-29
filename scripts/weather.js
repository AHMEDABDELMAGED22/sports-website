const weatherApiKey = '535f0e4b49f7b9e3cf92fe8073e48ec9'; // OpenWeatherMap Key

const searchInput = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const currentWeatherEl = document.getElementById('currentWeather');
const weatherDetailsEl = document.getElementById('weatherDetails');
const forecastGridEl = document.getElementById('forecastGrid');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) fetchWeatherByCity(city);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) fetchWeatherByCity(city);
    }
});

currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

// Initial Load (Default City or stored)
window.addEventListener('DOMContentLoaded', () => {
    fetchWeatherByCity('London');
});

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherByCoords(lat, lon);
}

function error() {
    alert('Unable to retrieve your location');
}

async function fetchWeatherByCity(city) {
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

        updateCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
        const data = await response.json();

        updateCurrentWeather(data);
        fetchForecast(lat, lon);
    } catch (error) {
        showError(error.message);
    }
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
        const data = await response.json();
        updateForecast(data.list);
    } catch (error) {
        console.error('Forecast error:', error);
    }
}

function updateCurrentWeather(data) {
    const { name, sys, main, weather, wind, visibility } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

    currentWeatherEl.innerHTML = `
        <div class="weather-main">
            <div class="location-info">
                <h1>${name}, ${sys.country}</h1>
                <p><i class="fa-solid fa-calendar"></i> ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <div class="feels-like">Feels like ${Math.round(main.feels_like)}°C</div>
            </div>
            
            <div class="weather-icon-large">
                <img src="${iconUrl}" alt="${weather[0].description}">
                <p>${weather[0].description}</p>
            </div>
            
            <div class="temp-info">
                <div class="temp-main">${Math.round(main.temp)}°C</div>
            </div>
        </div>
    `;

    // Update Details Grid
    weatherDetailsEl.innerHTML = `
        <div class="detail-card">
            <div class="detail-card-header">
                <i class="fa-solid fa-droplet"></i>
                <span>Humidity</span>
            </div>
            <div class="detail-card-value">${main.humidity}%</div>
            <div class="detail-card-label">The dew point is ${Math.round(main.temp - ((100 - main.humidity) / 5))}°C</div>
        </div>
        
        <div class="detail-card">
            <div class="detail-card-header">
                <i class="fa-solid fa-wind"></i>
                <span>Wind</span>
            </div>
            <div class="detail-card-value">${Math.round(wind.speed * 3.6)} km/h</div>
            <div class="detail-card-label">Direction: ${getWindDirection(wind.deg)}</div>
        </div>
        
        <div class="detail-card">
            <div class="detail-card-header">
                <i class="fa-solid fa-eye"></i>
                <span>Visibility</span>
            </div>
            <div class="detail-card-value">${(visibility / 1000).toFixed(1)} km</div>
            <div class="detail-card-label">Clear view ahead</div>
        </div>
        
        <div class="detail-card">
            <div class="detail-card-header">
                <i class="fa-solid fa-compress"></i>
                <span>Pressure</span>
            </div>
            <div class="detail-card-value">${main.pressure} hPa</div>
            <div class="detail-card-label">Atmospheric pressure</div>
        </div>
    `;
}

function updateForecast(forecastList) {
    // Filter to get one forecast per day (approx 12:00 PM)
    const dailyForecasts = forecastList.filter(item => item.dt_txt.includes('12:00:00'));

    forecastGridEl.innerHTML = dailyForecasts.slice(0, 5).map(day => `
        <div class="forecast-card">
            <div class="forecast-day">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="forecast-date">${new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather">
            </div>
            <div class="forecast-temp">
                <span class="temp-max">${Math.round(day.main.temp_max)}°</span>
                <span class="temp-min">${Math.round(day.main.temp_min)}°</span>
            </div>
            <div class="forecast-desc">${day.weather[0].main}</div>
        </div>
    `).join('');
}

function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

function showLoading() {
    currentWeatherEl.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Loading weather data...</p>
        </div>
    `;
}

function showError(message) {
    currentWeatherEl.innerHTML = `
        <div class="error-state">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>${message}</p>
        </div>
    `;
}
