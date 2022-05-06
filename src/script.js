function formatDate() {
  let now = new Date();
  let day = now.getDay();
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
  let year = now.getFullYear();

  let hours = now.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${dayNames[day]}, ${monthNames[month]} ${date} ${year} ${hours}:${minutes}`;
}

function showFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = "60";

  let tempF = document.querySelector("#temp-f");
  let tempC = document.querySelector("#temp-c");
  tempF.classList.add("selected-temp-scale");
  tempC.classList.remove("selected-temp-scale");
}

function showCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = "15";

  let tempF = document.querySelector("#temp-f");
  let tempC = document.querySelector("#temp-c");
  tempC.classList.add("selected-temp-scale");
  tempF.classList.remove("selected-temp-scale");
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
  let city = document.querySelector("#current-city");
  city.innerHTML = response.data.name;
  let description = document.querySelector("#current-description");
  description.innerHTML = response.data.weather[0].description;
  let temp = document.querySelector("#current-temp");
  temp.innerHTML = Math.round(response.data.main.temp);
  let high = document.querySelector("#current-high");
  high.innerHTML = `${Math.round(response.data.main.temp_max)}°`;
  let low = document.querySelector("#current-low");
  low.innerHTML = `${Math.round(response.data.main.temp_min)}°`;
  let humidity = document.querySelector("#current-humidity");
  humidity.innerHTML = `${response.data.main.humidity}%`;
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

//let tempC = document.querySelector("#temp-c");
//tempC.addEventListener("click", showCelsius);

//let tempF = document.querySelector("#temp-f");
//tempF.addEventListener("click", showFahrenheit);

let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = formatDate();

searchCity("New York");
