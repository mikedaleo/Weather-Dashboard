const APIkey = "eaca71861ed45fe78b17a37097ba2475";
const today = document.querySelector('#today');
const forecast = document.querySelector('#forecast');
const searchFormEl = document.querySelector('#search-form');
let cityInputEl = document.querySelector('#city-input');
const searchButton = document.querySelector('#search-button')
dayjs().format()
const errorMessageDiv = document.createElement('div');
const weatherDiv = document.querySelector('#weather');
const todayWeather = document.querySelector('#today');
const weeklyForecast = document.querySelector('#forecast');
const fiveDayHeader = document.querySelector('#five-day');

// save search history to localStorage
function saveSearchHistory(cityToSave) {
    let storedSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let index = storedSearches.indexOf(cityToSave);
    if (index !== -1) {
        storedSearches.splice(index, 1);
    };
    storedSearches.push(cityToSave);
    if (storedSearches.length > 10) {
        storedSearches.splice(0, storedSearches.length - 10)
    }
    localStorage.setItem('searchHistory', JSON.stringify(storedSearches));
}

// load search history from localStorage
// function loadSearchHistory() {
//     const searchHistoryDiv = document.querySelector('#search-history');
//     let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
//     searchHistoryDiv.innerHTML = '';
//     searchHistory.forEach(search => {
//         const historyBtn = document.createElement('button');
//         historyBtn.textContent = search;
//         historyBtn.setAttribute('class', 'search-history');
//         searchHistoryDiv.append(historyBtn);
//         historyBtn.addEventListener('click', function() {
//             cityInputEl.value = search;
//             convertCityNameToCoords(search);
//         })
//     })
// }


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
            todayWeather.innerHTML = '';
            weeklyForecast.innerHTML = '';
            fiveDayHeader.innerHTML = '';
            errorMessageDiv.innerHTML = '';
        })
        .catch(function (error) {
            errorMessageDiv.innerHTML = '';
            errorMessageDiv.setAttribute('class', 'error-message');
            errorMessageDiv.textContent = 'Please enter a valid city name.';
            searchFormEl.append(errorMessageDiv);
            // alert('Please enter a valid city name.')
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
        .then(function (data) {
            // console.log(data);
            // console.log(data.city.name);
            // console.log(data.list[0])
            // console.log(`Temp: ${data.list[0].main.temp}`);
            // console.log(`Wind: ${data.list[0].wind.speed}`);
            // console.log(`Humidity: ${data.list[0].main.humidity}%`);
            createWeatherCard(data);
            saveSearchHistory(data.city.name);
        })

}

// create a card with the day's weather information for each day
function createWeatherCard(cityForecast) {
    fiveDayHeader.textContent = '5-Day Forecast:'

    for (let i = 0; i < 40; i += 7) {
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
        if (i === 0) {
            cardDate.textContent = `${cityName} (${date})`;
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

        // console.log(`Date: ${date}`);
        // console.log(`Temp: ${dailyCityForecast.main.temp}`);
        // console.log(`Wind: ${dailyCityForecast.wind.speed}`);
        // console.log(`Humidity: ${dailyCityForecast.main.humidity}%`);
        cityInputEl.value = '';
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    convertCityNameToCoords(city);
};


searchFormEl.addEventListener('submit', handleFormSubmit);
