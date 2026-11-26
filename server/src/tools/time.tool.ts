
export const getCurrentTime = async (city: string) => {
  // Step 1: Find city and its timezone
  const geoUrl = new URL(
    "https://geocoding-api.open-meteo.com/v1/search"
  );

  geoUrl.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  }).toString();

  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error("Failed to fetch city information");
  }

  const geoData = await geoResponse.json();
  const location = geoData.results?.[0];

  if (!location) {
    throw new Error(`City not found: ${city}`);
  }

  // Step 2: Get the city's timezone
  const timezone = location.timezone;

  if (!timezone) {
    throw new Error("Timezone not found for this city");
  }

  // Step 3: Get current local time
  const currentTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  return {
    city: location.name,
    country: location.country,
    timezone,
    currentTime,
  };
};
