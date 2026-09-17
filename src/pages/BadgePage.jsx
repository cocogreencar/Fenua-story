import { Box, Typography, Fade } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

export default function BadgePage() {
  const { lang } = useLanguage();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 3, sm: 4 },
        pt: { xs: 4, sm: 6 },
        pb: { xs: 10, sm: 10 },
      }}
    >
      {/* Logo */}
      <Fade in timeout={600}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src="/logo_2.3.png"
            alt="Fenua Stories"
            style={{
              height: "90px",
              maxHeight: "110px",
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />
        </Box>
      </Fade>

      {/* Title */}
      <Fade in timeout={800}>
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.3rem", sm: "1.7rem" },
            textAlign: "center",
            mb: 1.5,
            letterSpacing: 0.5,
          }}
        >
          {lang === "fr" ? "Votre Badge Fenua Stories" : "Your Fenua Stories Badge"}
        </Typography>
      </Fade>

      {/* Explanation */}
      <Fade in timeout={900}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontWeight: 300,
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            textAlign: "center",
            mb: 4,
            maxWidth: 400,
            lineHeight: 1.5,
          }}
        >
          {lang === "fr"
            ? "Présentez ce badge chez nos partenaires pour profiter de vos avantages exclusifs."
            : "Show this badge at participating partners to enjoy your exclusive benefits."}
        </Typography>
      </Fade>

      {/* Official badge image */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: 420, sm: 500 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/icons/badge-avantage-actif.png"
            alt="Fenua Stories Badge"
            style={{
              width: "100%",
              maxWidth: 480,
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Fade>

      {/* Placeholder for future partner offers */}
      <Box sx={{ width: "100%", maxWidth: 420, mt: 4 }}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.8rem",
            fontWeight: 300,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {lang === "fr"
            ? "Les offres partenaires arrivent bientôt"
            : "Partner offers coming soon"}
        </Typography>
      </Box>

      <BottomNav />
    </Box>
  );
}
