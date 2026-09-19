import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usePOIs from "../hooks/usePOIs";
import PopupContent from "./PopupContent";
import ReactDOM from "react-dom/client";
import { readIslandManifest, getOfflineMapStyle } from "../services/offlineStorage";
import { islandBounds } from "../data/islands";

export default function MapView({ lang, island }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const { pois, loading, error } = usePOIs(island?.id);
  const [offlineMode, setOfflineMode] = useState(false);
  const [hasTiles, setHasTiles] = useState(false);

  const categoryIcons = {
    "Point of interest": "/icons/m1-01.svg",
    Restaurants: "/icons/m3-01.svg",
    "Tourist activities": "/icons/m2-01.svg",
  };

  // Detect offline state: if Firebase errored and we loaded from manifest
  useEffect(() => {
    if (!island?.id) return;
    if (error) {
      setOfflineMode(true);
      readIslandManifest(island.id).then((manifest) => {
        setHasTiles(!!manifest?.mapTiles);
      });
    } else {
      setOfflineMode(false);
      setHasTiles(false);
    }
  }, [error, island?.id]);

  // Initialize Map
  useEffect(() => {
    if (map.current) return;
    if (!island) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    // Determine style: online vector style, or offline raster tiles if available
    let style = "mapbox://styles/mapbox/outdoors-v12";

    // We'll check for offline tiles synchronously via a flag set by the detection effect.
    // The map initializes with online style by default; if offline, the style swap
    // happens in a separate effect below once hasTiles is confirmed.

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center: island.center,
      zoom: island.zoom,
    });

    // Fit map to island bounds on initial load (per-island tuning)
    map.current.on("load", () => {
      const bounds = islandBounds[island.id];
      if (!bounds) return;

      if (island.id === "tahiti") {
        // Explicit center shifted slightly east so the whole island is visible
        map.current.jumpTo({ center: [-149.50, -17.62], zoom: 11 });
      } else if (island.id === "bora-bora") {
        // Same center, zoomed in ~1 level closer
        map.current.jumpTo({ center: [-151.70, -16.50], zoom: 13 });
      } else {
        // Moorea and default — unchanged
        map.current.fitBounds(
          [
            [bounds.lngMin, bounds.latMin],
            [bounds.lngMax, bounds.latMax],
          ],
          { padding: { top: 80, bottom: 80, left: 40, right: 40 }, duration: 0 }
        );
      }
    });

    // 🔹 Zoom + rotation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    // 🔹 User location (GPS)
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );
  }, []);

  // Switch to offline raster style when offline and tiles are available
  useEffect(() => {
    if (!map.current || !island?.id) return;
    if (offlineMode && hasTiles) {
      const offlineStyle = getOfflineMapStyle(island.id);
      map.current.setStyle(offlineStyle);
    }
  }, [offlineMode, hasTiles, island?.id]);

  // Add markers with React popup
  useEffect(() => {
    if (!map.current || loading) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    let currentPopup = null;

    pois.forEach((poi) => {
      if (!poi.location?.lat || !poi.location?.lng) return;

      const popupNode = document.createElement("div");

      const popup = new mapboxgl.Popup({
        offset: 0,
        maxWidth: "300px",
        closeOnClick: false,
        closeButton: false,
      });

      const root = ReactDOM.createRoot(popupNode);
      root.render(
        <PopupContent
          poi={poi}
          lang={lang}
          onClose={() => {
            popup.remove();
            if (currentPopup === popup) currentPopup = null;
          }}
        />
      );

      popup.setDOMContent(popupNode);

      // Pick icon based on category
      const iconSrc = categoryIcons[poi.category?.en] || "/icons/m1-01.svg"; // fallback

      // Create custom marker HTML
      const el = document.createElement("div");
      el.innerHTML = `
  <img src="${iconSrc}" 
    alt="marker" 
    style="width:32px;height:32px;object-fit:contain;" />
`;
      el.style.cursor = "pointer";

      // Create marker with custom element
      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([poi.location.lng, poi.location.lat])
        .setPopup(popup)
        .addTo(map.current);

      // Track current popup to close previous one
      marker.getElement().addEventListener("click", () => {
        if (currentPopup && currentPopup !== popup) {
          currentPopup.remove();
        }

        currentPopup = popup;

        // Zoom & center to marker
        map.current.flyTo({
          center: [poi.location.lng, poi.location.lat],
          zoom: 15, // adjust zoom level as you like
          speed: 1.2, // animation speed
          curve: 1.42, // animation smoothness
          essential: true, // respects reduced motion
        });
      });

      markersRef.current.push(marker);
    });
  }, [pois, loading, lang]);

  // Show message when offline and island not downloaded
  if (offlineMode && !hasTiles && !loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1929",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "1rem",
            textAlign: "center",
            maxWidth: "320px",
            lineHeight: 1.6,
          }}
        >
          {lang === "fr"
            ? "Cette île n'est pas disponible hors ligne. Veuillez la télécharger depuis l'écran de sélection des îles lorsque vous êtes en ligne."
            : "This island is not available offline. Please download it from the island selection screen while you are online."}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100vh", borderRadius: "12px" }}
    />
  );
}
