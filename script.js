const city = document.getElementById('cityInput');
const okButton = document.getElementById('okButton');

// test de la requête des coordonnées de la ville de Paris & Lyon -> OK
// async function fetchData(url) {
//     const response = await fetch(url);
//     const data = await response.json();
//      console.log(data); 
// };

// fetchData('https://nominatim.openstreetmap.org/search?q=Lyon&format=json&addressdetails=1&limit=1');

async function fetch(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        }   catch (error) {
        console.error('Error fetching data:', error);
    };
};

okButton.addEventListener('click', () => {
    const cityName = city.value;
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&addressdetails=1&limit=1`);
});




