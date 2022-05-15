function formatDate(timestamp) {
  let now = new Date(timestamp);
  let day = now.getDay();
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurday",
    "Friday",
    "Saturday",
  ];

  let hours = now.getHours();
  let amPm = "null";

  if (hours < 12) {
    amPm = "AM";
  } else {
    hours = hours - 12;
    amPm = "PM";
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${dayNames[day]} ${hours}:${minutes} ${amPm}`;
}

function formatDay(dt) {
  let datetime = new Date(dt * 1000);
  let day = datetime.getDay();
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return `${dayNames[day]}`;
}

function getApiKey() {
  return "d345b94fee409ccc249832a53244de54";
}

function searchCity(city) {
  let apiKey = getApiKey();
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function searchPosition(position) {
  let apiKey = getApiKey();
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function getForecast(coords) {
  let apiKey = getApiKey();
  let units = "imperial";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

function updateWeather(response) {
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#current-description");
  let tempElement = document.querySelector("#current-temp");
  let highElement = document.querySelector("#current-high");
  let lowElement = document.querySelector("#current-low");
  let humidityElement = document.querySelector("#current-humidity");
  let windElement = document.querySelector("#current-wind");
  let iconElement = document.querySelector("#current-icon");

  let currentTemp = Math.round(response.data.main.temp);
  let highToday = Math.round(response.data.main.temp_max);
  let lowToday = Math.round(response.data.main.temp_min);
  let windToday = Math.round(response.data.wind.speed);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  tempElement.innerHTML = `${currentTemp}`;
  highElement.innerHTML = `${highToday}°`;
  lowElement.innerHTML = `${lowToday}°`;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = `${windToday}`;

  let dateElement = document.querySelector("#current-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let icon = response.data.weather[0].icon;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  let currentSectionElement = document.querySelector("#current-section");
  let forecastSectionElement = document.querySelector("#forecast");
  if (icon.endsWith("n")) {
    currentSectionElement.classList.add("nighttime");
    currentSectionElement.classList.remove("daytime");
    forecastSectionElement.classList.add("nighttime");
    forecastSectionElement.classList.remove("daytime");
  } else {
    currentSectionElement.classList.remove("nighttime");
    currentSectionElement.classList.add("daytime");
    forecastSectionElement.classList.remove("nighttime");
    forecastSectionElement.classList.add("daytime");
  }

  getForecast(response.data.coord);
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `
    <div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
        
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" width="50px">
        <div class="forecast-temp"><span class="forecast-temp-high">${Math.round(
          forecastDay.temp.max
        )}°</span> ${Math.round(forecastDay.temp.min)}°</div>
      </div>  
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function handleCityInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function getCurrentWeather() {
  navigator.geolocation.getCurrentPosition(searchPosition);
}

let cityInput = document.querySelector("#city-search-form");
cityInput.addEventListener("submit", handleCityInput);

let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", getCurrentWeather);

searchCity("New York");
