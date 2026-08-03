import { Button, Box } from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
// import enFlag from "../assets/icons/en.svg";
import frFlag from "../assets/icons/fn.svg";
import enUsFlag from "../assets/icons/enUs.svg";

export default function LanguageSwitch() {
  const { lang, toggleLang } = useLanguage();

  // Show opposite language in button (switch target)
  const nextLang = lang === "en" ? "en" : "fr";

  const nextFlag = nextLang === "en" ? enUsFlag : frFlag;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 50,
        zIndex: 999,
      }}
    >
      <Button
        onClick={toggleLang}
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "20px",
          textTransform: "none",
          backgroundColor: "#ffffff",
          color: "#333",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        {/* Flag Icon */}
        <img
          src={nextFlag}
          alt="language"
          width={20}
          height={20}
          style={{ borderRadius: "50%" }}
        />

        {/* Language Text */}
        {nextLang.toUpperCase()}
      </Button>
    </Box>
  );
}
