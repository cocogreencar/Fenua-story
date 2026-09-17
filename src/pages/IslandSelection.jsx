import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardMedia, CardContent, Chip, Fade } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";

const islands = [
  {
    id: "tahiti",
    name: { en: "Tahiti", fr: "Tahiti" },
    tagline: { en: "The heart of French Polynesia", fr: "Le cœur de la Polynésie" },
    image: "https://images.pexels.com/photos/33980508/pexels-photo-33980508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    active: false,
  },
  {
    id: "moorea",
    name: { en: "Moorea", fr: "Moorea" },
    tagline: { en: "The magical island", fr: "L'île magique" },
    image: "https://images.pexels.com/photos/5034190/pexels-photo-5034190.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    active: true,
  },
  {
    id: "borabora",
    name: { en: "Bora Bora", fr: "Bora Bora" },
    tagline: { en: "The pearl of the Pacific", fr: "La perle du Pacifique" },
    image: "https://images.pexels.com/photos/27272195/pexels-photo-27272195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    active: false,
  },
];

export default function IslandSelection() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelect = (island) => {
    if (island.active) {
      navigate("/map");
    }
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
        justifyContent: "center",
        py: 6,
        px: 3,
      }}
    >
      {/* Title */}
      <Fade in timeout={800}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 2,
              mb: 1,
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Fenua Stories
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 1,
              fontWeight: 300,
              fontSize: { xs: "0.85rem", sm: "1rem" },
            }}
          >
            {lang === "fr"
              ? "Choisissez votre île"
              : "Choose your island"}
          </Typography>
        </Box>
      </Fade>

      {/* Island cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
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
                width: { xs: "100%", sm: 320 },
                borderRadius: 4,
                overflow: "hidden",
                cursor: island.active ? "pointer" : "default",
                position: "relative",
                transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease",
                transform:
                  hoveredId === island.id && island.active
                    ? "translateY(-12px) scale(1.02)"
                    : "translateY(0) scale(1)",
                boxShadow:
                  hoveredId === island.id && island.active
                    ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 2px rgba(100,180,255,0.3)"
                    : "0 8px 24px rgba(0,0,0,0.3)",
                opacity: island.active ? 1 : 0.55,
                filter: island.active ? "none" : "grayscale(0.4)",
                "&:active": island.active
                  ? { transform: "translateY(-6px) scale(1.01)" }
                  : {},
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={island.image}
                alt={island.name[lang]}
                sx={{
                  transition: "transform 0.5s ease",
                  transform: hoveredId === island.id ? "scale(1.08)" : "scale(1)",
                }}
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

              {/* Status badge */}
              {!island.active && (
                <Chip
                  label={lang === "fr" ? "Bientôt" : "Coming soon"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    backdropFilter: "blur(4px)",
                  }}
                />
              )}

              <CardContent
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  pb: 3,
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
    </Box>
  );
}
