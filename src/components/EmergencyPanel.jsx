import { Modal, Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useLanguage } from "../context/LanguageContext";

const NUMBERS = [
  {
    emoji: "🚑",
    fr: "SAMU — 15",
    en: "Medical emergency — 15",
    subFr: "Urgence médicale",
    subEn: "SAMU",
    tel: "15",
  },
  {
    emoji: "👮",
    fr: "Police / Gendarmerie — 17",
    en: "Police / Gendarmerie — 17",
    subFr: "Police et gendarmerie",
    subEn: "Police and gendarmerie",
    tel: "17",
  },
  {
    emoji: "🚒",
    fr: "Pompiers — 18",
    en: "Fire & Rescue — 18",
    subFr: "Incendie et secours",
    subEn: "Fire and rescue",
    tel: "18",
  },
  {
    emoji: "🌊",
    fr: "Secours en mer — 16",
    en: "Sea rescue — 16",
    subFr: "JRCC Tahiti",
    subEn: "JRCC Tahiti",
    tel: "16",
  },
  {
    emoji: "🆘",
    fr: "Urgences — 112",
    en: "Emergency — 112",
    subFr: "Numéro d'urgence européen",
    subEn: "European emergency number",
    tel: "112",
  },
];

export default function EmergencyPanel({ open, onClose }) {
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
              mb: 2,
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.15rem" }}
            >
              {isFr ? "Urgences" : "Emergency"}
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

          {/* Warning banner */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              p: 1.5,
              mb: 2.5,
              borderRadius: 2,
              background: "rgba(239,83,80,0.1)",
              border: "1px solid rgba(239,83,80,0.2)",
              flexShrink: 0,
            }}
          >
            <WarningAmberIcon sx={{ color: "#ef5350", fontSize: 20, mt: 0.25 }} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.8rem",
                lineHeight: 1.45,
              }}
            >
              {isFr
                ? "En cas d'urgence immédiate, appelez directement le service concerné."
                : "In an immediate emergency, call the appropriate service directly."}
            </Typography>
          </Box>

          {/* Emergency numbers */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
              },
            }}
          >
            {NUMBERS.map((item, idx) => (
              <Box
                key={idx}
                component="a"
                href={`tel:${item.tel}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 2,
                  px: 2.5,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "background 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    background: "rgba(239,83,80,0.08)",
                    borderColor: "rgba(239,83,80,0.2)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": { transform: "translateY(-1px)" },
                }}
              >
                <Typography sx={{ fontSize: "1.75rem" }}>{item.emoji}</Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {isFr ? item.fr : item.en}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.78rem",
                      mt: 0.25,
                    }}
                  >
                    {isFr ? item.subFr : item.subEn}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#ef5350",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    ml: 1,
                  }}
                >
                  {item.tel}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
