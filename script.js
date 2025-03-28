const cityInput = document.getElementById('cityInput');
const okButton = document.getElementById('okButton');
const cityElement = document.getElementById('city');
const gpsElement = document.getElementById('gps');

okButton.addEventListener('click', () => {
    const cityName = cityInput.value;
    if (cityName) {
        fetchCoordinates(cityName);
    }
});

// bonus ajouté par mes soins: événement sur la touche entrée
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cityName = cityInput.value;
        if (cityName) {
            fetchCoordinates(cityName);
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCoordinates('');
    cityInput.value = '';
    document.getElementById('city').textContent = "Entrez le nom d'une ville";
    document.getElementById('gps').textContent = '';
    document.getElementById('temperature').textContent = '--°C';
    document.getElementById('details').textContent = 'Chargement des données...'
});



async function fetchCoordinates(cityName) {
    try {  
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);

        if (!response.ok) {
            throw new Error('Erreur de récupération des coordonnées')
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error('Ville non trouvée')
        }
     
        const { lat, lon, display_name } = data[0];
        const cityElement = document.getElementById('city');
        const gpsElement = document.getElementById('gps');
        cityElement.textContent = display_name;
        gpsElement.textContent = `Latitude: ${parseFloat(lat).toFixed(4)}° | Longitude: ${parseFloat(lon).toFixed(4)}°`;

        await fetchWeather(parseFloat(lat), parseFloat(lon));

        return { 
            lat: parseFloat(lat), 
            lon: parseFloat(lon), 
            name: display_name 
        };
        
    } catch (error) {
        console.error('Erreur:', error.message);
        document.getElementById('city').textContent = 'Ville non trouvée';
        document.getElementById('gps').textContent = '';
        document.getElementById('temperature').textContent = '-°C';
        document.getElementById('details').textContent = 'Erreur de recherche';
        return null;
    }
};

// Fonction pour récupérer les données météorologiques
async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`);
        
        if (!response.ok) {
            throw new Error('Erreur de récupération des données météo')
        }

        const weatherData = await response.json();
        const { temperature, windspeed, winddirection } = weatherData.current_weather;
        
        const currentHour = new Date().getHours();
        const hourlyTemperatures = weatherData.hourly.temperature_2m;
        const hourlyHumidity = weatherData.hourly.relativehumidity_2m;

        const temperatureElement = document.getElementById('temperature');
        const detailsElement = document.getElementById('details');

        temperatureElement.textContent = `${temperature}°C`;
        detailsElement.innerHTML = `
            Vent : ${windspeed} km/h (direction : ${winddirection}°)<br>
            Humidité : ${hourlyHumidity[currentHour]}%<br>
            Temp. horaire : ${hourlyTemperatures[currentHour]}°C
        `;

        return weatherData;

    } catch (error) {
        console.error('Erreur météo:', error.message);
        document.getElementById('temperature').textContent = '--°C';
        document.getElementById('details').textContent = 'Impossible de charger les données météo';
        return null;
    }
};

