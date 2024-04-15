const APIkey = "eaca71861ed45fe78b17a37097ba2475";
const searchHistory = document.querySelector('#searchHistory');
const today = document.querySelector('#today');
const forecast = document.querySelector('#forecast');
const searchFormEl = document.querySelector('#searchForm');
const cityInputEl = document.querySelector('#cityInput');
const searchButton = document.querySelector('#searchButton')
dayjs().format()




// geocoding API - converting zip code to coordinates
// `http://api.openweathermap.org/geo/1.0/zip?zip=E14,GB&appid=${APIkey}`


// covert the city name into lat/lon coordinates
function convertCityNameToCoords(city) {
    // geocoding API - converting city name to coordinates
    const coordURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}`;

    fetch(coordURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log(lat);
            console.log(lon);
            // 5 day forecast API
            let cityURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`
            // get weather forecast of cityURL;
            getWeatherData(cityURL);
        })
        .catch(function (error) {
            console.log(error);
        })
};

// get weather data from the URL containing lat/lon
function getWeatherData(cityURL) {
    console.log(cityURL);

    fetch(cityURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (cityForecast) {
            console.log(cityForecast);
            console.log(cityForecast.city.name);
            console.log(cityForecast.list[0])
            console.log(`Temp: ${cityForecast.list[0].main.temp}`);
            console.log(`Wind: ${cityForecast.list[0].wind.speed}`);
            console.log(`Humidity: ${cityForecast.list[0].main.humidity}%`);
            createWeatherCard(cityForecast);
        })

}

function createWeatherCard(cityForecast) {

    for (let i = 0; i < 40; i += 8) {
        const todayForecast = document.querySelector()
        let dailyCityForecast = cityForecast.list[i];
        let date = dayjs(dailyCityForecast.dt_txt).format('M/D/YYYY');
        console.log(`Date: ${date}`);
        console.log(`Temp: ${dailyCityForecast.main.temp}`);
        console.log(`Wind: ${dailyCityForecast.wind.speed}`);
        console.log(`Humidity: ${dailyCityForecast.main.humidity}%`);
    }
}



// function searchForecast(city) {
//     let cityURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=imperial&appid=${APIkey}`;

//     fetch(cityURL)
//         .then(function (response) {
//             if (!response.ok) {
//                 throw response.json();
//             }
//             return response.json();
//         })
//         .then(function (cityForecast){
//             console.log(cityForecast);
//             console.log(cityForecast.city.name);
//             console.log(cityForecast.list[0])
//             console.log(`Temp: ${cityForecast.list[0].main.temp}`);
//             console.log(`Wind: ${cityForecast.list[0].wind.speed}`);
//             console.log(`Humidity: ${cityForecast.list[0].main.humidity}%`);
//         })

// }

function handleFormSubmit(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    // searchForecast(city);
    convertCityNameToCoords(city);
};

// get parameters of the query search 
function getParams() {

}

searchButton.addEventListener('click', handleFormSubmit);

// `http://api.openweathermap.org/data/2.5/weather?q=New-York&limit=5&appid=eaca71861ed45fe78b17a37097ba2475`