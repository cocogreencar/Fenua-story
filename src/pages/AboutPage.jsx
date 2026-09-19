import { Box, Typography, Fade, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

export default function AboutPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
        display: "flex",
        flexDirection: "column",
        px: { xs: 3, sm: 4 },
        pt: { xs: 2, sm: 4 },
        pb: { xs: 10, sm: 10 },
      }}
    >
      {/* Back arrow */}
      <IconButton
        onClick={() => navigate("/more")}
        sx={{
          color: "#fff",
          mb: 1,
          width: 40,
          height: 40,
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Logo */}
      <Fade in timeout={600}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img
            src="/logo_2.3.png"
            alt="Fenua Stories"
            style={{
              height: 80,
              maxHeight: 100,
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />
        </Box>
      </Fade>

      <Fade in timeout={800}>
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.3rem", sm: "1.6rem" },
            mb: 3,
            letterSpacing: 0.5,
          }}
        >
          {lang === "fr" ? "À propos de Fenua Stories" : "About Fenua Stories"}
        </Typography>
      </Fade>

      <Fade in timeout={900}>
        <Box sx={{ maxWidth: 600 }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            {lang === "fr"
              ? "Fenua Stories vous invite à découvrir la Polynésie autrement, à travers ses lieux, ses histoires et son patrimoine. Explorez les îles de Polynésie à votre rythme grâce à nos cartes et contenus audio."
              : "Fenua Stories invites you to discover French Polynesia differently, through its places, stories and heritage. Explore the islands of French Polynesia at your own pace with our maps and audio content."}
          </Typography>

          <Typography
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              fontSize: { xs: "1.05rem", sm: "1.15rem" },
              mb: 1.5,
            }}
          >
            {lang === "fr" ? "Contenus protégés" : "Protected content"}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            {lang === "fr"
              ? "Les textes, photographies, illustrations et contenus audio proposés dans Fenua Stories sont protégés par le droit d'auteur. Toute reproduction, copie, enregistrement, diffusion ou utilisation en dehors de l'application sans autorisation préalable est interdite."
              : "The texts, photographs, illustrations and audio content available in Fenua Stories are protected by copyright. Any reproduction, copying, recording, distribution or use outside the application without prior authorization is prohibited."}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.85rem",
              fontStyle: "italic",
            }}
          >
            {lang === "fr"
              ? "© Fenua Stories — Tous droits réservés."
              : "© Fenua Stories — All rights reserved."}
          </Typography>
        </Box>
      </Fade>

      <BottomNav />
    </Box>
  );
}
