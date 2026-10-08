import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import HandymanIcon from "@mui/icons-material/Handyman";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useLanguage } from "../context/LanguageContext";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const tabs = [
    {
      label: lang === "fr" ? "Explorer" : "Explore",
      icon: <ExploreIcon />,
      path: "/",
    },
    {
      label: lang === "fr" ? "Badge" : "Badge",
      icon: <CardMembershipIcon />,
      path: "/badge",
    },
    {
      label: lang === "fr" ? "Mon séjour" : "My trip",
      icon: <LuggageIcon />,
      path: "/mon-sejour",
    },
    {
      label: lang === "fr" ? "Pratique" : "Practical",
      icon: <HandymanIcon />,
      path: "/practical",
    },
  ];

  const currentTab = (() => {
    if (location.pathname === "/") return 0;
    if (location.pathname === "/badge") return 1;
    if (location.pathname === "/mon-sejour") return 2;
    if (location.pathname === "/practical") return 3;
    return 0;
  })();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        pb: "env(safe-area-inset-bottom, 0px)",
        background: "rgba(10, 25, 41, 0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <BottomNavigation
        value={currentTab}
        sx={{
          backgroundColor: "transparent",
          height: 64,
          "& .MuiBottomNavigationAction-root": {
            color: "rgba(255,255,255,0.45)",
            transition: "color 0.2s ease",
            maxWidth: "none",
          },
          "& .MuiBottomNavigationAction-root.Mui-selected": {
            color: "#64b5f6",
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.7rem",
            fontWeight: 500,
          },
        }}
      >
        {tabs.map((tab, idx) => (
          <BottomNavigationAction
            key={idx}
            label={tab.label}
            icon={tab.icon}
            onClick={() => navigate(tab.path)}
            showLabel
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
