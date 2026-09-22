import { Modal, Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../context/LanguageContext";

const OPTIONS = [
  { emoji: "💊", fr: "Pharmacie", en: "Pharmacy", searchFr: "pharmacie", searchEn: "pharmacy" },
  { emoji: "🏥", fr: "Santé", en: "Health", searchFr: "médecin hôpital", searchEn: "doctor hospital" },
  { emoji: "🛒", fr: "Courses", en: "Groceries", searchFr: "supermarché", searchEn: "supermarket" },
  { emoji: "⛽", fr: "Station-service", en: "Gas station", searchFr: "station service", searchEn: "gas station" },
  { emoji: "🏧", fr: "Distributeur", en: "ATM", searchFr: "distributeur de billets", searchEn: "ATM" },
  { emoji: "🍴", fr: "Restaurants", en: "Restaurants", searchFr: "restaurant", searchEn: "restaurant" },
];

export default function NearbyPanel({ open, onClose }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const handleSelect = (option) => {
    const query = isFr ? option.searchFr : option.searchEn;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
              {isFr ? "Autour de moi" : "Nearby"}
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            {OPTIONS.map((option, idx) => (
              <Box
                key={idx}
                onClick={() => handleSelect(option)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  py: 2.5,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, background 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    background: "rgba(100,181,246,0.1)",
                    borderColor: "rgba(100,181,246,0.2)",
                  },
                  "&:active": { transform: "translateY(-1px)" },
                }}
              >
                <Typography sx={{ fontSize: "2rem" }}>{option.emoji}</Typography>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  {isFr ? option.fr : option.en}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
