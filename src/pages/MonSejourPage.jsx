import { useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Card,
  CardContent,
  Button,
  TextField,
  LinearProgress,
  Modal,
  IconButton,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EventIcon from "@mui/icons-material/Event";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

// Configuration placeholder — replace with the real Google Play URL when available
const SUNSET_PARADISE_URL = null;

const islandOptions = [
  { id: "tahiti", name: { fr: "Tahiti", en: "Tahiti" }, emoji: "🏝️" },
  { id: "moorea", name: { fr: "Moorea", en: "Moorea" }, emoji: "🌺" },
  { id: "bora-bora", name: { fr: "Bora Bora", en: "Bora Bora" }, emoji: "💎" },
];

const durationOptions = [
  { value: 1, label: { fr: "1 jour", en: "1 day" } },
  { value: 2, label: { fr: "2 jours", en: "2 days" } },
  { value: 3, label: { fr: "3 jours", en: "3 days" } },
  { value: 4, label: { fr: "4 jours", en: "4 days" } },
  { value: 5, label: { fr: "5 jours", en: "5 days" } },
  { value: 6, label: { fr: "6 jours", en: "6 days" } },
  { value: 7, label: { fr: "7 jours et +", en: "7 days and +" } },
];

const companionOptions = [
  { id: "solo", label: { fr: "Solo", en: "Solo" }, emoji: "🧳" },
  { id: "couple", label: { fr: "En couple", en: "As a couple" }, emoji: "💑" },
  { id: "famille", label: { fr: "En famille", en: "With family" }, emoji: "👨‍👩‍👧" },
  { id: "amis", label: { fr: "Entre amis", en: "With friends" }, emoji: "🎉" },
];

const transportOptions = [
  { id: "voiture", label: { fr: "Voiture", en: "Car" }, emoji: "🚗" },
  { id: "scooter", label: { fr: "Scooter", en: "Scooter" }, emoji: "🛵" },
  { id: "velo", label: { fr: "Vélo", en: "Bike" }, emoji: "🚲" },
  { id: "pied", label: { fr: "Sans véhicule", en: "No vehicle" }, emoji: "🚶" },
];

const interestOptions = [
  { id: "plages", label: { fr: "Plages et lagons", en: "Beaches and lagoons" }, emoji: "🏖️" },
  { id: "snorkeling", label: { fr: "Snorkeling", en: "Snorkeling" }, emoji: "🤿" },
  { id: "nature", label: { fr: "Nature", en: "Nature" }, emoji: "🌿" },
  { id: "randonnees", label: { fr: "Randonnées", en: "Hiking" }, emoji: "🥾" },
  { id: "culture", label: { fr: "Culture et histoire", en: "Culture and history" }, emoji: "🏛️" },
  { id: "paysages", label: { fr: "Paysages et photos", en: "Landscapes and photos" }, emoji: "📸" },
  { id: "gastronomie", label: { fr: "Gastronomie", en: "Food and dining" }, emoji: "🍽️" },
  { id: "detente", label: { fr: "Détente", en: "Relaxation" }, emoji: "😌" },
  { id: "marches", label: { fr: "Marchés et shopping", en: "Markets and shopping" }, emoji: "🛍️" },
  { id: "incontournables", label: { fr: "Les incontournables", en: "Must-sees" }, emoji: "⭐" },
  { id: "lever-soleil", label: { fr: "Lever de soleil", en: "Sunrise" }, emoji: "🌅" },
  { id: "coucher-soleil", label: { fr: "Coucher de soleil", en: "Sunset" }, emoji: "🌇" },
];

const paceOptions = [
  {
    id: "tranquille",
    label: { fr: "Tranquille", en: "Relaxed" },
    description: {
      fr: "Prendre son temps et profiter de chaque endroit.",
      en: "Take your time and enjoy every spot.",
    },
    emoji: "🐢",
  },
  {
    id: "equilibre",
    label: { fr: "Équilibré", en: "Balanced" },
    description: {
      fr: "Un bon mélange de découvertes et de détente.",
      en: "A good mix of discovery and relaxation.",
    },
    emoji: "⚖️",
  },
  {
    id: "intensif",
    label: { fr: "J'en veux un maximum !", en: "I want the most!" },
    description: {
      fr: "Profiter de chaque journée pour découvrir un maximum de choses.",
      en: "Make the most of each day to discover as much as possible.",
    },
    emoji: "🚀",
  },
];

const TOTAL_STEPS = 9;

const pageBackground = {
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(180deg, #0a1929 0%, #0d2845 40%, #103a5c 100%)",
  display: "flex",
  flexDirection: "column",
  px: { xs: 3, sm: 4 },
  pt: { xs: 4, sm: 6 },
  pb: { xs: 10, sm: 10 },
};

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 1.5, sm: 2 },
  maxWidth: 480,
};

