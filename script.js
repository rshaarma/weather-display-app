const button = document.getElementById("search-button");
const cityInput = document.getElementById("search-input");
const historySearches = document.getElementById("history-searches");
const weatherToday = document.getElementById("weather-today");
const weatherCards = document.querySelector(".weather-cards");
const clearHistoryBtn = document.getElementById("clear-history");
const API_KEY = "bf9df75eeb5dfc02a2e3f7d42c3b052c";

let storedCities = [];

init();

function getUserCurrentCoordinates() {
  navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude, longitude } = position.coords;
    const URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
    fetch(URL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const { name } = data[0];
        getWeatherDetails(name, latitude, longitude);
      });
  });
}
function getCityCoordinates(cityName) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    });
}

function getWeatherDetails(cityName, latitude, longitude) {
  const COORD_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(COORD_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const forecastDays = [];
      const fiveDays = data.list.filter(function (forcast) {
        const date = new Date(forcast.dt_txt).getDate();
        if (!forecastDays.includes(date)) {
          return forecastDays.push(date);
        }
      });
      console.log(fiveDays);
      cityInput.value = "";
      weatherToday.value = "";
      weatherCards.value = "";
      fiveDays.forEach(function (item, index) {
        if (index === 0) {
          weatherToday.insertAdjacentHTML(
            "beforeend",
            `
            <div class="current-forecast">
                <h1>${cityName}(${dayjs(item.dt_txt.split(" ")[0]).format(
              "DD / MM / YYYY"
            )})</h1>
            <h6>Temperature:${(item.main.temp - 273.15).toFixed(2)} °C</h6>
            <h6>Wind:${((item.wind.speed * 18) % 5).toFixed(1)} KMH</h6>
            <h6>Humidity:${item.main.humidity}%</h6>
            </div>
            <div class="weather-day-div">
                    <img class="weather-day-image" src="https://openweathermap.org/img/wn/${
                      item.weather[0].icon
                    }@2x.png" >
                    <h5>${item.weather[0].description}</h5>
            </div>
            `
          );
        } else {
          weatherCards.insertAdjacentHTML(
            "beforeend",
            `
                <li class="card col-lg-2 pt-2">
                    <h6>${dayjs(item.dt_txt.split(" ")[0]).format(
                      "DD/MM/YYYY"
                    )}</h6>    
                   <img class="cards-image" src="https://openweathermap.org/img/wn/${
                     item.weather[0].icon
                   }@2x.png">
                   <h6 class="card-details mb-2">Temp: ${(
                     item.main.temp - 273.15
                   ).toFixed(2)}°C</h6>
                   <h6 class="card-details mb-2">Wind: ${(
                     (item.wind.speed * 18) %
                     5
                   ).toFixed(1)}KMH</h6>
                   <h6 class="card-details">Humidity: ${
                     item.main.humidity
                   }%</h6>
                 </li>      
            `
          );
        }
      });
    })
    .catch(function () {
      alert("Error occured");
    });
}

function init() {
  let lastSearched = JSON.parse(localStorage.getItem("searchedCitiesBtns"));
  if (lastSearched !== null) {
    storedCities = lastSearched;
    console.log(storedCities);
  }
  renderButtons();
  getUserCurrentCoordinates();
}

function storeCities() {
  return localStorage.setItem(
    "searchedCitiesBtns",
    JSON.stringify(storedCities)
  );
}

function renderButtons() {
  historySearches.replaceChildren();
  for (let i = 0; i < storedCities.length; i++) {
    const btn = document.createElement("button");
    btn.classList.add("searched-city");
    btn.setAttribute("data-name", storedCities[i]);
    btn.textContent = storedCities[i];
    historySearches.prepend(btn);
  }
}

button.addEventListener("click", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (storedCities.includes(city)) return alert("Please enter another city!");
  storedCities.push(city);
  weatherCards.textContent = "";
  weatherToday.textContent = "";
  storeCities();
  getCityCoordinates(city);
  renderButtons();
});

historySearches.addEventListener("click", function (e) {
  const item = e.target;
  weatherCards.textContent = "";
  weatherToday.textContent = "";
  if (item.matches("button")) {
    const value = item.getAttribute("data-name");
    getCityCoordinates(value);
    storeCities();
    renderButtons();
  }
});

cityInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (storedCities.includes(city)) return alert("Please enter another city!");
    storedCities.push(city);
    weatherCards.textContent = "";
    weatherToday.textContent = "";
    storeCities();
    getCityCoordinates(city);
    renderButtons();
  }
});

clearHistoryBtn.addEventListener("click", function (e) {
  e.preventDefault();
  historySearches.innerHTML = "";
  localStorage.clear();
});
