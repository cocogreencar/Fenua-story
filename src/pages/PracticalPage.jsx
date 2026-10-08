import { useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Modal,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EmergencyIcon from "@mui/icons-material/Emergency";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TranslateIcon from "@mui/icons-material/Translate";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LanguageIcon from "@mui/icons-material/Language";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";
import WeatherCard from "../components/WeatherCard";
import CurrencyConverter from "../components/CurrencyConverter";
import NearbyPanel from "../components/NearbyPanel";
import PhrasesPanel from "../components/PhrasesPanel";
import TransportPanel from "../components/TransportPanel";
import EmergencyPanel from "../components/EmergencyPanel";
import GoodToKnowPanel from "../components/GoodToKnowPanel";

export default function PracticalPage() {
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [selectedIsland, setSelectedIsland] = useState("moorea");
  const [converterOpen, setConverterOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [phrasesOpen, setPhrasesOpen] = useState(false);
  const [transportOpen, setTransportOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [goodToKnowOpen, setGoodToKnowOpen] = useState(false);

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
      onClick: () => setConverterOpen(true),
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 36, color: "#66bb6a" }} />,
      label: lang === "fr" ? "Autour de moi" : "Nearby",
      emoji: "🏥",
      onClick: () => setNearbyOpen(true),
    },
    {
      icon: <TranslateIcon sx={{ fontSize: 36, color: "#ffca28" }} />,
      label: lang === "fr" ? "Petit lexique" : "Useful phrases",
      emoji: "🌺",
      onClick: () => setPhrasesOpen(true),
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 36, color: "#ffca28" }} />,
      label: lang === "fr" ? "À savoir" : "Good to know",
      emoji: "💡",
      onClick: () => setGoodToKnowOpen(true),
    },
    {
      icon: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <DirectionsCarIcon sx={{ fontSize: 22, color: "#64b5f6" }} />
          <DirectionsBoatIcon sx={{ fontSize: 22, color: "#64b5f6" }} />
          <FlightIcon sx={{ fontSize: 22, color: "#64b5f6" }} />
        </Box>
      ),
      label: lang === "fr" ? "Transport" : "Transport",
      emoji: "🚢",
      onClick: () => setTransportOpen(true),
    },
    {
      icon: <EmergencyIcon sx={{ fontSize: 36, color: "#ef5350" }} />,
      label: lang === "fr" ? "Urgences" : "Emergency",
      emoji: "🆘",
      onClick: () => setEmergencyOpen(true),
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

            <WeatherCard selectedIsland={selectedIsland} />
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
              onClick={card.onClick}
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

      <CurrencyConverter
        open={converterOpen}
        onClose={() => setConverterOpen(false)}
      />

      <NearbyPanel
        open={nearbyOpen}
        onClose={() => setNearbyOpen(false)}
      />

      <PhrasesPanel
        open={phrasesOpen}
        onClose={() => setPhrasesOpen(false)}
      />

      <TransportPanel
        open={transportOpen}
        onClose={() => setTransportOpen(false)}
      />

      <EmergencyPanel
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />

      <GoodToKnowPanel
        open={goodToKnowOpen}
        onClose={() => setGoodToKnowOpen(false)}
      />

      {/* More section (integrated from MorePage) */}
      <Fade in timeout={1000}>
        <Box sx={{ mt: 4, maxWidth: 600 }}>
          <Typography
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: { xs: "1.3rem", sm: "1.6rem" },
              mb: 3,
              letterSpacing: 0.5,
            }}
          >
            {lang === "fr" ? "Plus" : "More"}
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <List sx={{ p: 0 }}>
              {[
                {
                  icon: <LanguageIcon sx={{ color: "#64b5f6" }} />,
                  label: lang === "fr" ? "Langue" : "Language",
                  value: lang === "fr" ? "Français" : "English",
                  onClick: toggleLang,
                },
                {
                  icon: <InfoIcon sx={{ color: "#64b5f6" }} />,
                  label:
                    lang === "fr"
                      ? "À propos de Fenua Stories"
                      : "About Fenua Stories",
                  value: "",
                  onClick: () => navigate("/about"),
                },
              ].map((entry, idx, arr) => (
                <Box key={idx}>
                  <ListItem
                    onClick={entry.onClick}
                    sx={{
                      cursor: entry.onClick ? "pointer" : "default",
                      py: 2,
                      px: 3,
                      transition: "background 0.2s ease",
                      "&:hover": entry.onClick
                        ? { background: "rgba(255,255,255,0.05)" }
                        : {},
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{entry.icon}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: "#ffffff",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                          }}
                        >
                          {entry.label}
                        </Typography>
                      }
                      secondary={
                        entry.value ? (
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: "0.8rem",
                            }}
                          >
                            {entry.value}
                          </Typography>
                        ) : null
                      }
                    />
                  </ListItem>
                  {idx < arr.length - 1 && (
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                  )}
                </Box>
              ))}
            </List>
          </Box>
        </Box>
      </Fade>

      <BottomNav />
    </Box>
  );
}
