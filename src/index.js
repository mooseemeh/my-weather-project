function setDateTime(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[now.getDay()];
  let timeHr = now.getHours();
  if (timeHr < 10) {
    timeHr = `0${timeHr}`;
  }
  let timeMin = now.getMinutes();
  if (timeMin < 10) {
    timeMin = `0${timeMin}`;
  }
  let today = `${currentDay} ${timeHr}:${timeMin}`;
  return today;
}

function setCity(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#citySearch");
  setApi(citySearch.value);
}

function setApi(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(showTemp);
}

function setForecastApi(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(setForecast);
}

function showTemp(response) {
  fahrenheit = response.data.temperature.current;
  let cityTemp = Math.round(fahrenheit);
  let city = response.data.city;
  let dateElement = setDateTime(response.data.time * 1000);
  let description = response.data.condition.description;
  let wind = response.data.wind.speed;
  let iconUrl = response.data.condition.icon_url;
  let iconAlt = response.data.condition.icon;

  let currentTemperature = document.querySelector("#todayTemp");
  let citySearched = document.querySelector("#city");
  let todayDate = document.querySelector("#todayDate");
  let weatherDescription = document.querySelector("#description");
  let windSpeed = document.querySelector("#wind");
  let icon = document.querySelector("#icon");

  currentTemperature.innerHTML = `${cityTemp}`;
  citySearched.innerHTML = `${city}`;
  todayDate.innerHTML = dateElement;
  weatherDescription.innerHTML = description;
  windSpeed.innerHTML = `${wind} mph`;
  icon.setAttribute("src", iconUrl);
  icon.setAttribute("alt", iconAlt);

  setForecastApi(response.data.city);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(setCurrentLocation);
}

function setCurrentLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${long}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(showTemp);
  console.log(lat);
}

function setDayFormat(timestamp) {
  let setDay = new Date(timestamp * 1000);
  let day = setDay.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

function setForecast(response) {
  let forecastData = response.data.daily;
  console.log(forecastData);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecastData.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
            <div class="col days">
              <div class="forecast-day">${setDayFormat(forecastDay.time)}</div>
              <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                forecastDay.condition.icon
              }.png" alt="" width ="50"/ id="forecast-icon">
              <div class="forecast-temps">
                <span class="max-temp">${Math.round(
                  forecastDay.temperature.maximum
                )}°</span>
                <span class="min-temp">${Math.round(
                  forecastDay.temperature.minimum
                )}°</span>
              </div>
            </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let apiKey = "8b1e3171fc9032a9t40o6647047da630";

let fahrenheit = null;

let searchButton = document.querySelector("#search");
searchButton.addEventListener("click", setCity);

let currentLocationButton = document.querySelector("#currentLocation");
currentLocationButton.addEventListener("click", getLocation);

setApi("New York City");
