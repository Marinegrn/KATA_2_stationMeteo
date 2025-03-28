//const city = document.getElementById('cityInput');

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    // test de la requête des coordonnées de la ville de Paris & Lyon -> OK
     console.log(data); 
};

fetchData('https://nominatim.openstreetmap.org/search?q=Lyon&format=json&addressdetails=1&limit=1');


