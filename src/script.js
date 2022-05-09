function formatDate(timestamp) {
  let now = new Date(timestamp);
  let day = now.getDay();
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let month = now.getMonth();
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let date = now.getDate();
  //let year = now.getFullYear();

  let hours = now.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${dayNames[day]} ${date} ${monthNames[month]} ${hours}:${minutes}`;
}

function getApiKey() {
  return "d345b94fee409ccc249832a53244de54";
}

function searchCity(city) {
  let apiKey = getApiKey();
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function searchPosition(position) {
  let apiKey = getApiKey();
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
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

  celsiusTemp = Math.round(response.data.main.temp);
  celsiusHighToday = Math.round(response.data.main.temp_max);
  celsiusLowToday = Math.round(response.data.main.temp_min);
  celsiusWindToday = Math.round(response.data.wind.speed);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  tempElement.innerHTML = `${celsiusTemp}`;
  highElement.innerHTML = `${celsiusHighToday}°`;
  lowElement.innerHTML = `${celsiusLowToday}°`;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = `${celsiusWindToday} m/s`;

  let dateElement = document.querySelector("#current-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let icon = response.data.weather[0].icon;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function showCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = celsiusTemp;

  let high = document.querySelector("#current-high");
  high.innerHTML = `${celsiusHighToday}°`;

  let low = document.querySelector("#current-low");
  low.innerHTML = `${celsiusLowToday}°`;

  let wind = document.querySelector("#current-wind");
  wind.innerHTML = `${celsiusWindToday} m/s`;
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

let celsiusTemp = null;
let celsiusHighToday = null;
let celsiusLowToday = null;
let celsiusWindToday = null;

searchCity("New York");
