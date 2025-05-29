const town = document.querySelector("#town");
const time = document.getElementById("time");
// const clouds = document.getElementById("clouds");
const temperature = document.getElementById("temperature");
const feelLike = document.getElementById("feel-like");
const humidity = document.getElementById("humidity");
const conditions = document.getElementById("conditions");
const windGust = document.getElementById("wind");
const input = document.querySelector("input");
const iconSvg = document.getElementById("icon-svg");
// const gif = document.getElementById("gif");
const tempGif = document.getElementById("temp-gif");
const windIcon = document.querySelector('.fa-wind');
const tempIcon = document.querySelector('.fa-temperature-half');
// suggestion auto-complete
const cityInput = document.getElementById("city-input");
const citySelect = document.getElementById("city-select");

cityInput.addEventListener("input", async () => {
  const query = cityInput.value;

  if (query.length < 3) {
    citySelect.style.display = "none";
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?city=${query}&format=json&limit=5`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error ('Error fetching openStreet Data')
    }
    const cities = await response.json();
    // console.log('cities', cities)

    // Clear previous options
    citySelect.innerHTML = "";

    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = `${city.display_name}`;
      option.textContent = `${city.display_name}`;
      citySelect.appendChild(option);
    });

    citySelect.style.display = cities.length ? "block" : "none";
  } catch (err) {
    console.error("Error fetching cities:", err);
  }
});

citySelect.addEventListener("change", () => {
  const selectedCity = citySelect.value;
  cityInput.value = selectedCity;
  citySelect.style.display = "none";

  getWeather(selectedCity);
});


// fetch weather conditions
const getWeather = async city => {
  const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=b5004fe6bc954a1db05184834252805&q=${city}&aqi=no`;

  try {
    const response = await fetch(weatherApiUrl);

    if (!response.ok) {
      throw new Error("Network responose error");
    }

    const data = await response.json();
    const { location, current } = data;
    const {
      cloud,
      temp_c,
      feelslike_c,
      wind_kph,
      humidity: humid,
      condition,
    } = current;
    const { icon, text } = condition;
    const { name, localtime } = location;

    town.textContent = name;
    time.textContent = localtime;
    // clouds.innerText = `Cloud Cover: ${cloud}%`;
    temperature.innerText = `Temp.: ${temp_c || 'N/A'} °C`;
    feelLike.innerText = `Feels Like: ${feelslike_c || 'N/A'} °C`;
    windGust.innerText = `Wind:  ${wind_kph || "N/A"} km/h`;
    humidity.innerText = `Humidity: ${humid || 'N/A'}%`;
    conditions.innerText = text || 'N/A';
    iconSvg.src = icon;
    tempIcon.style.display = 'block'; 
    windIcon.style.display = 'block';

    // fetch gifs
    // const gifApiKey = "fuoaXs8CwsABba2ChfKH5jiIQJRDXQbV";
    // const gifApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${gifApiKey}&q=${text}&limit=1`;

    // const giphyRes = await fetch(gifApiUrl);
    // console.log("gifUrl", gifApiUrl);
    // const giphyData = await giphyRes.json();
    // const gifUrl = giphyData.data[0]?.images?.original?.url;

    // if (gifUrl) {
    //   gif.src = gifUrl;
    //   gif.alt = giphyData.data[0]?.title || "Weather GIF";
    // }

    // tempGif.innerText = JSON.stringify(giphyData, null, 2);
    // console.log(tempGif)
  } catch (error) {
    console.error("Fetch error", error);
  }
};

