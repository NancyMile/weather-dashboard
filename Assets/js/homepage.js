var weatherFormEl = document.querySelector('#weather-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#cityname');
var repoContainerEl = document.querySelector('#weatherparams-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

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
 let myKey = '3647b99d321bbf401a1d1e6e104ff888';
    //https://api.openweathermap.org/data/2.5/forecast5?q=Sydney&appid=3647b99d321bbf401a1d1e6e104ff888
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&only_current=true&exclude=hourly&appid=${myKey}&cnt=5`;

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
          console.log("aquiiii");  
          console.log(data);
          displayWeather(data, city);
        })
    //   } else {
    //     alert('Error: ' + response.statusText);
    //   }
    //})
    .catch(function (error) {
      alert('Unable to connect'+error);
    });
};

// var getFeaturedRepos = function (language) {
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };

var displayWeather = function (weatherParams, searchTerm) {
    console.log('APPPPP');
//   if (weatherParams.list.length === 0) {
//     repoContainerEl.textContent = 'No data found.';
//     return;
//   }

  repoSearchTerm.textContent = searchTerm;


  repoContainerEl.innerHTML = weatherParams.list.map(day => {
      //get the date from the dt timestamp
      let dt = day.dt * 1000;
      return `<section class="weather-card">
      <header>${dt}</header>
    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="${day.weather[0].description}" />
       <p>Temp: ${day.main.temp}</p>
       <p>Wind: ${day.wind.speed}</p>
       <p>Humidity: ${day.main.humdity}</p>
       <p>UV Index: ??</p>
    </section>`;
  }).join(" ");


  for (var i = 0; i < weatherParams.length; i++) {
      console.log("ACAA");
      console.log("LOOP "+weatherParams[i].weather[0].icon + '/' + weatherParams[i].wind.speed);
    var repoName = weatherParams[i].weather[0].icon + '/' + weatherParams[i].wind.speed;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (weatherParams[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + weatherParams[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

weatherFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
