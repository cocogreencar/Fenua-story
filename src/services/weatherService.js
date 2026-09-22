const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const ISLAND_COORDS = {
  moorea: { lat: -17.5388, lon: -149.8295 },
  tahiti: { lat: -17.6509, lon: -149.4260 },
  "bora-bora": { lat: -16.5004, lon: -151.7415 },
};

const CACHE_PREFIX = "fenua_weather_";
const CACHE_TTL = 10 * 60 * 1000;

function getCacheKey(islandId) {
  return `${CACHE_PREFIX}${islandId}`;
}

function readCache(islandId) {
  try {
    const raw = localStorage.getItem(getCacheKey(islandId));
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data;
  } catch {
    return null;
  }
}

function writeCache(islandId, data) {
  try {
    localStorage.setItem(
      getCacheKey(islandId),
      JSON.stringify({ ...data, cachedAt: Date.now() })
    );
  } catch {
    // ignore
  }
}

export function getIslandCoords(islandId) {
  return ISLAND_COORDS[islandId] || null;
}

export async function fetchWeather(islandId, lang = "en") {
  const coords = ISLAND_COORDS[islandId];
  if (!coords) throw new Error("Unknown island");
  if (!API_KEY) throw new Error("Missing API key");

  const owLang = lang === "fr" ? "fr" : "en";
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lon),
    appid: API_KEY,
    units: "metric",
    lang: owLang,
  });

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${BASE_URL}/weather?${params.toString()}`),
    fetch(`${BASE_URL}/forecast?${params.toString()}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error("Weather API error");
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  const result = {
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6),
      condition: current.weather[0]?.main || "",
      description: current.weather[0]?.description || "",
      icon: current.weather[0]?.icon || "01d",
      code: current.weather[0]?.id || 800,
      rainProbability: current.rain?.["1h"] != null ? 100 : null,
    },
    forecast: forecast.list.slice(0, 8).map((item) => ({
      time: item.dt,
      temp: Math.round(item.main.temp),
      icon: item.weather[0]?.icon || "01d",
      description: item.weather[0]?.description || "",
      rainProbability: item.pop != null ? Math.round(item.pop * 100) : 0,
    })),
    fetchedAt: Date.now(),
  };

  writeCache(islandId, result);
  return result;
}

export function getCachedWeather(islandId) {
  const cached = readCache(islandId);
  if (!cached) return null;
  return cached;
}

export function isCacheStale(cached) {
  if (!cached?.cachedAt) return true;
  return Date.now() - cached.cachedAt > CACHE_TTL;
}
