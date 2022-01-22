class Weather {
  container = document.querySelector(".weather__container__current");
  getWeatherBtn = document.querySelector(".action");
  clearHistoryBtn = document.querySelector(".clear");
  historyContainer = document.querySelector(
    ".weather__container__history__container"
  );
  historyData = [];
  API = "";

  constructor() {
    this.addAllHistoryToUI();
    this.showWeatherAction();
    this.clearHistory();
    this.getAPI();
  }

  getAPI() {
    document.querySelector(".btn-api").addEventListener("click", (e) => {
      e.preventDefault();
      this.API = document.getElementById("api").value;
    });
  }

  async getWeatherData(city) {
    try {
      const response =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API}
      `);
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 401)
        throw new Error(
          "Your API is not valid, please enter a valid API (only openweathermap API)"
        );
      if (!response.ok)
        throw new Error(
          "Not found this city, please verify your data and try again!"
        );
      return responseData;
    } catch (err) {
      throw Error(err.message);
    }
  }

  loadingSpinner() {
    this.container.innerHTML = `
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    `;
  }

  showWeather = (data) => {
    const html = `
      <h3 class="heading-5">Weather in ${data.name}</h3>
      <img src="http://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png" alt="Weather Icon">
      <p class="paragraph">Temperature: ${(
        data.main.temp - 273.15
      ).toFixed()}&deg;C </p>  
      <p>Humidity: ${data.main.humidity} %</p>
      <p>Wind speed: ${(data.wind.speed * 3.6).toFixed(2)} km/h</p>
    `;
    this.container.innerHTML = html;
  };

  showError(error) {
    this.container.innerHTML = `<p>${error}</p>`;
  }

  showWeatherAction() {
    this.getWeatherBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const cityName = document.querySelector(".weather__input");
      try {
        this.loadingSpinner();
        const data = await this.getWeatherData(cityName.value);
        this.showWeather(data);
        this.addNewToHistory(data);
      } catch (err) {
        this.showError(err.message);
      }
      cityName.value = "";
    });
  }

  addHistoryToLocalStorage(data) {
    this.historyData.push(data);
    localStorage.setItem("searchHistory", JSON.stringify(this.historyData));
  }

  addNewHistoryToUI(data) {
    const html = `
      <div>
        <p>${data.cityName} <span>${data.temp}&deg;C</span> <img src="http://openweathermap.org/img/w/${data.icon}.png" alt="Weather Icon"> at ${data.date}</p>
      </div>
    `;
    this.historyContainer.insertAdjacentHTML("afterbegin", html);
  }

  addNewToHistory(data) {
    const date = new Date().toISOString().slice(0, 10);
    const weatherData = {
      cityName: data.name,
      temp: (data.main.temp - 273.15).toFixed(),
      icon: data.weather[0].icon,
      date,
    };

    this.addHistoryToLocalStorage(weatherData);
    this.addNewHistoryToUI(weatherData);
  }

  getHistoryData() {
    const data = JSON.parse(localStorage.getItem("searchHistory"));
    if (data) this.historyData = data;
  }

  addAllHistoryToUI() {
    this.getHistoryData();

    if (this.historyData.length === 0)
      this.historyContainer.innerHTML = "<p>No weather search history</p>";
    else this.historyContainer.innerHTML = "";

    this.historyData.map((data) => {
      this.addNewHistoryToUI(data);
    });
  }

  clearHistory() {
    this.clearHistoryBtn.addEventListener("click", () => {
      localStorage.clear();
      this.historyData = [];
      this.historyContainer.innerHTML = "<p>No weather search history</p>";
    });
  }
}

const app = new Weather();

const copywrite = () => {
  let years = 2022;
  const currentYear = new Date().getFullYear();
  if (currentYear !== years) years = `2022 - ${currentYear}`;
  document.getElementById("copyright").innerHTML = years;
};
copywrite();