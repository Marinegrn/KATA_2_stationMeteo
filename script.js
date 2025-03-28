//const city = document.getElementById('cityInput');

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    // test de la requête pour la ville de Paris & de l'API -> OK
    // console.log(data); 
};

fetchData('https://nominatim.openstreetmap.org/search?q=Paris&format=json&addressdetails=1&limit=1');


