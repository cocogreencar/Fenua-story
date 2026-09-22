import { Modal, Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../context/LanguageContext";

const OPTIONS = [
  {
    emoji: "⛴️",
    fr: "Bateau",
    en: "Ferry",
    subFr: "Liaisons maritimes",
    subEn: "Ferry services",
  },
  {
    emoji: "🚗",
    fr: "Louer une voiture",
    en: "Rent a car",
    subFr: "Location par île",
    subEn: "Car rental by island",
  },
  {
    emoji: "✈️",
    fr: "Avion",
    en: "Flights",
    subFr: "Vols inter-îles",
    subEn: "Inter-island flights",
  },
];

export default function TransportPanel({ open, onClose }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            bgcolor: "rgba(13, 30, 48, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            p: { xs: 2.5, sm: 3 },
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography
              sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.15rem" }}
            >
              {isFr ? "Transport" : "Transport"}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: "rgba(255,255,255,0.6)",
                "&:hover": { color: "#fff" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {OPTIONS.map((option, idx) => (
              <Box
                key={idx}
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
        </Box>
      </Fade>
    </Modal>
  );
}
