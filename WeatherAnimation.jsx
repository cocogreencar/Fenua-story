import "./WeatherAnimation.css";

function getAnimationType(icon, code) {
  const isNight = icon?.endsWith("n");
  const mainGroup = Math.floor(code / 100);

  if (mainGroup === 2) return "thunderstorm";
  if (mainGroup === 3) return "drizzle";
  if (mainGroup === 5) return "rain";
  if (mainGroup === 6) return "snow";
  if (mainGroup === 7) return "mist";

  if (code === 800) return isNight ? "clear-night" : "clear-day";
  if (code === 801 || code === 802) return isNight ? "partly-cloudy-night" : "partly-cloudy-day";
  if (mainGroup === 8) return isNight ? "cloudy-night" : "clouds";

  return isNight ? "clear-night" : "clear-day";
}

export default function WeatherAnimation({ icon, code }) {
  const type = getAnimationType(icon, code);

  return (
    <div className="weather-anim-container">
      {/* Glow */}
      <div
        className={`weather-glow ${type === "clear-night" || type === "cloudy-night" || type === "partly-cloudy-night" ? "weather-glow-night" : ""}`}
      />

      {type === "clear-day" && (
        <>
          <div className="weather-sun-rays" />
          <div className="weather-sun" />
        </>
      )}

      {type === "clear-night" && (
        <>
          <div className="weather-stars">
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
          </div>
          <div className="weather-moon" />
        </>
      )}

      {type === "partly-cloudy-day" && (
        <>
          <div className="weather-sun-small-rays" />
          <div className="weather-sun-small" />
          <div className="weather-cloud weather-cloud-2" />
          <div className="weather-cloud weather-cloud-3" />
        </>
      )}

      {type === "partly-cloudy-night" && (
        <>
          <div className="weather-stars">
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
            <div className="weather-star" />
          </div>
          <div className="weather-moon" />
          <div className="weather-cloud weather-cloud-2" style={{ opacity: 0.55 }} />
        </>
      )}

      {type === "clouds" && (
        <>
          <div className="weather-cloud weather-cloud-1" />
          <div className="weather-cloud weather-cloud-2" />
          <div className="weather-cloud weather-cloud-3" />
          <div className="weather-cloud weather-cloud-4" />
        </>
      )}

      {type === "cloudy-night" && (
        <>
          <div className="weather-moon" />
          <div className="weather-cloud weather-cloud-1" style={{ opacity: 0.5 }} />
          <div className="weather-cloud weather-cloud-2" style={{ opacity: 0.4 }} />
        </>
      )}

      {type === "rain" && (
        <>
          <div className="weather-cloud weather-cloud-1" />
          <div className="weather-cloud weather-cloud-2" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
        </>
      )}

      {type === "drizzle" && (
        <>
          <div className="weather-cloud weather-cloud-1" />
          <div className="weather-cloud weather-cloud-2" />
          <div className="weather-drizzle-drop" />
          <div className="weather-drizzle-drop" />
          <div className="weather-drizzle-drop" />
          <div className="weather-drizzle-drop" />
          <div className="weather-drizzle-drop" />
        </>
      )}

      {type === "thunderstorm" && (
        <>
          <div
            className="weather-cloud weather-cloud-1"
            style={{ background: "rgba(80,80,100,0.4)" }}
          />
          <div
            className="weather-cloud weather-cloud-2"
            style={{ background: "rgba(70,70,90,0.35)" }}
          />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-rain-drop" />
          <div className="weather-lightning" />
        </>
      )}

      {type === "snow" && (
        <>
          <div className="weather-cloud weather-cloud-1" />
          <div className="weather-snowflake" />
          <div className="weather-snowflake" />
          <div className="weather-snowflake" />
          <div className="weather-snowflake" />
          <div className="weather-snowflake" />
        </>
      )}

      {type === "mist" && <div className="weather-mist" />}
    </div>
  );
}
