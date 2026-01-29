// Weather API
const weatherApiKey = '535f0e4b49f7b9e3cf92fe8073e48ec9';
const cityValue = document.getElementById("city");
const countryValue = document.getElementById("country");
const tempValue = document.getElementById("degree");
const descValue = document.getElementById("description");
const iconValue = document.getElementById("icon");
const dateValue = document.getElementById("date");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  cityValue.innerText = "Location unavailable";
  countryValue.innerText = "unavailable";
  tempValue.innerText = "--";
  descValue.innerText = "";
  iconValue.src = "";
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

  fetch(weatherApiUrl)
    .then((response) => response.json())
    .then((data) => {
      const city = data.name;
      const country = data.sys.country;
      const temp = `${Math.round(data.main.temp)}°C`;
      const desc = data.weather[0].description;

      cityValue.innerText = city;
      countryValue.innerText = country;
      tempValue.innerText = temp;
      descValue.innerText = desc.charAt(0).toUpperCase() + desc.slice(1);

      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      iconValue.src = iconUrl;

      const today = new Date();
      const options = {
        weekday: "long",
        month: "short",
        day: "numeric"
      };
      dateValue.innerText = today.toLocaleDateString("en-GB", options);
    })
    .catch((error) => {
      console.error("Weather API Error:", error);
      cityValue.innerText = "Error";
      countryValue.innerText = "";
      tempValue.innerText = "--";
      descValue.innerText = "Cannot load weather";
    });
}

function error() {
  cityValue.innerText = "Location unavailable";
  countryValue.innerText = "unavailable";
  tempValue.innerText = "";
  descValue.innerText = "Cannot get weather data";
  iconValue.src = "";
}

const MatchApiKey = "9ec5b12edb686469492d6b94d5bd8c5ce037e408ee1ce80f9ea148a5b29642e4";
const MatchPremierLeag = '152';
const MatchApiUrl = 'https://apiv2.allsportsapi.com/football/?met=Fixtures&leagueId=${MatchPremierLeag}&APIkey=${MatchApiKey}';

//console.log(MatchApiUrl);

// Exchange Rate API
const usd = document.getElementById("usd");
const sar = document.getElementById("sar");
const eur = document.getElementById("eur");
const gbp = document.getElementById("gbp");

// Using ExchangeRate-API v6 with API key
const exchangeApiKey = 'a239ee9cbb16ec33ee530cb2';
const ExchangeRateURL = `https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/EGP`;

if (usd && sar && eur && gbp) {
  fetch(ExchangeRateURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.result === 'success') {
        usd.innerText = `${(1 / data.conversion_rates.USD).toFixed(2)} EGP`;
        sar.innerText = `${(1 / data.conversion_rates.SAR).toFixed(2)} EGP`;
        eur.innerText = `${(1 / data.conversion_rates.EUR).toFixed(2)} EGP`;
        gbp.innerText = `${(1 / data.conversion_rates.GBP).toFixed(2)} EGP`;
      }
    })
    .catch((error) => {
      console.error("Exchange Rate API Error:", error);
      // Fallback to static values if API fails
      usd.innerText = "0.02 EGP";
      sar.innerText = "0.13 EGP";
      eur.innerText = "0.02 EGP";
      gbp.innerText = "0.02 EGP";
    });
}



// News API
// GNews API - https://gnews.io/
const apiKey = '9f431a1597fd1f6320630087a1884512';
const categories = ["politics", "sports", "entertainment"];


async function fetchNews(category) {
  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=4&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const container = document.querySelector(`.${category} .cards`);
    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:gray;">No news available for ${category}</p>`;
      return;
    }

    data.articles.forEach((article) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${article.image || "./imgs/Selection (1).png"}" class="img-card" alt="news">
        <div class="details">
          <div class="${category}">
            <p>${category.charAt(0).toUpperCase() + category.slice(1)}</p>
          </div>
          <div class="headOfSection">${article.title}</div>
          <p>${article.description || "No description available."}</p>
          <button onclick="window.open('${article.url}', '_blank')">Read More</button>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
  }
}

// Fetch and display live matches
const liveMatchesApiKey = '854227dfc2e2c8b4ecfe62d71445ec1fcc8d32bef9fd2a107b11e914630c04d3';
const countryId = '44'; // England
const liveMatchesUrl = `https://apiv2.allsportsapi.com/football/?met=Livescore&countryId=${countryId}&APIkey=${liveMatchesApiKey}`;

function getLiveMatches() {
  const matchesContainer = document.querySelector('.liveMatches .matches');
  if (!matchesContainer) return;

  fetch(liveMatchesUrl)
    .then((response) => response.json())
    .then((data) => {
      if (!data.result || data.result.length === 0) {
        matchesContainer.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">No live matches at the moment.</p>`;
        return;
      }

      const matches = data.result.slice(0, 5); // Limit to 5 matches
      matchesContainer.innerHTML = matches.map(match => {
        const homeTeam = match.event_home_team || 'Home';
        const awayTeam = match.event_away_team || 'Away';
        const homeScore = match.event_final_result?.split(' - ')[0] || '';
        const awayScore = match.event_final_result?.split(' - ')[1] || '';
        const status = match.event_status || '';
        const time = match.event_time || '';

        let statusDisplay = '';
        let isLive = false;

        if (status.includes('Finished')) {
          statusDisplay = `FT (${homeScore}-${awayScore})`;
        } else if (status.includes('Half Time')) {
          statusDisplay = `HT (${homeScore}-${awayScore})`;
          isLive = true;
        } else if (time) {
          statusDisplay = `${homeScore} - ${awayScore}`;
          isLive = true;
        } else {
          statusDisplay = 'LIVE';
          isLive = true;
        }

        return `
                    <div class="match ${isLive ? 'backfaded' : ''}">
                        <img src="./imgs/Selection (13).png"> 
                        ${homeTeam} vs ${awayTeam} - ${statusDisplay}
                        ${isLive ? '<span class="LIVE">LIVE</span>' : ''}
                    </div>
                `;
      }).join('');
    })
    .catch((error) => {
      console.error("Error fetching live matches:", error);
      matchesContainer.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">Unable to load live matches.</p>`;
    });
}

window.addEventListener("DOMContentLoaded", () => {
  categories.forEach((cat) => fetchNews(cat));
  getLiveMatches();

  // Refresh live matches every 60 seconds
  setInterval(getLiveMatches, 60000);
})