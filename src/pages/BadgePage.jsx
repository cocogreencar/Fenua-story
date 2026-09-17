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
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img
            src="/logo_2.3.png"
            alt="Fenua Stories"
            style={{
              height: "100px",
              maxHeight: "120px",
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
            fontSize: { xs: "1.4rem", sm: "1.8rem" },
            textAlign: "center",
            mb: 1,
            letterSpacing: 0.5,
          }}
        >
          {lang === "fr" ? "Votre Badge Fenua Stories" : "Your Fenua Stories Badge"}
        </Typography>
      </Fade>

      {/* Subtitle */}
      <Fade in timeout={900}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontWeight: 300,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            textAlign: "center",
            mb: 5,
            maxWidth: 420,
            lineHeight: 1.5,
          }}
        >
          {lang === "fr"
            ? "Présentez votre badge chez nos partenaires et profitez d'avantages exclusifs."
            : "Show your badge at participating partners and enjoy exclusive benefits."}
        </Typography>
      </Fade>

      {/* Digital badge */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            width: { xs: "100%", sm: 380 },
            maxWidth: 380,
            borderRadius: 5,
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(135deg, #0d2845 0%, #103a5c 50%, #0a1929 100%)",
            border: "2px solid rgba(100,180,255,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 0 40px rgba(100,180,255,0.05)",
            p: { xs: 3, sm: 4 },
            mb: 4,
          }}
        >
          {/* Decorative top accent */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #64b5f6, #42a5f5, #1e88e5, #64b5f6)",
            }}
          />

          {/* Badge inner content */}
          <Box sx={{ textAlign: "center", py: 2 }}>
            <img
              src="/logo_2.3.png"
              alt="Fenua Stories"
              style={{
                height: 80,
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: 16,
              }}
            />
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.3rem",
                letterSpacing: 1,
                mb: 0.5,
              }}
            >
              FENUA STORIES
            </Typography>
            <Typography
              sx={{
                color: "rgba(100,180,255,0.8)",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: 3,
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              {lang === "fr" ? "Badge Voyageur" : "Traveler Pass"}
            </Typography>

            {/* Decorative divider */}
            <Box
              sx={{
                width: "60%",
                height: 1,
                mx: "auto",
                my: 2,
                background: "linear-gradient(90deg, transparent, rgba(100,180,255,0.3), transparent)",
              }}
            />

            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.75rem",
                fontWeight: 300,
                letterSpacing: 0.5,
              }}
            >
              {lang === "fr"
                ? "Présentez ce badge à nos partenaires"
                : "Present this badge to our partners"}
            </Typography>
          </Box>

          {/* Decorative bottom accent */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #64b5f6, #42a5f5, #1e88e5, #64b5f6)",
            }}
          />
        </Box>
      </Fade>

      {/* Placeholder for future partner offers */}
      <Box sx={{ width: "100%", maxWidth: 420, mt: 2 }}>
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
