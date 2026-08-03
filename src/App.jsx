import { useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
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
        <Route path="/" element={<HomePage />} />

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
