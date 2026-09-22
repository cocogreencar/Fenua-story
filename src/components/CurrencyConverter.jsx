import { useState, useMemo } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useLanguage } from "../context/LanguageContext";

const EUR_TO_XPF = 119.3317;
const USD_TO_XPF = 100;

export default function CurrencyConverter({ open, onClose }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const foreignCurrency = isFr ? "EUR" : "USD";
  const foreignSymbol = isFr ? "€" : "$";
  const rate = isFr ? EUR_TO_XPF : USD_TO_XPF;

  const [direction, setDirection] = useState("xpf-to-foreign");
  const [amount, setAmount] = useState("");

  const converted = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return "";

    if (direction === "xpf-to-foreign") {
      const result = num / rate;
      return result.toFixed(2);
    } else {
      return Math.round(num * rate).toString();
    }
  }, [amount, direction, rate]);

  const fromCurrency = direction === "xpf-to-foreign" ? "XPF" : foreignCurrency;
  const toCurrency = direction === "xpf-to-foreign" ? foreignCurrency : "XPF";
  const fromSymbol = direction === "xpf-to-foreign" ? "₣" : foreignSymbol;
  const toSymbol = direction === "xpf-to-foreign" ? foreignSymbol : "₣";

  const handleSwap = () => {
    setDirection((prev) =>
      prev === "xpf-to-foreign" ? "foreign-to-xpf" : "xpf-to-foreign"
    );
    setAmount("");
  };

  const note = isFr
    ? "Conversion EUR/XPF basée sur le taux fixe officiel."
    : "USD/XPF conversion is indicative. Exchange rates may vary.";

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(0,0,0,0.6)" },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 380 },
            maxWidth: 400,
            bgcolor: "rgba(13, 30, 48, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            p: { xs: 2.5, sm: 3 },
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.15rem",
              }}
            >
              {isFr ? "Convertisseur" : "Currency Converter"}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: "rgba(255,255,255,0.6)",
                "&:hover": { color: "#fff" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* From input */}
          <TextField
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            label={`${isFr ? "De" : "From"} · ${fromCurrency}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                    {fromSymbol}
                  </Typography>
                </InputAdornment>
              ),
              sx: {
                color: "#fff",
                fontSize: "1.3rem",
                fontWeight: 500,
                "& .MuiInputBase-input": { padding: "14px 14px" },
              },
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.05)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&.Mui-focused fieldset": { borderColor: "#64b5f6" },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.45)",
                "&.Mui-focused": { color: "#64b5f6" },
              },
            }}
          />

          {/* Swap button */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 0.5 }}>
            <IconButton
              onClick={handleSwap}
              sx={{
                color: "#64b5f6",
                bgcolor: "rgba(100,181,246,0.1)",
                border: "1px solid rgba(100,181,246,0.2)",
                "&:hover": {
                  bgcolor: "rgba(100,181,246,0.2)",
                  transform: "rotate(180deg)",
                },
                transition: "transform 0.3s ease, background 0.2s ease",
                width: 40,
                height: 40,
              }}
            >
              <SwapHorizIcon />
            </IconButton>
          </Box>

          {/* To result */}
          <TextField
            fullWidth
            value={converted}
            readOnly
            label={`${isFr ? "Vers" : "To"} · ${toCurrency}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                    {toSymbol}
                  </Typography>
                </InputAdornment>
              ),
              sx: {
                color: "#fff",
                fontSize: "1.3rem",
                fontWeight: 500,
                "& .MuiInputBase-input": { padding: "14px 14px" },
              },
            }}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(100,181,246,0.06)",
                "& fieldset": { borderColor: "rgba(100,181,246,0.15)" },
                "&:hover fieldset": { borderColor: "rgba(100,181,246,0.25)" },
                "&.Mui-focused fieldset": { borderColor: "#64b5f6" },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.45)",
                "&.Mui-focused": { color: "#64b5f6" },
              },
            }}
          />

          {/* Note */}
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.72rem",
              fontStyle: "italic",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {note}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
