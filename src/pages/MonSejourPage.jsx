import { useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

const islandOptions = [
  { id: "tahiti", name: "Tahiti", emoji: "🏝️" },
  { id: "moorea", name: "Moorea", emoji: "🌺" },
  { id: "bora-bora", name: "Bora Bora", emoji: "💎" },
];

export default function MonSejourPage() {
  const { lang } = useLanguage();
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background:
            "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, sm: 4 },
          pb: { xs: 10, sm: 10 },
        }}
      >
        <Fade in timeout={600}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: { xs: "1.4rem", sm: "1.7rem" },
                mb: 2,
                letterSpacing: 0.5,
              }}
            >
              {lang === "fr"
                ? "Votre séjour se prépare bientôt."
                : "Your trip is being prepared soon."}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.95rem",
              }}
            >
              {islandOptions.find((i) => i.id === selectedIsland)?.name}
            </Typography>
          </Box>
        </Fade>
        <BottomNav />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
        display: "flex",
        flexDirection: "column",
        px: { xs: 3, sm: 4 },
        pt: { xs: 4, sm: 6 },
        pb: { xs: 10, sm: 10 },
      }}
    >
      {/* Title */}
      <Fade in timeout={600}>
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
            mb: 2,
            letterSpacing: 0.5,
          }}
        >
          🌺 {lang === "fr" ? "Mon séjour" : "My trip"}
        </Typography>
      </Fade>

      {/* Introduction */}
      <Fade in timeout={700}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.65)",
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.6,
            mb: 4,
            maxWidth: 480,
          }}
        >
          {lang === "fr"
            ? "Créons ensemble votre séjour idéal en Polynésie française."
            : "Let's create your ideal trip in French Polynesia together."}
        </Typography>
      </Fade>

      {/* Island selection */}
      <Fade in timeout={800}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
            maxWidth: 480,
          }}
        >
          {islandOptions.map((island) => {
            const isSelected = selectedIsland === island.id;
            return (
              <Card
                key={island.id}
                onClick={() => setSelectedIsland(island.id)}
                sx={{
                  borderRadius: 3,
                  cursor: "pointer",
                  background: isSelected
                    ? "rgba(100,181,246,0.12)"
                    : "rgba(255,255,255,0.05)",
                  border: isSelected
                    ? "1px solid rgba(100,181,246,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  transition:
                    "background 0.25s ease, border 0.25s ease, transform 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    background: isSelected
                      ? "rgba(100,181,246,0.16)"
                      : "rgba(255,255,255,0.08)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2.5,
                    px: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "1.6rem" }}>
                      {island.emoji}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      {island.name}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <CheckCircleIcon sx={{ color: "#64b5f6", fontSize: 28 }} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Fade>

      {/* Continue button */}
      <Fade in timeout={900}>
        <Button
          variant="contained"
          disabled={!selectedIsland}
          onClick={() => setSubmitted(true)}
          sx={{
            mt: 4,
            alignSelf: "flex-start",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            background: selectedIsland
              ? "linear-gradient(135deg, #1976d2, #42a5f5)"
              : "rgba(255,255,255,0.08)",
            color: selectedIsland ? "#ffffff" : "rgba(255,255,255,0.35)",
            transition: "background 0.3s ease, transform 0.2s ease",
            "&:hover": {
              background: selectedIsland
                ? "linear-gradient(135deg, #1565c0, #1e88e5)"
                : "rgba(255,255,255,0.08)",
              transform: selectedIsland ? "translateY(-2px)" : "none",
            },
            "&:disabled": {
              background: "rgba(255,255,255,0.08)",
            },
            maxWidth: 480,
          }}
        >
          {lang === "fr" ? "Continuer" : "Continue"}
        </Button>
      </Fade>

      <BottomNav />
    </Box>
  );
}
