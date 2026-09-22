import { useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
import { fetchWeather, getCachedWeather, isCacheStale } from "../services/weatherService";
import WeatherAnimation from "./WeatherAnimation";

const ISLAND_LABELS = {
  moorea: { en: "Moorea", fr: "Moorea" },
  tahiti: { en: "Tahiti", fr: "Tahiti" },
  "bora-bora": { en: "Bora Bora", fr: "Bora Bora" },
};

function formatTime(dt, lang) {
  const date = new Date(dt * 1000);
  const hours = date.getHours();
  const minutes = "00";
  if (lang === "fr") {
    return `${hours}h`;
  }
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}${ampm}`;
}

function getForecastIcon(icon) {
  const map = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "🌤️",
    "02n": "🌙",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌦️",
    "09n": "🌦️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return map[icon] || "☀️";
}

export default function WeatherCard({ selectedIsland }) {
  const { lang } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stale, setStale] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    const cached = getCachedWeather(selectedIsland);
    if (cached) {
      setWeather(cached);
      setStale(isCacheStale(cached));
      setError(false);
      setLoading(false);
    } else {
      setWeather(null);
      setLoading(true);
      setError(false);
      setStale(false);
    }

    (async () => {
      try {
        const data = await fetchWeather(selectedIsland, lang);
        if (!controller.signal.aborted) {
          setWeather(data);
          setError(false);
          setStale(false);
          setLoading(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          if (cached) {
            setWeather(cached);
            setStale(true);
            setError(false);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [selectedIsland, lang]);

  const t = (en, fr) => (lang === "fr" ? fr : en);

  return (
    <>
      {loading && !weather && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
          }}
        >
          <CircularProgress size={28} sx={{ color: "rgba(100,181,246,0.6)" }} />
        </Box>
      )}

      {error && !weather && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.9rem",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {t("Weather unavailable offline", "Météo indisponible hors connexion")}
        </Box>
      )}

      {weather && (
        <>
          {/* Current weather */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 1,
            }}
          >
            <WeatherAnimation icon={weather.current.icon} code={weather.current.code} />

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: "2.2rem",
                fontWeight: 300,
                lineHeight: 1,
                mt: 0.5,
              }}
            >
              {weather.current.temp}°
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
                textTransform: "capitalize",
                mt: 0.5,
              }}
            >
              {weather.current.description}
            </Typography>

            {/* Stats row */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3 },
                mt: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}
                >
                  {t("Feels", "Ressenti")}
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: "0.95rem", fontWeight: 500 }}>
                  {weather.current.feelsLike}°
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}
                >
                  {t("Humidity", "Humidité")}
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: "0.95rem", fontWeight: 500 }}>
                  {weather.current.humidity}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}
                >
                  {t("Wind", "Vent")}
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: "0.95rem", fontWeight: 500 }}>
                  {weather.current.windSpeed} km/h
                </Typography>
              </Box>
              {weather.current.rainProbability != null && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}
                  >
                    {t("Rain", "Pluie")}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "0.95rem", fontWeight: 500 }}>
                    {weather.current.rainProbability}%
                  </Typography>
                </Box>
              )}
            </Box>

            {stale && (
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.7rem",
                  fontStyle: "italic",
                  mt: 1.5,
                }}
              >
                {t("May not be current", "Peut ne pas être à jour")}
              </Typography>
            )}
          </Box>

          {/* Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <Box
              sx={{
                mt: 2.5,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                pt: 2,
                overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  minWidth: "min-content",
                  px: 0.5,
                }}
              >
                {weather.forecast.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 56,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}
                    >
                      {formatTime(item.time, lang)}
                    </Typography>
                    <Typography sx={{ fontSize: "1.4rem", mt: 0.5 }}>
                      {getForecastIcon(item.icon)}
                    </Typography>
                    <Typography
                      sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 500, mt: 0.5 }}
                    >
                      {item.temp}°
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}
