var weatherFormEl = document.querySelector('#weather-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#cityname');
var repoContainerEl = document.querySelector('#weatherparams-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
const myKey = '3647b99d321bbf401a1d1e6e104ff888';

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = nameInputEl.value.trim();

  if (cityname) {
    getCityWeather(cityname);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a city');
  }
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = '';
  }
};

var getCityWeather = function (city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&only_current=true&exclude=hourly&appid=${myKey}&cnt=1`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
    } else {
        alert('Error: ' + response.statusText);
      }
        return response.json();
    })
        .then(function (data) {
          console.log(data);
          //if response was ok then  get the latitud and longitud for quering daily
          getDailyWeather(data);
        })
    .catch(function (error) {
      alert('Unable to connect'+error);
    });
};

var getDailyWeather = function (weatherResults) {
    let lat = weatherResults.city.coord.lat;
    let lon = weatherResults.city.coord.lon;
    var apiUrlDaily = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly&appid=${myKey}`;
    fetch(apiUrlDaily).then(function (response) {
        if (response.ok){
            response.json().then(function (data) {
            console.log("new response DAILY");
            console.log(data);
            displayWeather(data);
        });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

var displayWeather = function (weatherParams, searchTerm) {
    repoSearchTerm.textContent = searchTerm;
    // in roder to display five day forecast may have to reduce three out of eight days
    for (var i = 0; i < weatherParams.daily.length-2; i++) {
        // Parse the Unix timestamp and convert into any date format.
        var weatherDate = moment.unix(weatherParams.daily[i].dt).format("MM/DD/YYYY");
        //for each day create a card elemets  with the weather conditions
        var weatherCard = document.createElement('section');
        weatherCard.classList = "flex-row weather-card";
        weatherCard.innerHTML = weatherCard.innerHTML +
        `<section class="weather-card">
            <header>${weatherDate}</header>
            <img src="http://openweathermap.org/img/wn/${weatherParams.daily[i].weather[0].icon}@4x.png" alt="${weatherParams.daily[i].weather[0].description}" />
            <p>Temp: ${weatherParams.daily[i].temp.day}</p>
            <p>Wind: ${weatherParams.daily[i].wind_speed}</p>
            <p>Humidity: ${weatherParams.daily[i].humdity}</p>
            <p>UV Index: ${weatherParams.daily[i].uvi}</p>
        </section>`;
    repoContainerEl.appendChild(weatherCard);
  }
};

weatherFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
