import { useState } from "react";
import { Modal, Box, Typography, IconButton, Fade, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useLanguage } from "../context/LanguageContext";

const OPTIONS = [
  {
    id: "ferry",
    emoji: "⛴️",
    fr: "Bateau",
    en: "Ferry",
    subFr: "Liaisons maritimes",
    subEn: "Ferry services",
  },
  {
    id: "car",
    emoji: "🚗",
    fr: "Louer une voiture",
    en: "Rent a car",
    subFr: "Location par île",
    subEn: "Car rental by island",
  },
  {
    id: "flights",
    emoji: "✈️",
    fr: "Avion",
    en: "Flights",
    subFr: "Vols inter-îles",
    subEn: "Inter-island flights",
  },
];

const CAR_RENTALS = [
  {
    island: "Moorea",
    name: "Coco Green Car",
    url: "https://www.cocogreencar.com/",
  },
  {
    island: "Tahiti",
    name: "Ecocar",
    url: "https://www.ecocar-tahiti.com/",
  },
  {
    island: "Bora Bora",
    name: "Avis Bora Bora",
    url: "https://www.avis-borabora.com/",
  },
];

const FERRY_URL = {
  fr: "https://www.horaires-tahiti.com/",
  en: "https://www.horaires-tahiti.com/en/",
};

const FLIGHTS = [
  { name: "Air Tahiti", url: "https://www.airtahiti.com/" },
  { name: "Air Moana", url: "https://www.airmoana.com/" },
];

export default function TransportPanel({ open, onClose }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [view, setView] = useState("main");

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleClose = () => {
    setView("main");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.6)" } },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: 420,
            maxHeight: "85vh",
            bgcolor: "rgba(13, 30, 48, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            p: { xs: 2.5, sm: 3 },
            outline: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {view !== "main" && (
                <IconButton
                  onClick={() => setView("main")}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": { color: "#fff" },
                    p: 0.5,
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Typography
                sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.15rem" }}
              >
                {view === "ferry"
                  ? isFr
                    ? "Bateau"
                    : "Ferry"
                  : view === "car"
                    ? isFr
                      ? "Louer une voiture"
                      : "Rent a car"
                    : view === "flights"
                      ? isFr
                        ? "Vols inter-îles"
                        : "Inter-island flights"
                      : isFr
                        ? "Transport"
                        : "Transport"}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "rgba(255,255,255,0.6)",
                "&:hover": { color: "#fff" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main view */}
          {view === "main" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {OPTIONS.map((option) => (
                <Box
                  key={option.id}
                  onClick={() => setView(option.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                    px: 2.5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "background 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      background: "rgba(100,181,246,0.08)",
                      borderColor: "rgba(100,181,246,0.15)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "2rem" }}>{option.emoji}</Typography>
                  <Box>
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {isFr ? option.fr : option.en}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "0.78rem",
                        mt: 0.25,
                      }}
                    >
                      {isFr ? option.subFr : option.subEn}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Ferry view */}
          {view === "ferry" && (
            <Box
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                },
              }}
            >
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography sx={{ fontSize: "3rem", mb: 2 }}>⛴️</Typography>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    mb: 1,
                  }}
                >
                  {isFr
                    ? "Horaires Tahiti ↔ Moorea"
                    : "Tahiti ↔ Moorea Ferry"}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    mb: 3,
                    px: 1,
                  }}
                >
                  {isFr
                    ? "Consultez les horaires des ferries entre Tahiti et Moorea."
                    : "Check ferry schedules between Tahiti and Moorea."}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => openExternal(FERRY_URL[lang])}
                  startIcon={<OpenInNewIcon />}
                  sx={{
                    bgcolor: "#64b5f6",
                    color: "#0a1929",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    "&:hover": { bgcolor: "#42a5f5" },
                  }}
                >
                  {isFr ? "Voir les horaires" : "View schedules"}
                </Button>
              </Box>
            </Box>
          )}

          {/* Flights view */}
          {view === "flights" && (
            <Box
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                },
              }}
            >
              <Typography sx={{ fontSize: "3rem", textAlign: "center", mb: 2 }}>
                ✈️
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                {isFr
                  ? "Réservez vos vols entre les îles de Polynésie."
                  : "Book your flights between the islands of French Polynesia."}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {FLIGHTS.map((flight) => (
                  <Box
                    key={flight.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      py: 1.75,
                      px: 2,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Typography sx={{ color: "#ffffff", fontWeight: 600 }}>
                      {flight.name}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openExternal(flight.url)}
                      startIcon={<OpenInNewIcon />}
                      sx={{
                        bgcolor: "#64b5f6",
                        color: "#0a1929",
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.75,
                        whiteSpace: "nowrap",
                        "&:hover": { bgcolor: "#42a5f5" },
                      }}
                    >
                      {isFr ? "Voir les vols" : "View flights"}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Car rental view */}
          {view === "car" && (
            <Box
              sx={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                },
              }}
            >
              {CAR_RENTALS.map((rental, idx) => (
                <Box
                  key={idx}
                  sx={{
                    py: 2,
                    px: 2.5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#64b5f6",
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 0.5,
                    }}
                  >
                    {rental.island}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      mb: 1.5,
                    }}
                  >
                    {rental.name}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => openExternal(rental.url)}
                    startIcon={<OpenInNewIcon />}
                    sx={{
                      bgcolor: "#66bb6a",
                      color: "#0a1929",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      "&:hover": { bgcolor: "#4caf50" },
                    }}
                  >
                    {isFr ? "Réserver" : "Book"}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
