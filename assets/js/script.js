const APIkey = "eaca71861ed45fe78b17a37097ba2475";
const searchHistory = document.querySelector('#searchHistory');
const today = document.querySelector('#today');
const forecast = document.querySelector('#forecast');
const searchFormEl = document.querySelector('#searchForm');
let cityInputEl = document.querySelector('#cityInput');
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

// create a card with the day's weather information for each day
function createWeatherCard(cityForecast) {
    const todayWeather = document.querySelector('#today');
    const weeklyForecast = document.querySelector('#forecast');
    const forecastHeader = document.createElement('h3');
    forecastHeader.textContent = '5-Day Forecast:'
    weeklyForecast.append(forecastHeader);

    for (let i = 0; i < 40; i += 8) {
        const card = document.createElement('div');
        const cardDate = document.createElement('h3');
        const cardTemp = document.createElement('p');
        const cardWind = document.createElement('p');
        const cardHumidity = document.createElement('p');
        let cityName = cityForecast.city.name;
        let dailyCityForecast = cityForecast.list[i];
        let date = dayjs(dailyCityForecast.dt_txt).format('M/D/YYYY');
        let temp = dailyCityForecast.main.temp;
        let wind = dailyCityForecast.wind.speed;
        let humidity = dailyCityForecast.main.humidity;
        let weatherIconId = dailyCityForecast.weather[0].icon;
        let weatherIconImg = document.createElement('img');
        weatherIconImg.setAttribute('src', `https://openweathermap.org/img/wn/${weatherIconId}.png`);
        cardDate.textContent = `${date}`;
        cardTemp.textContent = `Temp: ${temp}`;
        cardWind.textContent = `Wind: ${wind}`;
        cardHumidity.textContent = `Humidity: ${humidity}%`;
        card.append(cardDate, weatherIconImg, cardTemp, cardWind, cardHumidity);
        // todayWeather.append(card);
        if (i === 0) {
            cardDate.textContent = `${cityName} (${date})`;
            cardDate.append(weatherIconImg);
            todayWeather.append(card);
            card.setAttribute('class', 'today');
            
        } else {
            card.setAttribute('class', 'daily');
            console.log(`Date: ${date}`);
            console.log(`Temp: ${temp}`);
            console.log(`Wind: ${wind}`);
            console.log(`Humidity: ${humidity}%`)
            weeklyForecast.append(card);
        }

        console.log(`Date: ${date}`);
        console.log(`Temp: ${dailyCityForecast.main.temp}`);
        console.log(`Wind: ${dailyCityForecast.wind.speed}`);
        console.log(`Humidity: ${dailyCityForecast.main.humidity}%`);
        cityInputEl.value = '';
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