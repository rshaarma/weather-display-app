const button = document.getElementById("search-button");
const cityInput = document.getElementById("search-input");
const historySearches = document.getElementById("history-searches");
const weatherToday = document.getElementById("weather-today");
const weatherCards = document.querySelector(".weather-cards");
const clearHistoryBtn = document.getElementById("clear-history");

const API_KEY = "bf9df75eeb5dfc02a2e3f7d42c3b052c";

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
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    });
}

function getWeatherDetails(cityName, latitude, longitude) {
  const COORD_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  console.log(cityName);
  fetch(COORD_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
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
                <h2>${cityName}(${dayjs(item.dt_txt.split(" ")[0]).format(
              "DD / MM / YYYY"
            )})</h2>
            <h6>Temperature:${(item.main.temp - 273.15).toFixed(2)} °C</h6>
            <h6>Wind:${((item.wind.speed * 18) % 5).toFixed(1)} KMH</h6>
            <h6>Humidity:${item.main.humidity}%</h6>
            </div>
            <div>
                    <img src="https://openweathermap.org/img/wn/${
                      item.weather[0].icon
                    }@2x.png" >
                    <h6>${item.weather[0].description}</h6>
            </div>
            `
          );
        } else {
        }
      });
    });
}

button.addEventListener("click", getCityCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