const selectableCardSx = (isSelected) => ({
  borderRadius: 3,
  cursor: "pointer",
  background: isSelected ? "rgba(100,181,246,0.12)" : "rgba(255,255,255,0.05)",
  border: isSelected
    ? "1px solid rgba(100,181,246,0.5)"
    : "1px solid rgba(255,255,255,0.08)",
  transition: "background 0.25s ease, border 0.25s ease, transform 0.25s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    background: isSelected ? "rgba(100,181,246,0.16)" : "rgba(255,255,255,0.08)",
  },
  "&:active": { transform: "translateY(-1px)" },
});

const continueButtonSx = (enabled) => ({
  mt: 4,
  alignSelf: "flex-start",
  borderRadius: 3,
  px: 4,
  py: 1.5,
  fontWeight: 600,
  fontSize: "0.95rem",
  textTransform: "none",
  background: enabled
    ? "linear-gradient(135deg, #1976d2, #42a5f5)"
    : "rgba(255,255,255,0.08)",
  color: enabled ? "#ffffff" : "rgba(255,255,255,0.35)",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: enabled
      ? "linear-gradient(135deg, #1565c0, #1e88e5)"
      : "rgba(255,255,255,0.08)",
    transform: enabled ? "translateY(-2px)" : "none",
  },
  "&:disabled": { background: "rgba(255,255,255,0.08)" },
  maxWidth: 480,
});

const backButtonSx = {
  mt: 4,
  alignSelf: "flex-start",
  borderRadius: 3,
  px: 3,
  py: 1.5,
  fontWeight: 600,
  fontSize: "0.95rem",
  textTransform: "none",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.6)",
  border: "1px solid rgba(255,255,255,0.1)",
  transition: "background 0.2s ease",
  "&:hover": {
    background: "rgba(255,255,255,0.1)",
  },
};

const cocoGreenCarUrl = (lang) =>
  lang === "fr" ? "https://www.cocogreencar.com/" : "https://www.cocogreencar.com/en";

const textFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(100,181,246,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#64b5f6" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.5)",
    "&.Mui-focused": { color: "#64b5f6" },
  },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
};

const emptyActivity = () => ({
  id: Date.now() + Math.random(),
  name: "",
  day: 1,
  startTime: "",
  endTime: "",
  location: "",
  notes: "",
});

