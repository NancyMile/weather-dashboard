var weatherFormEl = document.querySelector('#weather-form');
var weatherCityButtonsEl = document.querySelector('#weatherCity-buttons');
var nameInputEl = document.querySelector('#cityname');
var repoContainerEl = document.querySelector('#weatherparams-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var todayWeather = document.createElement('div');
const myKey = '3647b99d321bbf401a1d1e6e104ff888';
var weather = []; //array for local storage

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
            console.log(data);
            displayWeather(data,weatherResults.city.name);
        });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

var displayWeather = function (weatherParams, searchTerm) {
    repoSearchTerm.textContent = searchTerm.toLowerCase();

    localStorage.setItem("weather", JSON.stringify(weather));
    // Add new city to weather array
    //check if the city is already in the array if so dont add it again
    //note adding in lowercase to made easy tosearch later
    if((weather.length >= 0) || (! weather.indexOf(searchTerm.toLowerCase()))){
      weather.push(searchTerm.toLowerCase());
    }
    
    // Store updated todos in localStorage, re-render the list
    storedWeather();
    renderWeather();
    
    // in roder to display five day forecast may have to reduce three out of eight days
    for (var i = 0; i < weatherParams.daily.length-2; i++) {
        // Parse the Unix timestamp and convert into any date format.
        var weatherDate = moment.unix(weatherParams.daily[i].dt).format("MM/DD/YYYY");
        var uvi = weatherParams.daily[i].uvi;
        //for each day create a card elemets  with the weather conditions
        var weatherCard = document.createElement('section');
        weatherCard.classList = "flex-row weather-card";
        weatherCard.innerHTML = weatherCard.innerHTML +
        `<section class="weather-card">
            <header>${weatherDate}</header>
            <img src="http://openweathermap.org/img/wn/${weatherParams.daily[i].weather[0].icon}@4x.png" alt="${weatherParams.daily[i].weather[0].description}" />
            <p>Temp: ${weatherParams.daily[i].temp.day} F</p>
            <p>Wind: ${weatherParams.daily[i].wind_speed} MPH</p>
            <p>Humidity: ${weatherParams.daily[i].humidity}%</p>`;

            // 
            // Low exposure (green): 1-2
            // Moderate exposure (yellow): 3-5
            // High exposure (orange): 6-7
            // Very high exposure (red): 8-10
            // Extreme exposure (violet): 11+
            // 
            if(uvi < 2){
                //green
                weatherCard.innerHTML = weatherCard.innerHTML + `<p>UV Index: <span class="uvi-low">${weatherParams.daily[i].uvi}</span></p>
                </section>`;
            }else if(uvi > 2 && uvi < 7 ){
                //yellow
                weatherCard.innerHTML = weatherCard.innerHTML +  `<p> UV Index:<span class="uvi-moderate"> ${weatherParams.daily[i].uvi}</span></p>
                </section>`;
            }else{
                //red
                weatherCard.innerHTML = weatherCard.innerHTML + `<p> UV Index: <span class="uvi-high">${weatherParams.daily[i].uvi}</span></p>
                </section>`;
            }
        
        if(i==0){
            //append today weather to the repcontainer
            todayWeather.classList = "flex-row today-weather";
            repoContainerEl.appendChild(todayWeather);
            todayWeather.appendChild(weatherCard);
        }else{
            repoContainerEl.appendChild(weatherCard);
        }
    
  }
};

// This function is being called below and will run when the page loads.
function init() {
   // Get stored weather from localStorage
    var storedWeather = JSON.parse(localStorage.getItem("weather"));
  
    // If weather were retrieved from localStorage, update the weather array to it
    if (storedWeather !== null) {
      weather = storedWeather;
    }
    // This is a helper function that will render weather to the DOM
  renderWeather();
}
  
// The following function renders items in a WeatherCity list as <li> elements
function renderWeather() {
    // Clear todoList element and update todoCountSpan
    weatherCityButtonsEl.innerHTML = "";
    //todoCountSpan.textContent = weather.length;
    
    // Render a new button for each weather
    for (var i = 0; i < weather.length; i++) {
      var WeatherCity = weather[i];
      var weatherCityButton = document.createElement("button");
      weatherCityButton.textContent = WeatherCity;
      weatherCityButton.setAttribute("data-index", i);
      weatherCityButton.setAttribute("id", weather[i]);
      //weatherCityButton.appendChild(button);
      weatherCityButtonsEl.appendChild(weatherCityButton);
    }
  }

function storedWeather() {
    // Stringify and set key in localStorage to weather array
    localStorage.setItem("weather", JSON.stringify(weather));
}

weatherFormEl.addEventListener('submit', formSubmitHandler);
weatherCityButtonsEl.addEventListener('click', buttonClickHandler);

// Add click event to weather button element
weatherCityButtonsEl.addEventListener("click", function(event) {
    var element = event.target;
    // Checks if element is a button
    if (element.matches("button") === true) {
      // Get its data-index value and remove the todo element from the list
      var index = element.parentElement.getAttribute("data-index");
      //call the function get city weather with the city name  to get the data again.
      getCityWeather(element.id);

      // Store updated todos in localStorage, re-render the list
      storedWeather();
      renderWeather();
    }
});

// Calls init to retrieve data and render it to the page on load
init()
