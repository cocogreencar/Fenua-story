import { useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EmergencyIcon from "@mui/icons-material/Emergency";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TranslateIcon from "@mui/icons-material/Translate";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloudIcon from "@mui/icons-material/Cloud";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

export default function PracticalPage() {
  const { lang } = useLanguage();
  const [selectedIsland, setSelectedIsland] = useState("moorea");

  const islands = [
    { id: "moorea", label: lang === "fr" ? "Moorea" : "Moorea" },
    { id: "tahiti", label: lang === "fr" ? "Tahiti" : "Tahiti" },
    { id: "bora-bora", label: lang === "fr" ? "Bora Bora" : "Bora Bora" },
  ];

  const cards = [
    {
      icon: <CurrencyExchangeIcon sx={{ fontSize: 36, color: "#64b5f6" }} />,
      label: lang === "fr" ? "Convertisseur" : "Currency converter",
      emoji: "💱",
    },
    {
      icon: <EmergencyIcon sx={{ fontSize: 36, color: "#ef5350" }} />,
      label: lang === "fr" ? "Urgences" : "Emergency",
      emoji: "🆘",
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 36, color: "#66bb6a" }} />,
      label: lang === "fr" ? "Autour de moi" : "Nearby",
      emoji: "🏥",
    },
    {
      icon: <TranslateIcon sx={{ fontSize: 36, color: "#ffca28" }} />,
      label: lang === "fr" ? "Petit lexique" : "Useful phrases",
      emoji: "🌺",
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 36, color: "#ffca28" }} />,
      label: lang === "fr" ? "À savoir" : "Good to know",
      emoji: "💡",
    },
    {
      icon: <CloudIcon sx={{ fontSize: 36, color: "#64b5f6" }} />,
      label: lang === "fr" ? "Météo détaillée" : "Detailed weather",
      emoji: "☀️",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
        display: "flex",
        flexDirection: "column",
        px: { xs: 3, sm: 4 },
        pt: { xs: 4, sm: 6 },
        pb: { xs: 10, sm: 10 },
      }}
    >
      {/* Title */}
      <Fade in timeout={600}>
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
            mb: 3,
            letterSpacing: 0.5,
          }}
        >
          {lang === "fr" ? "Pratique" : "Practical"}
        </Typography>
      </Fade>

      {/* Weather preview card */}
      <Fade in timeout={700}>
        <Card
          sx={{
            borderRadius: 4,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            mb: 4,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <WbSunnyIcon sx={{ color: "#ffca28", fontSize: 28 }} />
              <Typography
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {lang === "fr" ? "Météo" : "Weather"}
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={selectedIsland}
              exclusive
              onChange={(e, val) => val && setSelectedIsland(val)}
              sx={{
                width: "100%",
                "& .MuiToggleButton-root": {
                  flex: 1,
                  color: "rgba(255,255,255,0.6)",
                  borderColor: "rgba(255,255,255,0.12)",
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  fontWeight: 500,
                  py: 1,
                  textTransform: "none",
                  "&.Mui-selected": {
                    color: "#64b5f6",
                    bgcolor: "rgba(100,181,246,0.12)",
                    "&:hover": { bgcolor: "rgba(100,181,246,0.18)" },
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                },
              }}
            >
              {islands.map((island) => (
                <ToggleButton key={island.id} value={island.id}>
                  {island.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box
              sx={{
                mt: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 80,
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              {lang === "fr"
                ? "Aperçu météo à venir"
                : "Weather preview coming soon"}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* 2-column grid of cards */}
      <Fade in timeout={800}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {cards.map((card, idx) => (
            <Card
              key={idx}
              sx={{
                borderRadius: 4,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition:
                  "transform 0.25s ease, background 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  background: "rgba(255,255,255,0.08)",
                },
                "&:active": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  py: { xs: 2.5, sm: 3 },
                  px: 1.5,
                }}
              >
                <Box sx={{ mb: 1.5 }}>{card.icon}</Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Fade>

      <BottomNav />
    </Box>
  );
}
