import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import AudioPlayer from "./AudioPlayer";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebaseConfig";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "@mui/material";

export default function PopupContent({ poi, lang, onClose, onDirections }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const isMobile = useMediaQuery("(max-width:600px)");

  const fullText = poi.description?.[lang] || "";

  const maxChars = isMobile ? 20 : 100;

  const shortText =
    fullText.length > maxChars ? fullText.slice(0, maxChars) + "..." : fullText;

  // Load image and audio: prefer local offline files, fall back to Firebase
  useEffect(() => {
    if (poi.localImage) {
      setImageUrl(Capacitor.convertFileSrc(poi.localImage));
    } else if (poi.imgUrl) {
      const imageRef = ref(storage, poi.imgUrl);
      getDownloadURL(imageRef).then(setImageUrl);
    }

    if (poi.localAudio?.[lang]) {
      setAudioUrl(Capacitor.convertFileSrc(poi.localAudio[lang]));
    } else if (poi.audio?.[lang]) {
      const audioRef = ref(storage, poi.audio?.[lang]);
      getDownloadURL(audioRef).then(setAudioUrl);
    }
  }, [poi, lang]);

  return (
    <>
      {/* MAIN POPUP CARD */}
      <Card
        sx={{
          width: isMobile ? 260 : 280,
          borderRadius: isMobile ? 2 : 3,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            minWidth: "28px",
            height: "28px",
            padding: 0,
            borderRadius: "50%",
            backgroundColor: "white",
            color: "black",
            zIndex: 20,
            "&:hover": { backgroundColor: "red", color: "white" },
          }}
        >
          <CloseIcon fontSize="small" />
        </Button>

        {/* Image */}
        {imageUrl && (
          <CardMedia
            component="img"
            height={isMobile ? "90" : "140"}
            image={imageUrl}
            alt={poi.title?.[lang]}
          />
        )}

        <CardContent>
          {/* Title */}
          <Typography
            variant={isMobile ? "subtitle2" : "h6"}
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {poi.title?.[lang]}
          </Typography>

          {/* Category */}
          {poi.category && (
            <Chip
              label={poi.category?.[lang]}
              size="small"
              color="primary"
              sx={{ mb: 1 }}
            />
          )}

          {/* Audio */}
          {audioUrl && <AudioPlayer src={audioUrl} />}

          {/* Short Description */}
          <Typography
            variant="body2"
            sx={{
              maxHeight: "5em",
              overflow: "hidden",
              textOverflow: "fade",
            }}
            dangerouslySetInnerHTML={{ __html: shortText }}
          />

          {/* See more button → opens drawer */}
          {fullText.length > 200 && (
            <Button
              size="small"
              fullWidth
              variant="outlined"
              startIcon={<span style={{ fontSize: "1rem" }}>📖</span>}
              sx={{
                mt: 1,
                textTransform: "none",
                borderColor: "rgba(100,181,246,0.5)",
                color: "#1976d2",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#64b5f6",
                  background: "rgba(100,181,246,0.08)",
                },
              }}
              onClick={() => setDrawerOpen(true)}
            >
              {lang === "fr" ? "Lire la suite" : "Read more"}
            </Button>
          )}

          {/* Directions button */}
          {poi.location?.lat && poi.location?.lng && onDirections && (
            <Button
              size="small"
              fullWidth
              variant="outlined"
              startIcon={<span style={{ fontSize: "1rem" }}>🧭</span>}
              sx={{
                mt: 1,
                textTransform: "none",
                borderColor: "rgba(100,181,246,0.5)",
                color: "#1976d2",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#64b5f6",
                  background: "rgba(100,181,246,0.08)",
                },
              }}
              onClick={onDirections}
            >
              {lang === "fr" ? "M'y rendre" : "Directions"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* DRAWER FOR FULL DESCRIPTION */}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          container: document.body, // ⭐ CRITICAL FIX
        }}
        PaperProps={{
          sx: {
            position: "fixed", // ⭐ CRITICAL FIX
            bottom: isMobile ? 0 : "auto",
            right: !isMobile ? 0 : "auto",
            left: isMobile ? 0 : "auto",

            height: isMobile ? "60vh" : "100vh",
            width: isMobile ? "100%" : "400px",

            p: 3,
            zIndex: 3000, // above mapbox fullscreen
            borderTopLeftRadius: isMobile ? "16px" : 0,
            borderTopRightRadius: isMobile ? "16px" : 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">{poi.title?.[lang]}</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content — scrollable */}
        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: fullText }}
          />
        </Box>
      </Drawer>
    </>
  );
}
