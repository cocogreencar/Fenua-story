import { useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import IslandSelection from "./pages/IslandSelection";
import BadgePage from "./pages/BadgePage";
import MorePage from "./pages/MorePage";
import AboutPage from "./pages/AboutPage";
import LocationsList from "./pages/LocationsList";
import EditLocations from "./pages/EditLocations";
import "./App.css";
import ProtectedRoute from "./services/ProtectedRoutes";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<IslandSelection />} />
        <Route path="/map/:islandId" element={<HomePage />} />
        <Route path="/badge" element={<BadgePage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit"
          element={
            <ProtectedRoute>
              <LocationsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <EditLocations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
