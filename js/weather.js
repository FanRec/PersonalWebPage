const temprature = document.getElementById("temprature");
const weather_desc = document.getElementById("weather-desc");
const weather_icon = document.getElementById("weather-icon");
const wind_speed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const api_url =
  "https://cn.apihz.cn/api/tianqi/tqyb.php?id=88888888&key=88888888&sheng=山东&place=青岛";
const interval = 60000; // 10s
let canFreshWeather = true;
function getWeatherData() {
  if (!canFreshWeather) return;
  canFreshWeather = false;
  fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
      weather_desc.textContent = data.weather1;
      const nowinfo = data.nowinfo;
      temprature.textContent = `${data.wd2}°C~${data.wd1}°C`;
      wind_speed.textContent = nowinfo.windSpeed + "km/h";
      humidity.textContent = nowinfo.humidity + "%";
      weather_icon.style.backgroundImage = `url(${data.weather1img})`;
    })
    .catch((error) => {
      console.error("天气数据加载失败：", error);
      alert("天气数据加载失败，请10s后重试~");
    });
  setTimeout(() => {
    canFreshWeather = true;
  }, interval);
}
