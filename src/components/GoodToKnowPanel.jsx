import { Modal, Box, Typography, IconButton, Fade, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useLanguage } from "../context/LanguageContext";

const SECTIONS = [
  {
    emoji: "💧",
    fr: "Eau du robinet",
    en: "Tap water",
    frText:
      "À Bora Bora, l'eau du réseau est potable. À Tahiti et Moorea, cela dépend du secteur : en cas de doute, renseignez-vous auprès de votre hébergement ou privilégiez l'eau en bouteille.",
    enText:
      "In Bora Bora, tap water is drinkable. In Tahiti and Moorea, it depends on the area. If in doubt, ask your accommodation or use bottled water.",
  },
  {
    emoji: "☀️",
    fr: "Soleil",
    en: "Sun",
    frText:
      "Le soleil tropical peut être très fort, même lorsque le ciel est couvert. Pensez à vous protéger et à bien vous hydrater.",
    enText:
      "The tropical sun can be very strong, even on cloudy days. Remember sun protection and stay hydrated.",
  },
  {
    emoji: "🦟",
    fr: "Moustiques",
    en: "Mosquitoes",
    frText:
      "Prévoyez un répulsif, particulièrement en fin de journée et dans les zones humides.",
    enText:
      "Use mosquito repellent, especially in the evening and in humid areas.",
  },
  {
    emoji: "💵",
    fr: "Argent",
    en: "Money",
    frText:
      "La monnaie locale est le franc Pacifique (XPF). Gardez un peu d'espèces : certains petits commerces ou prestataires n'acceptent pas la carte.",
    enText:
      "The local currency is the Pacific Franc (XPF). Keep some cash as some small shops or providers may not accept cards.",
  },
  {
    emoji: "🚗",
    fr: "Sur la route",
    en: "On the road",
    frText:
      "Prenez votre temps : les distances sont courtes mais la circulation peut être lente, particulièrement à Tahiti.",
    enText:
      "Take your time. Distances are short, but traffic can be slow, especially in Tahiti.",
  },
  {
    emoji: "🌴",
    fr: "Rythme des îles",
    en: "Island life",
    frText:
      "Les commerces et services peuvent fermer plus tôt qu'en métropole et l'activité est plus réduite le dimanche.",
    enText:
      "Shops and services may close earlier than you expect and activity is generally quieter on Sundays.",
  },
  {
    emoji: "🌺",
    fr: "Respect du fenua",
    en: "Respect the fenua",
    frText:
      "Respectez les propriétés privées, les lieux culturels et naturels et ne laissez aucun déchet derrière vous.",
    enText:
      "Respect private property, cultural and natural sites, and leave no litter behind.",
  },
  {
    emoji: "🌊",
    fr: "Baignade",
    en: "Swimming",
    frText:
      "Soyez prudent près des passes, récifs et embouchures de rivière, particulièrement après de fortes pluies.",
    enText:
      "Be careful near passes, reefs and river mouths, especially after heavy rain.",
  },
];

export default function GoodToKnowPanel({ open, onClose }) {
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
            width: { xs: "90%", sm: 420 },
            maxWidth: 440,
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
              mb: 2.5,
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.15rem" }}
            >
              {isFr ? "Bon à savoir" : "Good to know"}
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
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              pr: 0.5,
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
              },
            }}
          >
            {SECTIONS.map((section, idx) => (
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontSize: "1.4rem" }}>
                    {section.emoji}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {isFr ? section.fr : section.en}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.82rem",
                    lineHeight: 1.55,
                  }}
                >
                  {isFr ? section.frText : section.enText}
                </Typography>
              </Box>
            ))}

            {/* Sunset Paradise recommendation */}
            <Box
              sx={{
                mt: 0.5,
                mb: 1,
                p: 2.5,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(255,167,38,0.08) 0%, rgba(255,138,101,0.06) 100%)",
                border: "1px solid rgba(255,167,38,0.18)",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.6rem", mb: 1 }}>🌅</Typography>
              <Typography
                sx={{
                  color: "#ffb74d",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  mb: 1,
                }}
              >
                {isFr
                  ? "Envie d'un beau coucher de soleil ?"
                  : "Looking for the perfect sunset?"}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  mb: 2,
                }}
              >
                {isFr
                  ? "Découvrez Sunset Paradise, l'application qui vous aide à trouver les meilleurs endroits pour admirer le coucher de soleil en Polynésie."
                  : "Discover Sunset Paradise, the app that helps you find the best places to enjoy the sunset in French Polynesia."}
              </Typography>
              <Button
                variant="contained"
                disabled
                startIcon={<OpenInNewIcon />}
                sx={{
                  bgcolor: "#ffb74d",
                  color: "#0a1929",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  "&.Mui-disabled": {
                    bgcolor: "rgba(255,183,77,0.3)",
                    color: "rgba(10,25,41,0.6)",
                  },
                }}
              >
                {isFr ? "Découvrir Sunset Paradise" : "Discover Sunset Paradise"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
