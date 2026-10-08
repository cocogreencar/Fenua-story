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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useLanguage } from "../context/LanguageContext";
import BottomNav from "../components/BottomNav";

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

const TOTAL_STEPS = 5;

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

export default function MonSejourPage() {
  const { lang } = useLanguage();

  const [step, setStep] = useState(0);
  const [island, setIsland] = useState(null);
  const [duration, setDuration] = useState(null);
  const [customDays, setCustomDays] = useState("");
  const [companions, setCompanions] = useState(null);
  const [transport, setTransport] = useState(null);

  const t = (fr, en) => (lang === "fr" ? fr : en);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

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
    return true;
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleContinue = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };

  const renderProgress = () => (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 480, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
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
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
            mb: 2,
            letterSpacing: 0.5,
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
            lineHeight: 1.6,
            mb: 4,
            maxWidth: 480,
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
              <Card
                key={opt.id}
                onClick={() => setIsland(opt.id)}
                sx={selectableCardSx(isSelected)}
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
                    <Typography sx={{ fontSize: "1.6rem" }}>{opt.emoji}</Typography>
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      {opt.name[lang]}
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
    </>
  );

  // ---- Step 1: Duration ----
  const renderDurationStep = () => (
    <>
      <Fade in timeout={600}>
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.4rem", sm: "1.6rem" },
            mb: 4,
            letterSpacing: 0.5,
          }}
        >
          {t("Combien de temps restes-tu ?", "How long are you staying?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box
          sx={{
            ...sectionStyle,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
          }}
        >
          {durationOptions.map((opt) => {
            const isSelected = duration === opt.value;
            return (
              <Card
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                sx={selectableCardSx(isSelected)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2,
                    px: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
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
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.85rem",
                mb: 1.5,
              }}
            >
              {t("Nombre de jours exact", "Exact number of days")}
            </Typography>
            <TextField
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              inputProps={{ min: 7 }}
              size="small"
              sx={{
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
              }}
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
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.4rem", sm: "1.6rem" },
            mb: 4,
            letterSpacing: 0.5,
          }}
        >
          {t("Avec qui voyages-tu ?", "Who are you traveling with?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box
          sx={{
            ...sectionStyle,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
          }}
        >
          {companionOptions.map((opt) => {
            const isSelected = companions === opt.id;
            return (
              <Card
                key={opt.id}
                onClick={() => setCompanions(opt.id)}
                sx={selectableCardSx(isSelected)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    py: 2.5,
                    px: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "1.8rem" }}>{opt.emoji}</Typography>
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
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
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.4rem", sm: "1.6rem" },
            mb: 4,
            letterSpacing: 0.5,
          }}
        >
          {t("Comment te déplaces-tu ?", "How do you get around?")}
        </Typography>
      </Fade>
      <Fade in timeout={800}>
        <Box
          sx={{
            ...sectionStyle,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
          }}
        >
          {transportOptions.map((opt) => {
            const isSelected = transport === opt.id;
            return (
              <Card
                key={opt.id}
                onClick={() => setTransport(opt.id)}
                sx={selectableCardSx(isSelected)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    py: 2.5,
                    px: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "1.8rem" }}>{opt.emoji}</Typography>
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
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
          <Box
            sx={{
              mt: 4,
              maxWidth: 480,
              borderRadius: 3,
              p: 3,
              background: "rgba(76, 175, 80, 0.08)",
              border: "1px solid rgba(76, 175, 80, 0.2)",
            }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.95rem",
                mb: 1,
              }}
            >
              🚗 {t("Besoin de louer une voiture ?", "Need to rent a car?")}
            </Typography>
            <Box
              component="a"
              href={lang === "fr" ? "https://www.cocogreencar.com/" : "https://www.cocogreencar.com/en"}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color: "#66bb6a",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "color 0.2s ease",
                "&:hover": { color: "#81c784" },
              }}
            >
              {t("Réserver avec Coco Green Car", "Book with Coco Green Car")}
              <OpenInNewIcon sx={{ fontSize: 16 }} />
              <span>→</span>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  );

  // ---- Step 4: Summary ----
  const renderSummaryStep = () => {
    const islandName = islandOptions.find((i) => i.id === island)?.name[lang];
    const durationLabel =
      duration === 7
        ? `${customDays} ${t("jours", "days")}`
        : durationOptions.find((d) => d.value === duration)?.label[lang];
    const companionLabel = companionOptions.find((c) => c.id === companions)?.label[lang];
    const transportOpt = transportOptions.find((t2) => t2.id === transport);

    const summaryItems = [
      { label: t("Île", "Island"), value: islandName, emoji: islandOptions.find((i) => i.id === island)?.emoji },
      { label: t("Durée", "Duration"), value: durationLabel, emoji: "📅" },
      { label: t("Compagnons", "Companions"), value: companionLabel, emoji: companionOptions.find((c) => c.id === companions)?.emoji },
      { label: t("Transport", "Transport"), value: transportOpt?.label[lang], emoji: transportOpt?.emoji },
    ];

    return (
      <>
        <Fade in timeout={600}>
          <Typography
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              mb: 4,
              letterSpacing: 0.5,
            }}
          >
            {t("Ton séjour", "Your trip")}
          </Typography>
        </Fade>
        <Fade in timeout={800}>
          <Box sx={{ ...sectionStyle, gap: 2 }}>
            {summaryItems.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography sx={{ fontSize: "1.5rem" }}>{item.emoji}</Typography>
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      mb: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                mt: 2,
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: "rgba(100,181,246,0.08)",
                border: "1px solid rgba(100,181,246,0.2)",
              }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {t(
                  "Votre séjour se prépare bientôt.",
                  "Your trip is being prepared soon."
                )}
              </Typography>
            </Box>
          </Box>
        </Fade>

        <Fade in timeout={900}>
          <Box sx={{ display: "flex", gap: 2, maxWidth: 480 }}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={backButtonSx}>
              {t("Retour", "Back")}
            </Button>
            <Button
              onClick={() => {
                setStep(0);
                setIsland(null);
                setDuration(null);
                setCustomDays("");
                setCompanions(null);
                setTransport(null);
              }}
              sx={{
                ...backButtonSx,
                mt: 4,
              }}
            >
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
