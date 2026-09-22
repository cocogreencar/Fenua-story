import { Modal, Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../context/LanguageContext";

const CATEGORIES = [
  {
    id: "essentials",
    fr: "Essentiels",
    en: "Essentials",
    emoji: "✋",
    phrases: [
      { tahitian: "Ia ora na", fr: "Bonjour", en: "Hello" },
      { tahitian: "Māuruuru", fr: "Merci", en: "Thank you" },
      { tahitian: "Nānā", fr: "Au revoir", en: "Goodbye" },
      { tahitian: "Maita'i", fr: "Bien", en: "Good" },
      { tahitian: "Manuia!", fr: "Santé !", en: "Cheers!" },
      { tahitian: "'E", fr: "Oui", en: "Yes" },
      { tahitian: "'Aita", fr: "Non", en: "No" },
    ],
  },
  {
    id: "politeness",
    fr: "Politesse",
    en: "Politeness",
    emoji: "🤝",
    phrases: [
      { tahitian: "'Aita e pe'ape'a", fr: "Pas de problème", en: "No problem" },
      { tahitian: "Haere mai", fr: "Bienvenue", en: "Welcome" },
      { tahitian: "Fa'aitoito", fr: "Courage", en: "Keep going" },
    ],
  },
  {
    id: "useful",
    fr: "Utile",
    en: "Useful",
    emoji: "💬",
    phrases: [
      { tahitian: "E aha te moni?", fr: "Combien ça coûte ?", en: "How much is it?" },
      { tahitian: "Te vai ra...?", fr: "Y a-t-il...?", en: "Is there...?" },
      { tahitian: "I hea...?", fr: "Où est...?", en: "Where is...?" },
    ],
  },
  {
    id: "food",
    fr: "Nourriture & Boissons",
    en: "Food & Drink",
    emoji: "🍽️",
    phrases: [
      { tahitian: "Mā'a", fr: "Nourriture", en: "Food" },
      { tahitian: "Pape", fr: "Eau", en: "Water" },
      { tahitian: "Mā'a maita'i", fr: "Bon repas", en: "Good food" },
    ],
  },
  {
    id: "local",
    fr: "Mots locaux",
    en: "Local words",
    emoji: "🌴",
    phrases: [
      { tahitian: "Fenua", fr: "Terre, pays", en: "Land, country" },
      { tahitian: "Moana", fr: "Océan", en: "Ocean" },
      { tahitian: "Motu", fr: "Îlot", en: "Small island" },
      { tahitian: "Mahana", fr: "Soleil, jour", en: "Sun, day" },
    ],
  },
];

export default function PhrasesPanel({ open, onClose }) {
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
            width: { xs: "92%", sm: 420 },
            maxWidth: 440,
            maxHeight: "85vh",
            bgcolor: "rgba(13, 30, 48, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
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
              p: { xs: 2.5, sm: 3 },
              pb: 2,
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem" }}
            >
              {isFr ? "Petit lexique tahitien" : "Useful Tahitian phrases"}
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

          {/* Scrollable content */}
          <Box
            sx={{
              overflowY: "auto",
              px: { xs: 2.5, sm: 3 },
              pb: 3,
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
              },
            }}
          >
            {CATEGORIES.map((category) => (
              <Box key={category.id} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>{category.emoji}</Typography>
                  <Typography
                    sx={{
                      color: "#64b5f6",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {isFr ? category.fr : category.en}
                  </Typography>
                </Box>

                {category.phrases.map((phrase, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      py: 1.25,
                      px: 2,
                      mb: 0.75,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {phrase.tahitian}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.82rem",
                        mt: 0.25,
                      }}
                    >
                      {isFr ? phrase.fr : phrase.en}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
