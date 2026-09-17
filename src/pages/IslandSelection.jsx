import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardMedia, CardContent, Fade } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
import { islands } from "../data/islands";
import BottomNav from "../components/BottomNav";

export default function IslandSelection() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelect = (island) => {
    navigate(`/map/${island.id}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 2.5, sm: 6 },
        px: { xs: 2, sm: 3 },
        pb: { xs: 10, sm: 10 },
      }}
    >
      {/* Logo */}
      <Fade in timeout={600}>
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 1.5, sm: 4 },
            mt: { xs: 1, sm: 2 },
          }}
        >
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

      {/* Subtitle */}
      <Fade in timeout={800}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 1.5,
            fontWeight: 300,
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            mb: { xs: 2.5, sm: 5 },
            textAlign: "center",
          }}
        >
          {lang === "fr" ? "Choisissez votre île" : "Choose your island"}
        </Typography>
      </Fade>

      {/* Island cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 4 },
          maxWidth: 1100,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {islands.map((island, idx) => (
          <Fade in timeout={600 + idx * 200} key={island.id}>
            <Card
              onClick={() => handleSelect(island)}
              onMouseEnter={() => setHoveredId(island.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                width: { xs: "100%", sm: 340 },
                minWidth: { xs: "100%", sm: 300 },
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                transition:
                  "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease",
                transform:
                  hoveredId === island.id
                    ? "translateY(-12px) scale(1.02)"
                    : "translateY(0) scale(1)",
                boxShadow:
                  hoveredId === island.id
                    ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 2px rgba(100,180,255,0.3)"
                    : "0 8px 24px rgba(0,0,0,0.3)",
                "&:active": {
                  transform: "translateY(-6px) scale(1.01)",
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: { xs: 180, sm: 260 },
                  transition: "transform 0.5s ease",
                  transform: hoveredId === island.id ? "scale(1.08)" : "scale(1)",
                }}
                image={island.image}
                alt={island.name[lang]}
              />

              {/* Gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)",
                  pointerEvents: "none",
                }}
              />

              <CardContent
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  pb: { xs: 2, sm: 3 },
                  px: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                    mb: 0.5,
                    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  {island.name[lang]}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 300,
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {island.tagline[lang]}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>

      <BottomNav />
    </Box>
  );
}
