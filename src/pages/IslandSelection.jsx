import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Fade,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { useLanguage } from "../context/LanguageContext";
import { islands } from "../data/islands";
import BottomNav from "../components/BottomNav";
import LanguageSwitch from "../components/LanguageSwitch";
import {
  isIslandDownloaded,
  downloadIsland,
} from "../services/offlineStorage";

export default function IslandSelection() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [hoveredId, setHoveredId] = useState(null);
  const [downloadStates, setDownloadStates] = useState({});

  useEffect(() => {
    islands.forEach(async (island) => {
      const downloaded = await isIslandDownloaded(island.id);
      setDownloadStates((prev) => ({
        ...prev,
        [island.id]: downloaded ? "downloaded" : "idle",
      }));
    });
  }, []);

  const handleDownload = async (e, islandId) => {
    e.stopPropagation();
    setDownloadStates((prev) => ({ ...prev, [islandId]: "downloading" }));
    try {
      await downloadIsland(islandId);
      setDownloadStates((prev) => ({ ...prev, [islandId]: "downloaded" }));
    } catch (err) {
      console.error(`Download failed for ${islandId}:`, err);
      setDownloadStates((prev) => ({ ...prev, [islandId]: "error" }));
    }
  };

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
        py: { xs: 1.5, sm: 6 },
        px: { xs: 2, sm: 3 },
        pb: { xs: 10, sm: 10 },
      }}
    >
      {/* Language selector */}
      <LanguageSwitch />

      {/* Logo — centered relative to full screen width */}
      <Fade in timeout={600}>
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mb: { xs: 0.5, sm: 4 },
            mt: { xs: 0.5, sm: 2 },
            height: { xs: "70px", sm: "100px" },
          }}
        >
          <img
            src="/logo_2.3.png"
            alt="Fenua Stories"
            style={{
              height: "100%",
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
            fontSize: { xs: "0.9rem", sm: "1.1rem" },
            mb: { xs: 1.5, sm: 5 },
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
          gap: { xs: 1.5, md: 4 },
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
                  height: { xs: 150, sm: 260 },
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

              {/* Offline download control */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 10,
                }}
              >
                {downloadStates[island.id] === "downloading" && (
                  <Chip
                    size="small"
                    label={
                      lang === "fr" ? "Téléchargement..." : "Downloading..."
                    }
                    sx={{
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                      height: { xs: 24, sm: 28 },
                      backdropFilter: "blur(4px)",
                    }}
                    icon={
                      <CircularProgress
                        size={14}
                        sx={{ color: "#fff", ml: 0.5 }}
                      />
                    }
                  />
                )}
                {downloadStates[island.id] === "downloaded" && (
                  <Chip
                    size="small"
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    label={lang === "fr" ? "Hors ligne" : "Available offline"}
                    sx={{
                      bgcolor: "rgba(46,125,50,0.85)",
                      color: "#fff",
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                      height: { xs: 24, sm: 28 },
                      "& .MuiChip-icon": { color: "#fff" },
                      backdropFilter: "blur(4px)",
                    }}
                  />
                )}
                {downloadStates[island.id] === "error" && (
                  <Chip
                    size="small"
                    icon={<ErrorOutline sx={{ fontSize: 16 }} />}
                    label={lang === "fr" ? "Échec — réessayer" : "Failed — retry"}
                    onClick={(e) => handleDownload(e, island.id)}
                    clickable
                    sx={{
                      bgcolor: "rgba(198,40,40,0.85)",
                      color: "#fff",
                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                      height: { xs: 24, sm: 28 },
                      "& .MuiChip-icon": { color: "#fff" },
                      backdropFilter: "blur(4px)",
                    }}
                  />
                )}
                {downloadStates[island.id] === "idle" && (
                  <Tooltip
                    title={
                      lang === "fr"
                        ? "Télécharger pour utiliser hors connexion"
                        : "Download for offline use"
                    }
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          fontSize: "0.75rem",
                          bgcolor: "rgba(0,0,0,0.85)",
                          "& .MuiTooltip-arrow": {
                            color: "rgba(0,0,0,0.85)",
                          },
                        },
                      },
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleDownload(e, island.id)}
                      sx={{
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        backdropFilter: "blur(4px)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      <DownloadOutlined sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

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
