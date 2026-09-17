import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapView from "../components/MapView";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitch from "../components/LanguageSwitch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getIslandById } from "../data/islands";

const HomePage = () => {
  const navigate = useNavigate();
  const { islandId } = useParams();
  const { lang } = useLanguage(); // ← get current language ("en" | "fr")

  const island = getIslandById(islandId) || getIslandById("moorea");

  const Icons = {
    "Point of interest": "/icons/m1-01.svg",
    Restaurants: "/icons/m3-01.svg",
    "Tourist activities": "/icons/m2-01.svg",
  };

  return (
    <div>
      <div
        className="logo-container"
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 9999,
          backdropFilter: "blur(8px)",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
        }}
      >
        <img
          // src="/logo.png"
          // src="/logo_2.1.svg"
          src="/logo_2.3.png"
          alt="Logo"
          style={{
            height: "150px",
            objectFit: "contain",
            borderRadius: "10px",
          }}
          className="logo-image"
        />
      </div>

      {/* Back to island selection */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 20,
          left: 180,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
        }
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        {lang === "fr" ? "Îles" : "Islands"}
      </button>

      {/* LEGEND BOX */}
      <div
        className="legend-container"
        style={{
          position: "absolute",
          bottom: 30,
          right: 10,
          zIndex: 1,
          padding: "12px 16px",
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(10px)",
          borderRadius: "14px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontFamily: "Inter, sans-serif",
          border: "1px solid rgba(244, 167, 167, 0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/icons/m1-01.svg" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Point of interest
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/icons/m3-01.svg" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Restaurants</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/icons/m2-01.svg" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Tourist activities
          </span>
        </div>
      </div>

      <LanguageSwitch />
      <MapView lang={lang} island={island} />
    </div>
  );
};

export default HomePage;
