// ============================================================
// SAIF PLUGIN: weather.js
// Feature: Weather Checker
// Author: Saif Elite
// ============================================================

(function () {

  // ===== INJECT WEATHER UI =====
  function injectWeatherUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;

    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) {
        connectSection = el;
      }
    });

    if (!connectSection) {
      console.warn('[Saif Plugin: weather] Could not find anchor section.');
      return;
    }

    if (document.getElementById('saif-weather-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-weather-box';
    box.style.cssText = `
      margin-top: 30px;
      padding: 25px;
      background: var(--dl-bg);
      border-radius: 25px;
      border: 2px solid var(--primary);
      backdrop-filter: blur(10px);
    `;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900;">
        <i class="fas fa-cloud-sun"></i> Weather Checker
      </h3>
      <input type="text" id="weatherInput" placeholder="City name likhoo... (e.g. Dhaka, Gazipur)" style="margin:0 0 15px 0;">
      <button class="dl-btn" onclick="handleWeather()">
        <i class="fas fa-search"></i> GET WEATHER
      </button>
      <div id="weatherResult" style="margin-top:15px;"></div>
    `;

    connectSection.parentNode.insertBefore(box, connectSection);
    console.log('[Saif Plugin: weather] UI injected ✅');
  }

  // ===== WEATHER LOGIC =====
  // Using Open-Meteo (free, no API key needed) + Geocoding API
  window.handleWeather = async function () {
    const input = document.getElementById('weatherInput');
    const resultDiv = document.getElementById('weatherResult');
    const city = input.value.trim();

    if (!city) {
      if (typeof showNotification === 'function') showNotification("City name likhoo!", "error");
      return;
    }

    resultDiv.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <div style="width:40px;height:40px;border:3px solid var(--primary);border-top-color:transparent;
                    border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div>
        <p style="color:var(--primary);font-weight:700;">Weather check korchi baby...</p>
      </div>
    `;

    try {
      // Step 1: Geocoding - city name to lat/lon
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City found hoyni! Thik naam likhoo.');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature` +
        `&timezone=auto`
      );
      const weatherData = await weatherRes.json();
      const cur = weatherData.current;

      const weatherInfo = getWeatherInfo(cur.weather_code);

      resultDiv.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));
                    padding:20px;border-radius:20px;border:2px solid var(--primary);
                    margin-top:15px;backdrop-filter:blur(10px);">

          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:4rem;margin-bottom:5px;">${weatherInfo.icon}</div>
            <p style="color:var(--primary);font-weight:900;font-size:1.1rem;margin:0;">
              ${name}, ${country}
            </p>
            <p style="font-size:0.75rem;opacity:0.7;color:var(--text);margin:5px 0 0 0;">
              ${weatherInfo.label}
            </p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;text-align:center;">
              <p style="font-size:0.65rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;letter-spacing:1px;">TEMPERATURE</p>
              <p style="font-size:2rem;font-weight:900;color:var(--primary);margin:0;">${cur.temperature_2m}°C</p>
            </div>
            <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;text-align:center;">
              <p style="font-size:0.65rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;letter-spacing:1px;">FEELS LIKE</p>
              <p style="font-size:2rem;font-weight:900;color:var(--primary);margin:0;">${cur.apparent_temperature}°C</p>
            </div>
            <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;text-align:center;">
              <p style="font-size:0.65rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;letter-spacing:1px;">HUMIDITY</p>
              <p style="font-size:2rem;font-weight:900;color:var(--primary);margin:0;">${cur.relative_humidity_2m}%</p>
            </div>
            <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;text-align:center;">
              <p style="font-size:0.65rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;letter-spacing:1px;">WIND</p>
              <p style="font-size:2rem;font-weight:900;color:var(--primary);margin:0;">${cur.wind_speed_10m}</p>
              <p style="font-size:0.6rem;opacity:0.6;color:var(--text);margin:0;">km/h</p>
            </div>
          </div>

          <p style="font-size:0.65rem;opacity:0.5;text-align:center;margin-top:15px;color:var(--text);">
            <i class="fas fa-clock"></i> Updated: ${new Date().toLocaleTimeString()}
          </p>
        </div>
      `;

      if (typeof showNotification === 'function') showNotification(`✅ ${name} er weather loaded!`, "success");

    } catch (error) {
      resultDiv.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(255,65,108,0.1),rgba(255,75,43,0.1));
                    padding:25px;border-radius:20px;border:2px solid var(--danger);
                    text-align:center;margin-top:15px;">
          <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:15px;"></i>
          <p style="color:var(--danger);font-weight:700;">${error.message || "Weather load hoyni!"}</p>
          <button onclick="handleWeather()"
                  style="margin-top:15px;background:var(--primary);color:#000;border:none;
                         padding:10px 20px;border-radius:10px;font-weight:900;cursor:pointer;">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
      `;
      if (typeof showNotification === 'function') showNotification("❌ Weather load hoyni.", "error");
    }
  };

  // Weather code to icon/label mapper
  function getWeatherInfo(code) {
    if (code === 0) return { icon: '☀️', label: 'Clear Sky' };
    if (code <= 2) return { icon: '⛅', label: 'Partly Cloudy' };
    if (code === 3) return { icon: '☁️', label: 'Overcast' };
    if (code <= 49) return { icon: '🌫️', label: 'Foggy' };
    if (code <= 59) return { icon: '🌦️', label: 'Drizzle' };
    if (code <= 69) return { icon: '🌧️', label: 'Rainy' };
    if (code <= 79) return { icon: '❄️', label: 'Snowfall' };
    if (code <= 82) return { icon: '🌧️', label: 'Rain Showers' };
    if (code <= 86) return { icon: '🌨️', label: 'Snow Showers' };
    if (code <= 99) return { icon: '⛈️', label: 'Thunderstorm' };
    return { icon: '🌡️', label: 'Unknown' };
  }

  // Enter key support
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.activeElement.id === 'weatherInput') {
      handleWeather();
    }
  });

  // ===== RUN =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWeatherUI);
  } else {
    injectWeatherUI();
  }

  console.log('[Saif Plugin: weather] Loaded ✅');

})();
