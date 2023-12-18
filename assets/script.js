let button = document.getElementById("search-button");
let cityInput = document.getElementById("search-input");
let historySearches = document.getElementById("history-searches");
let weatherToday = document.getElementById("weather-today");
let clearHistoryBtn = document.getElementById("clear-history");

let API_KEY = "bf9df75eeb5dfc02a2e3f7d42c3b052c";

function getCityCoordinates() {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      //   console.log(data);
      let { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
      //   console.log(lat, lon, name);
    });
}
button.addEventListener("click", getCityCoordinates);
