import { Box, Typography, Fade, ListItem, ListItemIcon, ListItemText, List, Divider } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import InfoIcon from "@mui/icons-material/Info";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

export default function MorePage() {
  const { lang, toggleLang } = useLanguage();

  const entries = [
    {
      icon: <LanguageIcon sx={{ color: "#64b5f6" }} />,
      label: lang === "fr" ? "Langue" : "Language",
      value: lang === "fr" ? "Français" : "English",
      onClick: toggleLang,
    },
    {
      icon: <InfoIcon sx={{ color: "#64b5f6" }} />,
      label: lang === "fr" ? "À propos de Fenua Stories" : "About Fenua Stories",
      value: "",
      onClick: null,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
        display: "flex",
        flexDirection: "column",
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
          {lang === "fr" ? "Plus" : "More"}
        </Typography>
      </Fade>

      <Fade in timeout={900}>
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <List sx={{ p: 0 }}>
            {entries.map((entry, idx) => (
              <Box key={idx}>
                <ListItem
                  onClick={entry.onClick}
                  sx={{
                    cursor: entry.onClick ? "pointer" : "default",
                    py: 2,
                    px: 3,
                    transition: "background 0.2s ease",
                    "&:hover": entry.onClick
                      ? { background: "rgba(255,255,255,0.05)" }
                      : {},
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{entry.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "#ffffff", fontWeight: 500, fontSize: "0.95rem" }}>
                        {entry.label}
                      </Typography>
                    }
                    secondary={
                      entry.value ? (
                        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                          {entry.value}
                        </Typography>
                      ) : null
                    }
                  />
                </ListItem>
                {idx < entries.length - 1 && (
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Fade>

      <BottomNav />
    </Box>
  );
}
