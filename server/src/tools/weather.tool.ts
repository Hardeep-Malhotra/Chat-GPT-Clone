export const getWeather = async (city: string) => {
  // Step 1: Find city coordinates
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");

  geoUrl.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  }).toString();

  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error("Failed to fetch city location");
  }

  const geoData = await geoResponse.json();

  const location = geoData.results?.[0];

  if (!location) {
    throw new Error(`City not found: ${city}`);
  }

  // Step 2: Get real weather
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");

  weatherUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    timezone: "auto",
  }).toString();

  const weatherResponse = await fetch(weatherUrl);

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const weatherData = await weatherResponse.json();

  return {
    city: location.name,
    country: location.country,
    temperature: weatherData.current.temperature_2m,
    humidity: weatherData.current.relative_humidity_2m,
    windSpeed: weatherData.current.wind_speed_10m,
    weatherCode: weatherData.current.weather_code,
    timezone: weatherData.timezone,
    source: "Open-Meteo",
  };
};
