import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usePOIs from "../hooks/usePOIs";
import PopupContent from "./PopupContent";
import ReactDOM from "react-dom/client";

export default function MapView({ lang }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const { pois, loading } = usePOIs();

  const categoryIcons = {
    "Point of interest": "/icons/m1-01.svg",
    Restaurants: "/icons/m3-01.svg",
    "Tourist activities": "/icons/m2-01.svg",
  };

  // Initialize Map
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-149.842, -17.535],
      zoom: 11,
    });

    // 🔹 Zoom + rotation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    // 🔹 Fullscreen toggle
    // map.current.addControl(
    //   new mapboxgl.FullscreenControl({
    //     container: document.body,
    //   }),
    //   "top-right"
    // );

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

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100vh", borderRadius: "12px" }}
    />
  );
}
