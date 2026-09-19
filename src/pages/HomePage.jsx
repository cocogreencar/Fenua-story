import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, Tooltip, Collapse, Box } from "@mui/material";
import MapView from "../components/MapView";
import { useLanguage } from "../context/LanguageContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getIslandById } from "../data/islands";

const HomePage = () => {
  const navigate = useNavigate();
  const { islandId } = useParams();
  const { lang } = useLanguage();
  const [legendOpen, setLegendOpen] = useState(false);

  const island = getIslandById(islandId) || getIslandById("moorea");

  const legendItems = [
    {
      icon: "/icons/m1-01.svg",
      label: lang === "fr" ? "Point d'intérêt" : "Point of interest",
    },
    {
      icon: "/icons/m3-01.svg",
      label: lang === "fr" ? "Restaurants" : "Restaurants",
    },
    {
      icon: "/icons/m2-01.svg",
      label: lang === "fr" ? "Activités touristiques" : "Tourist activities",
    },
  ];

  return (
    <div>
      {/* Back button — small circular arrow, top-left */}
      <Tooltip
        title={lang === "fr" ? "Retour aux îles" : "Back to islands"}
        arrow
        placement="right"
      >
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 9999,
            width: 40,
            height: 40,
            bgcolor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>

      {/* Collapsible legend — bottom-left, away from Mapbox controls (top-right) */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: 10,
          zIndex: 1,
          maxWidth: { xs: 180, sm: 220 },
        }}
      >
        {legendOpen && (
          <Collapse in={legendOpen} timeout="auto">
            <Box
              sx={{
                p: 1.5,
                background: "rgba(255, 255, 255, 0.35)",
                backdropFilter: "blur(10px)",
                borderRadius: "14px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                fontFamily: "Inter, sans-serif",
                border: "1px solid rgba(244, 167, 167, 0.5)",
                mb: 0.5,
              }}
            >
              {legendItems.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <img
                    src={item.icon}
                    alt=""
                    style={{ width: 24, height: 24 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {item.label}
                  </span>
                </Box>
              ))}
            </Box>
          </Collapse>
        )}
        <IconButton
          onClick={() => setLegendOpen((prev) => !prev)}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(244, 167, 167, 0.5)",
            borderRadius: "14px",
            color: "#333",
            width: 36,
            height: 36,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.5)" },
          }}
        >
          {legendOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <MapView lang={lang} island={island} />
    </div>
  );
};

export default HomePage;
