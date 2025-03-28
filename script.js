// Éléments du DOM
const cityInput = document.getElementById('cityInput');
const okButton = document.getElementById('okButton');
const cityElement = document.getElementById('city');
const gpsElement = document.getElementById('gps');

// Événement de clic sur le bouton OK
okButton.addEventListener('click', () => {
    const cityName = cityInput.value;
    if (cityName) {
        getCoordinates(cityName);
    }
});

// bonus ajouté par mes soins: événement sur la touche entrée
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityName = cityInput.value;
        if (cityName) {
            getCoordinates(cityName);
        }
    }
});


async function getCoordinates(cityName) {
    try {
        // Configuration de la requête pour Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`, {
            headers: {
                'User-Agent': 'MiniStationMeteo/1.0 (votre-email@exemple.com)'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur de récupération des coordonnées');
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error('Ville non trouvée');
        }

        // Récupération des informations de la première correspondance
        const { lat, lon, display_name } = data[0];

        // Mise à jour des éléments du DOM
        const cityElement = document.getElementById('city');
        const gpsElement = document.getElementById('gps');
        cityElement.textContent = display_name;
        gpsElement.textContent = `Latitude: ${parseFloat(lat).toFixed(4)}° | Longitude: ${parseFloat(lon).toFixed(4)}°`;

        // Récupérer les données météo
        await getWeatherData(parseFloat(lat), parseFloat(lon));

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
}

// Fonction pour récupérer les données météorologiques
async function getWeatherData(latitude, longitude) {
    try {
        // Configuration de la requête pour Open-Meteo
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`);
        
        if (!response.ok) {
            throw new Error('Erreur de récupération des données météo');
        }

        const weatherData = await response.json();

        // Extraction des données actuelles
        const { temperature, windspeed, winddirection } = weatherData.current_weather;
        
        // Récupération des prévisions horaires
        const currentHour = new Date().getHours();
        const hourlyTemperatures = weatherData.hourly.temperature_2m;
        const hourlyHumidity = weatherData.hourly.relativehumidity_2m;

        // Mise à jour des éléments du DOM
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
        document.getElementById('temperature').textContent = '-°C';
        document.getElementById('details').textContent = 'Impossible de charger les données météo';
        return null;
    }
}

// Charger les données d'une ville par défaut au chargement
document.addEventListener('DOMContentLoaded', () => {
    getCoordinates('Paris');
});
