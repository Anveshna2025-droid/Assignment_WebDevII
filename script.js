const API_KEY = "1dae55caf1954102179cce8450e4b074";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
        throw new Error("City not found");
    }

    return await res.json();
}
function renderWeather(data) {
    weatherBox.innerHTML = `
        <div class="weather-item"><label>City</label><span>${data.name}, ${data.sys.country}</span></div>
        <div class="weather-item"><label>Temperature</label><span>${data.main.temp} °C</span></div>
        <div class="weather-item"><label>Weather</label><span>${data.weather[0].main}</span></div>
        <div class="weather-item"><label>Humidity</label><span>${data.main.humidity}%</span></div>
        <div class="weather-item"><label>Wind</label><span>${data.wind.speed} m/s</span></div>
    `;
}
async function search(city) {
    weatherBox.innerHTML = "Loading...";

    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (err) {
        weatherBox.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
}
searchBtn.onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        search(city);
    }
};
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            search(city);
        }
    }
});
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    if (!history.includes(city)) {
        history.unshift(city);
    }

    history = history.slice(0, 5);

    localStorage.setItem("weatherHistory", JSON.stringify(history));

    showHistory();
}
function showHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    historyBox.innerHTML = "";

    history.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;

        btn.onclick = () => {
            search(city);
        };

        historyBox.appendChild(btn);
    });
}
showHistory();