export default function MonSejourPage() {
  const { lang } = useLanguage();

  const [step, setStep] = useState(0);
  const [island, setIsland] = useState(null);
  const [duration, setDuration] = useState(null);
  const [customDays, setCustomDays] = useState("");
  const [companions, setCompanions] = useState(null);
  const [transport, setTransport] = useState(null);
  const [interests, setInterests] = useState([]);
  const [pace, setPace] = useState(null);
  const [includeRestaurants, setIncludeRestaurants] = useState(true);
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [cocoPopupShown, setCocoPopupShown] = useState(false);
  const [cocoPopupOpen, setCocoPopupOpen] = useState(false);

  const t = (fr, en) => (lang === "fr" ? fr : en);

  const actualDuration = duration === 7 ? (parseInt(customDays, 10) || 7) : duration;

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleTransportSelect = (id) => {
    setTransport(id);
    if (id === "pied" && island === "moorea" && !cocoPopupShown) {
      setCocoPopupOpen(true);
      setCocoPopupShown(true);
    }
  };

  const canContinue = () => {
    if (step === 0) return !!island;
    if (step === 1) {
      if (duration === null) return false;
      if (duration === 7) {
        const n = parseInt(customDays, 10);
        return !isNaN(n) && n >= 7;
      }
      return true;
    }
    if (step === 2) return !!companions;
    if (step === 3) return !!transport;
    if (step === 4) return interests.length > 0;
    if (step === 5) return !!pace;
    if (step === 6) return true;
    if (step === 7) return true;
    return true;
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleContinue = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };

  const resetAll = () => {
    setStep(0);
    setIsland(null);
    setDuration(null);
    setCustomDays("");
    setCompanions(null);
    setTransport(null);
    setInterests([]);
    setPace(null);
    setIncludeRestaurants(true);
    setActivities([]);
    setEditingActivity(null);
    setCocoPopupShown(false);
    setCocoPopupOpen(false);
  };

  const renderProgress = () => (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 480, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 500 }}
          >
            {t("Étape", "Step")} {step + 1} / {TOTAL_STEPS}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 2,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            },
          }}
        />
      </Box>
    </Fade>
  );

  // ---- Step 0: Island selection ----
  const renderIslandStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography
          sx={{
            color: "#ffffff", fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "1.8rem" }, mb: 2, letterSpacing: 0.5,
          }}
        >
          🌺 {t("Mon séjour", "My trip")}
        </Typography>
      </Fade>
      <Fade in timeout={700}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.65)",
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.6, mb: 4, maxWidth: 480,
          }}
        >
          {t(
            "Créons ensemble votre séjour idéal en Polynésie française.",
            "Let's create your ideal trip in French Polynesia together."
          )}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box sx={sectionStyle}>
          {islandOptions.map((opt) => {
            const isSelected = island === opt.id;
            return (
              <Card key={opt.id} onClick={() => setIsland(opt.id)} sx={selectableCardSx(isSelected)}>
                <CardContent
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2.5, px: 3 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "1.6rem" }}>{opt.emoji}</Typography>
                    <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                      {opt.name[lang]}
                    </Typography>
                  </Box>
                  {isSelected && <CheckCircleIcon sx={{ color: "#64b5f6", fontSize: 28 }} />}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Fade>
    </>
  );

  // ---- Step 1: Duration ----
  const renderDurationStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography
          sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 4, letterSpacing: 0.5 }}
        >
          {t("Combien de temps restes-tu ?", "How long are you staying?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box sx={{ ...sectionStyle, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" } }}>
          {durationOptions.map((opt) => {
            const isSelected = duration === opt.value;
            return (
              <Card key={opt.value} onClick={() => setDuration(opt.value)} sx={selectableCardSx(isSelected)}>
                <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 2, px: 2 }}>
                  <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" }, textAlign: "center" }}>
                    {opt.label[lang]}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Fade>
      {duration === 7 && (
        <Fade in timeout={400}>
          <Box sx={{ mt: 3, maxWidth: 480 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", mb: 1.5 }}>
              {t("Nombre de jours exact", "Exact number of days")}
            </Typography>
            <TextField
              type="number" value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              inputProps={{ min: 7 }} size="small" sx={textFieldSx}
              placeholder={t("Minimum 7 jours", "Minimum 7 days")}
            />
          </Box>
        </Fade>
      )}
    </>
  );

  // ---- Step 2: Companions ----
  const renderCompanionsStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography
          sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 4, letterSpacing: 0.5 }}
        >
          {t("Avec qui voyages-tu ?", "Who are you traveling with?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box sx={{ ...sectionStyle, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" } }}>
          {companionOptions.map((opt) => {
            const isSelected = companions === opt.id;
            return (
              <Card key={opt.id} onClick={() => setCompanions(opt.id)} sx={selectableCardSx(isSelected)}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2.5, px: 2 }}>
                  <Typography sx={{ fontSize: "1.8rem" }}>{opt.emoji}</Typography>
                  <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" }, textAlign: "center" }}>
                    {opt.label[lang]}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Fade>
    </>
  );

  // ---- Step 3: Transportation ----
  const renderTransportStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography
          sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 4, letterSpacing: 0.5 }}
        >
          {t("Comment te déplaces-tu ?", "How do you get around?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box sx={{ ...sectionStyle, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" } }}>
          {transportOptions.map((opt) => {
            const isSelected = transport === opt.id;
            return (
              <Card key={opt.id} onClick={() => handleTransportSelect(opt.id)} sx={selectableCardSx(isSelected)}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2.5, px: 2 }}>
                  <Typography sx={{ fontSize: "1.8rem" }}>{opt.emoji}</Typography>
                  <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: { xs: "0.9rem", sm: "1rem" }, textAlign: "center" }}>
                    {opt.label[lang]}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Fade>

      {island === "moorea" && (
        <Fade in timeout={600}>
          <Box sx={{ mt: 4, maxWidth: 480, borderRadius: 3, p: 3, background: "rgba(76, 175, 80, 0.08)", border: "1px solid rgba(76, 175, 80, 0.2)" }}>
            <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>
              🚗 {t("Besoin de louer une voiture ?", "Need to rent a car?")}
            </Typography>
            <Box
              component="a" href={cocoGreenCarUrl(lang)} target="_blank" rel="noopener noreferrer"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, color: "#66bb6a", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s ease", "&:hover": { color: "#81c784" } }}
            >
              {t("Réserver avec Coco Green Car", "Book with Coco Green Car")}
              <OpenInNewIcon sx={{ fontSize: 16 }} />
              <span>→</span>
            </Box>
          </Box>
        </Fade>
      )}

      <Modal
        open={cocoPopupOpen} onClose={() => setCocoPopupOpen(false)} closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}
      >
        <Fade in={cocoPopupOpen} timeout={300}>
          <Box sx={{ maxWidth: 400, width: "100%", borderRadius: 4, p: 4, background: "linear-gradient(160deg, #0d2845 0%, #103a5c 100%)", border: "1px solid rgba(76, 175, 80, 0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", position: "relative" }}>
            <IconButton onClick={() => setCocoPopupOpen(false)} sx={{ position: "absolute", top: 12, right: 12, color: "rgba(255,255,255,0.4)" }}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1.2rem", mb: 2, pr: 4 }}>
              {t("🚗 Et si vous louiez une voiture ?", "🚗 How about renting a car?")}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.6, mb: 3 }}>
              {t(
                "Pour explorer Moorea librement et profiter pleinement de votre séjour, découvrez les véhicules de Coco Green Car.",
                "Explore Moorea freely and make the most of your stay with Coco Green Car."
              )}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                component="a" href={cocoGreenCarUrl(lang)} target="_blank" rel="noopener noreferrer" fullWidth
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 600, fontSize: "0.95rem", textTransform: "none", background: "linear-gradient(135deg, #43a047, #66bb6a)", color: "#ffffff", transition: "transform 0.2s ease", "&:hover": { background: "linear-gradient(135deg, #388e3c, #4caf50)", transform: "translateY(-2px)" } }}
              >
                {t("Voir les véhicules", "View vehicles")}
              </Button>
              <Button
                onClick={() => setCocoPopupOpen(false)} fullWidth
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 600, fontSize: "0.95rem", textTransform: "none", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", "&:hover": { background: "rgba(255,255,255,0.1)" } }}
              >
                {t("Continuer sans véhicule", "Continue without a vehicle")}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );

  // ---- Step 4: Travel interests ----
  const renderInterestsStep = () => {
    const showSunsetPromo = interests.includes("lever-soleil") || interests.includes("coucher-soleil");
    return (
      <>
        <Fade in timeout={600}>
          <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 1, letterSpacing: 0.5 }}>
            {t("Qu'as-tu envie de découvrir ?", "What do you want to discover?")}
          </Typography>
        </Fade>
        <Fade in timeout={700}>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", mb: 4, maxWidth: 480 }}>
            {t("Sélectionne tout ce qui te fait envie.", "Select everything that appeals to you.")}
          </Typography>
        </Fade>
        <Fade in timeout={800}>
          <Box sx={{ ...sectionStyle, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" }, gap: { xs: 1, sm: 1.5 } }}>
            {interestOptions.map((opt) => {
              const isSelected = interests.includes(opt.id);
              return (
                <Card key={opt.id} onClick={() => toggleInterest(opt.id)} sx={selectableCardSx(isSelected)}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75, py: 2, px: 1.5, minHeight: 90, justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "1.5rem" }}>{opt.emoji}</Typography>
                    <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.82rem" }, textAlign: "center", lineHeight: 1.2 }}>
                      {opt.label[lang]}
                    </Typography>
                    {isSelected && <CheckCircleIcon sx={{ color: "#64b5f6", fontSize: 18, mt: 0.25 }} />}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Fade>

        {showSunsetPromo && (
          <Fade in timeout={500}>
            <Box sx={{ mt: 4, maxWidth: 480, borderRadius: 3, p: 3, background: "rgba(255, 167, 38, 0.08)", border: "1px solid rgba(255, 167, 38, 0.2)" }}>
              <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>
                {t("Envie d'un moment magique ?", "Looking for a magical moment?")}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.5, mb: 2 }}>
                {t(
                  "Découvrez les meilleurs endroits pour admirer le lever ou le coucher du soleil grâce à notre application Sunset Paradise Tahiti.",
                  "Discover the best places to enjoy sunrise or sunset with our Sunset Paradise Tahiti app."
                )}
              </Typography>
              <Button
                disabled={!SUNSET_PARADISE_URL}
                {...(SUNSET_PARADISE_URL
                  ? { component: "a", href: SUNSET_PARADISE_URL, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                sx={{
                  borderRadius: 3, px: 3, py: 1.25, fontWeight: 600, fontSize: "0.85rem", textTransform: "none",
                  background: SUNSET_PARADISE_URL
                    ? "linear-gradient(135deg, #f57c00, #ffa726)"
                    : "rgba(255,255,255,0.05)",
                  color: SUNSET_PARADISE_URL ? "#ffffff" : "rgba(255,255,255,0.35)",
                  border: SUNSET_PARADISE_URL ? "none" : "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    background: SUNSET_PARADISE_URL
                      ? "linear-gradient(135deg, #ef6c00, #fb8c00)"
                      : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                {SUNSET_PARADISE_URL
                  ? t("Découvrir Sunset Paradise Tahiti", "Discover Sunset Paradise Tahiti")
                  : t("Bientôt disponible", "Coming soon")}
              </Button>
            </Box>
          </Fade>
        )}
      </>
    );
  };

  // ---- Step 5: Travel pace ----
  const renderPaceStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 4, letterSpacing: 0.5 }}>
          {t("À quel rythme veux-tu découvrir l'île ?", "At what pace do you want to explore the island?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box sx={sectionStyle}>
          {paceOptions.map((opt) => {
            const isSelected = pace === opt.id;
            return (
              <Card key={opt.id} onClick={() => setPace(opt.id)} sx={selectableCardSx(isSelected)}>
                <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 2.5, px: 3 }}>
                  <Typography sx={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0 }}>{opt.emoji}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1.05rem" }, mb: 0.5 }}>
                      {opt.label[lang]}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: { xs: "0.8rem", sm: "0.85rem" }, lineHeight: 1.4 }}>
                      {opt.description[lang]}
                    </Typography>
                  </Box>
                  {isSelected && <CheckCircleIcon sx={{ color: "#64b5f6", fontSize: 24, flexShrink: 0, mt: 0.5 }} />}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Fade>
    </>
  );

  // ---- Step 6: Restaurant preferences ----
  const renderRestaurantStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 1, letterSpacing: 0.5 }}>
          {t("Souhaites-tu découvrir des restaurants ?", "Would you like to discover restaurants?")}
        </Typography>
      </Fade>
      <Fade in timeout={700}>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.5, mb: 4, maxWidth: 480 }}>
          {t(
            "Nous pourrons te proposer des restaurants à proximité de tes visites, sans détour inutile.",
            "We can suggest restaurants near your visits, with no unnecessary detours."
          )}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box
          sx={{
            maxWidth: 480, borderRadius: 3, p: 3,
            background: includeRestaurants ? "rgba(100,181,246,0.1)" : "rgba(255,255,255,0.05)",
            border: includeRestaurants
              ? "1px solid rgba(100,181,246,0.3)"
              : "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            transition: "background 0.25s ease, border 0.25s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <RestaurantIcon sx={{ color: includeRestaurants ? "#64b5f6" : "rgba(255,255,255,0.4)", fontSize: 28 }} />
            <Box>
              <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem" }}>
                {t("Intégrer des restaurants à mon séjour", "Include restaurants in my trip")}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", mt: 0.5 }}>
                {includeRestaurants
                  ? t("Activé", "Enabled")
                  : t("Désactivé", "Disabled")}
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={includeRestaurants}
            onChange={(e) => setIncludeRestaurants(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#42a5f5" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "rgba(66,165,245,0.4)" },
              "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          />
        </Box>
      </Fade>
    </>
  );

  // ---- Step 7: Personal reservations ----
  const renderReservationsStep = () => {
    const handleSaveActivity = () => {
      if (!editingActivity || !editingActivity.name || !editingActivity.startTime || !editingActivity.location) return;
      setActivities((prev) => {
        const exists = prev.some((a) => a.id === editingActivity.id);
        if (exists) return prev.map((a) => (a.id === editingActivity.id ? editingActivity : a));
        return [...prev, editingActivity];
      });
      setEditingActivity(null);
    };

    const handleAddNew = () => setEditingActivity(emptyActivity());
    const handleEdit = (act) => setEditingActivity({ ...act });
    const handleDelete = (id) => setActivities((prev) => prev.filter((a) => a.id !== id));

    const updateEditing = (field, value) =>
      setEditingActivity((prev) => ({ ...prev, [field]: value }));

    return (
      <>
        <Fade in timeout={600}>
          <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 1, letterSpacing: 0.5 }}>
            {t("As-tu déjà des activités réservées ?", "Do you have any booked activities?")}
          </Typography>
        </Fade>
        <Fade in timeout={700}>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.5, mb: 3, maxWidth: 480 }}>
            {t(
              "Ajoute tes réservations pour que ton programme s'organise autour de celles-ci.",
              "Add your reservations so your schedule can be organized around them."
            )}
          </Typography>
        </Fade>

        {/* Info banner */}
        <Fade in timeout={750}>
          <Box sx={{ maxWidth: 480, borderRadius: 3, p: 2.5, mb: 3, background: "rgba(255,167,38,0.08)", border: "1px solid rgba(255,167,38,0.2)" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", lineHeight: 1.5 }}>
              {t(
                "Ces réservations resteront fixes dans ton futur programme.",
                "These reservations will remain fixed in your future itinerary."
              )}
            </Typography>
          </Box>
        </Fade>

        {/* Activity list */}
        {activities.length > 0 && (
          <Fade in timeout={800}>
            <Box sx={{ ...sectionStyle, mb: 3 }}>
              {activities.map((act) => (
                <Box
                  key={act.id}
                  sx={{
                    borderRadius: 3, p: 3,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem", mb: 0.5 }}>
                        {act.name}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
                        {t("Jour", "Day")} {act.day} · {act.startTime}{act.endTime ? ` – ${act.endTime}` : ""}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", mt: 0.5 }}>
                        📍 {act.location}
                      </Typography>
                      {act.notes && (
                        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", mt: 0.5, fontStyle: "italic" }}>
                          {act.notes}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                      <IconButton onClick={() => handleEdit(act)} sx={{ color: "rgba(255,255,255,0.4)" }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(act.id)} sx={{ color: "rgba(239,83,80,0.6)" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Fade>
        )}

        {/* Add button */}
        {!editingActivity && (
          <Fade in timeout={800}>
            <Button
              onClick={handleAddNew}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3, px: 3, py: 1.5, fontWeight: 600, fontSize: "0.9rem", textTransform: "none",
                background: "rgba(100,181,246,0.1)", color: "#64b5f6",
                border: "1px solid rgba(100,181,246,0.25)",
                maxWidth: 480, width: "100%",
                transition: "background 0.2s ease",
                "&:hover": { background: "rgba(100,181,246,0.18)" },
              }}
            >
              {t("Ajouter une activité", "Add an activity")}
            </Button>
          </Fade>
        )}

        {/* Edit/Add form */}
        {editingActivity && (
          <Fade in timeout={400}>
            <Box
              sx={{
                maxWidth: 480, borderRadius: 3, p: 3, mt: activities.length > 0 ? 0 : 3,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(100,181,246,0.25)",
              }}
            >
              <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: "0.9rem", mb: 2 }}>
                {activities.some((a) => a.id === editingActivity.id)
                  ? t("Modifier l'activité", "Edit activity")
                  : t("Nouvelle activité", "New activity")}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label={t("Nom de l'activité", "Activity name")} required
                  value={editingActivity.name}
                  onChange={(e) => updateEditing("name", e.target.value)}
                  size="small" sx={textFieldSx}
                />

                <FormControl size="small" fullWidth>
                  <InputLabel sx={{ color: "rgba(255,255,255,0.5)", "&.Mui-focused": { color: "#64b5f6" } }}>
                    {t("Jour", "Day")} *
                  </InputLabel>
                  <Select
                    value={editingActivity.day}
                    label={t("Jour", "Day") + " *"}
                    onChange={(e) => updateEditing("day", e.target.value)}
                    sx={textFieldSx}
                    MenuProps={{
                      PaperProps: {
                        sx: { backgroundColor: "#0d2845", "& .MuiMenuItem-root": { color: "#ffffff" } },
                      },
                    }}
                  >
                    {Array.from({ length: actualDuration }, (_, i) => i + 1).map((d) => (
                      <MenuItem key={d} value={d}>
                        {t("Jour", "Day")} {d}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label={t("Heure de début", "Start time")} required type="time"
                    value={editingActivity.startTime}
                    onChange={(e) => updateEditing("startTime", e.target.value)}
                    size="small" sx={{ ...textFieldSx, flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label={t("Heure de fin (opt.)", "End time (opt.)")} type="time"
                    value={editingActivity.endTime}
                    onChange={(e) => updateEditing("endTime", e.target.value)}
                    size="small" sx={{ ...textFieldSx, flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <TextField
                  label={t("Lieu ou adresse", "Location or address")} required
                  value={editingActivity.location}
                  onChange={(e) => updateEditing("location", e.target.value)}
                  size="small" sx={textFieldSx}
                />

                <TextField
                  label={t("Notes (opt.)", "Notes (opt.)")}
                  value={editingActivity.notes}
                  onChange={(e) => updateEditing("notes", e.target.value)}
                  size="small" multiline rows={2} sx={textFieldSx}
                />

                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                  <Button
                    onClick={handleSaveActivity}
                    disabled={!editingActivity.name || !editingActivity.startTime || !editingActivity.location}
                    sx={{
                      flex: 1, borderRadius: 3, py: 1.25, fontWeight: 600, fontSize: "0.85rem", textTransform: "none",
                      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                      color: "#ffffff",
                      "&:disabled": { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" },
                      "&:hover": { background: "linear-gradient(135deg, #1565c0, #1e88e5)" },
                    }}
                  >
                    {t("Enregistrer", "Save")}
                  </Button>
                  <Button
                    onClick={() => setEditingActivity(null)}
                    sx={{
                      borderRadius: 3, py: 1.25, px: 3, fontWeight: 600, fontSize: "0.85rem", textTransform: "none",
                      background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      "&:hover": { background: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    {t("Annuler", "Cancel")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}

        {activities.length === 0 && !editingActivity && (
          <Fade in timeout={900}>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", mt: 2, maxWidth: 480, textAlign: "center" }}>
              {t(
                "Tu peux continuer sans ajouter d'activité.",
                "You can continue without adding any activity."
              )}
            </Typography>
          </Fade>
        )}
      </>
    );
  };

  // ---- Step 8: Summary ----
  const renderSummaryStep = () => {
    const islandName = islandOptions.find((i) => i.id === island)?.name[lang];
    const durationLabel =
      duration === 7
        ? `${customDays} ${t("jours", "days")}`
        : durationOptions.find((d) => d.value === duration)?.label[lang];
    const companionLabel = companionOptions.find((c) => c.id === companions)?.label[lang];
    const transportOpt = transportOptions.find((t2) => t2.id === transport);
    const paceOpt = paceOptions.find((p) => p.id === pace);
    const selectedInterestLabels = interests
      .map((id) => interestOptions.find((o) => o.id === id)?.label[lang])
      .filter(Boolean);

    const summaryItems = [
      { label: t("Île", "Island"), value: islandName, emoji: islandOptions.find((i) => i.id === island)?.emoji },
      { label: t("Durée", "Duration"), value: durationLabel, emoji: "📅" },
      { label: t("Compagnons", "Companions"), value: companionLabel, emoji: companionOptions.find((c) => c.id === companions)?.emoji },
      { label: t("Transport", "Transport"), value: transportOpt?.label[lang], emoji: transportOpt?.emoji },
    ];

    const summaryCardSx = {
      borderRadius: 3, p: 3, background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 2,
    };

    const summaryLabelSx = {
      color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5,
    };

    const summaryValueSx = {
      color: "#ffffff", fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" },
    };

    return (
      <>
        <Fade in timeout={600}>
          <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: "1.4rem", sm: "1.6rem" }, mb: 4, letterSpacing: 0.5 }}>
            {t("Ton séjour", "Your trip")}
          </Typography>
        </Fade>
        <Fade in timeout={800}>
          <Box sx={{ ...sectionStyle, gap: 2 }}>
            {summaryItems.map((item, idx) => (
              <Box key={idx} sx={summaryCardSx}>
                <Typography sx={{ fontSize: "1.5rem" }}>{item.emoji}</Typography>
                <Box>
                  <Typography sx={summaryLabelSx}>{item.label}</Typography>
                  <Typography sx={summaryValueSx}>{item.value}</Typography>
                </Box>
              </Box>
            ))}

            {/* Interests */}
            <Box sx={{ borderRadius: 3, p: 3, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Typography sx={summaryLabelSx}>{t("Centres d'intérêt", "Interests")}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {selectedInterestLabels.map((label, idx) => (
                  <Box key={idx} sx={{ borderRadius: 2, px: 2, py: 0.75, background: "rgba(100,181,246,0.1)", border: "1px solid rgba(100,181,246,0.2)" }}>
                    <Typography sx={{ color: "#64b5f6", fontWeight: 500, fontSize: "0.82rem" }}>{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Pace */}
            <Box sx={summaryCardSx}>
              <Typography sx={{ fontSize: "1.5rem" }}>{paceOpt?.emoji}</Typography>
              <Box>
                <Typography sx={summaryLabelSx}>{t("Rythme", "Pace")}</Typography>
                <Typography sx={summaryValueSx}>{paceOpt?.label[lang]}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", mt: 0.5 }}>
                  {paceOpt?.description[lang]}
                </Typography>
              </Box>
            </Box>

            {/* Restaurant preference */}
            <Box sx={summaryCardSx}>
              <RestaurantIcon sx={{ color: includeRestaurants ? "#64b5f6" : "rgba(255,255,255,0.3)", fontSize: 28 }} />
              <Box>
                <Typography sx={summaryLabelSx}>{t("Restaurants", "Restaurants")}</Typography>
                <Typography sx={summaryValueSx}>
                  {includeRestaurants
                    ? t("Inclus dans le séjour", "Included in the trip")
                    : t("Non inclus", "Not included")}
                </Typography>
              </Box>
            </Box>

            {/* Personal reservations */}
            <Box sx={{ borderRadius: 3, p: 3, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: activities.length > 0 ? 2 : 0 }}>
                <EventIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 24 }} />
                <Typography component="span" sx={{ ...summaryLabelSx, mb: 0 }}>
                  {t("Réservations personnelles", "Personal reservations")}
                </Typography>
              </Box>
              {activities.length === 0 ? (
                <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                  {t("Aucune activité réservée", "No booked activities")}
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {activities.map((act) => (
                    <Box key={act.id} sx={{ borderRadius: 2, p: 2, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: "0.85rem" }}>
                        {act.name}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", mt: 0.25 }}>
                        {t("Jour", "Day")} {act.day} · {act.startTime}{act.endTime ? ` – ${act.endTime}` : ""}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                        📍 {act.location}
                      </Typography>
                      {act.notes && (
                        <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", mt: 0.25, fontStyle: "italic" }}>
                          {act.notes}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 2, p: 3, borderRadius: 3, textAlign: "center", background: "rgba(100,181,246,0.08)", border: "1px solid rgba(100,181,246,0.2)" }}>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {t("Votre séjour se prépare bientôt.", "Your trip is being prepared soon.")}
              </Typography>
            </Box>
          </Box>
        </Fade>

        <Fade in timeout={900}>
          <Box sx={{ display: "flex", gap: 2, maxWidth: 480 }}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={backButtonSx}>
              {t("Retour", "Back")}
            </Button>
            <Button onClick={resetAll} sx={{ ...backButtonSx }}>
              {t("Recommencer", "Start over")}
            </Button>
          </Box>
        </Fade>
      </>
    );
  };

  const stepContent = [
    renderIslandStep,
    renderDurationStep,
    renderCompanionsStep,
    renderTransportStep,
    renderInterestsStep,
    renderPaceStep,
    renderRestaurantStep,
    renderReservationsStep,
    renderSummaryStep,
  ];

  return (
    <Box sx={pageBackground}>
      {renderProgress()}
      {stepContent[step]()}
      {step < TOTAL_STEPS - 1 && (
        <Fade in timeout={900}>
          <Box sx={{ display: "flex", gap: 2, maxWidth: 480 }}>
            {step > 0 && (
              <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={backButtonSx}>
                {t("Retour", "Back")}
              </Button>
            )}
            <Button
              disabled={!canContinue()}
              onClick={handleContinue}
              sx={continueButtonSx(canContinue())}
            >
              {t("Continuer", "Continue")}
            </Button>
          </Box>
        </Fade>
      )}
      <BottomNav />
    </Box>
  );
}
