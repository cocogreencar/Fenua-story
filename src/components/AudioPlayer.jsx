import { useState, useRef, useEffect } from "react";
import { Box, Slider, IconButton, Typography, styled } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import { useMediaQuery } from "@mui/material";

/* --- Modern Styling From Demo --- */
const Widget = styled("div")(({ theme }) => ({
  padding: 10,
  borderRadius: 14,
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.5)",
  backdropFilter: "blur(20px)",
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(0,0,0,0.5)",
  }),
}));

const TinyText = styled(Typography)({
  fontSize: "0.7rem",
  opacity: 0.6,
  fontWeight: 500,
});

/* ------------------------------- */

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <Widget
      sx={{
        background: "linear-gradient(135deg, #cecece2f 10%, #6e6e6e27 70%)",
        backdropFilter: "blur(20px)",
        mb: isMobile ? 0 : 2,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Row 1: Play + Time + Volume */}
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={togglePlay} size="small">
          {isPlaying ? (
            <PauseRounded sx={{ fontSize: isMobile ? "1.4rem" : "2rem" }} />
          ) : (
            <PlayArrowRounded sx={{ fontSize: isMobile ? "1.4rem" : "2rem" }} />
          )}
        </IconButton>

        <TinyText sx={{ fontSize: isMobile ? "0.6rem" : "0.7rem" }}>
          {formatTime(progress)}
        </TinyText>

        <TinyText
          sx={{ opacity: 0.4, fontSize: isMobile ? "0.6rem" : "0.7rem" }}
        >
          /
        </TinyText>

        <TinyText sx={{ fontSize: isMobile ? "0.6rem" : "0.7rem" }}>
          {formatTime(duration)}
        </TinyText>

        <VolumeDownRounded sx={{ fontSize: 18, opacity: 0.6 }} />

        <Slider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(_, v) => {
            audioRef.current.volume = v;
            setVolume(v);
          }}
          sx={{
            width: 90,
            "& .MuiSlider-thumb": {
              width: 14,
              height: 14,
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            },
          }}
        />

        <VolumeUpRounded sx={{ fontSize: 18, opacity: 0.6 }} />
      </Box>

      {/* Row 2: Progress Slider */}
      <Box mt={0.5}>
        <Slider
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(_, v) => {
            audioRef.current.currentTime = v;
            setProgress(v);
          }}
          size="small"
          sx={{
            height: isMobile ? 2 : 4,
            "& .MuiSlider-thumb": {
              width: isMobile ? 8 : 10,
              height: isMobile ? 8 : 10,
            },
            "& .MuiSlider-rail": {
              opacity: 0.3,
            },
          }}
        />
      </Box>
    </Widget>
  );
}
