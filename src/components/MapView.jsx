import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usePOIs from "../hooks/usePOIs";
import PopupContent from "./PopupContent";
import ReactDOM from "react-dom/client";
import { readIslandManifest, getOfflineMapStyle } from "../services/offlineStorage";
import { islandBounds } from "../data/islands";

const ROUTE_LAYER_ID = "route-line";
const ROUTE_SOURCE_ID = "route-source";

export default function MapView({ lang, island }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const activePopupRef = useRef(null);
  const routeStateRef = useRef({ active: false });

  const { pois, loading, error } = usePOIs(island?.id);
  const [offlineMode, setOfflineMode] = useState(false);
  const [hasTiles, setHasTiles] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState(null);

  const categoryIcons = {
    "Point of interest": "/icons/m1-01.svg",
    Restaurants: "/icons/m3-01.svg",
    "Tourist activities": "/icons/m2-01.svg",
  };

  const isOnline = () => navigator.onLine;

  const clearRoute = useCallback(() => {
    const m = map.current;
    if (!m) return;

    if (m.getLayer(ROUTE_LAYER_ID)) m.removeLayer(ROUTE_LAYER_ID);
    if (m.getSource(ROUTE_SOURCE_ID)) m.removeSource(ROUTE_SOURCE_ID);

    routeStateRef.current = { active: false };
    setRouteInfo(null);
    setRouteError(null);
  }, []);

  const requestRoute = useCallback(
    async (poi) => {
      if (!poi?.location?.lat || !poi?.location?.lng) return;
      if (!isOnline()) {
        setRouteError(
          lang === "fr"
            ? "Connexion Internet nécessaire pour calculer l'itinéraire."
            : "An Internet connection is required to calculate the route."
        );
        return;
      }

      const m = map.current;
      if (!m) return;

      setRouteError(null);

      const destLng = poi.location.lng;
      const destLat = poi.location.lat;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const originLng = pos.coords.longitude;
          const originLat = pos.coords.latitude;

          const token = import.meta.env.VITE_MAPBOX_TOKEN;
          const url =
            `https://api.mapbox.com/directions/v5/mapbox/driving/` +
            `${originLng},${originLat};${destLng},${destLat}` +
            `?geometries=geojson&overview=full&steps=false&access_token=${token}`;

          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Directions API error");
            const data = await res.json();
            if (!data.routes || data.routes.length === 0) throw new Error("No route");

            const route = data.routes[0];
            const routeGeo = route.geometry;

            clearRoute();

            m.addSource(ROUTE_SOURCE_ID, {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: routeGeo,
                properties: {},
              },
            });

            m.addLayer({
              id: ROUTE_LAYER_ID,
              type: "line",
              source: ROUTE_SOURCE_ID,
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#64b5f6",
                "line-width": 5,
                "line-opacity": 0.85,
              },
            });

            routeStateRef.current = { active: true };

            const coords = routeGeo.coordinates;
            const bounds = coords.reduce(
              (b, c) => b.extend(c),
              new mapboxgl.LngLatBounds(coords[0], coords[0])
            );
            m.fitBounds(bounds, {
              padding: { top: 120, bottom: 120, left: 80, right: 80 },
              duration: 800,
            });

            const durationMin = Math.round(route.duration / 60);
            const distanceKm = (route.distance / 1000).toFixed(1);

            setRouteInfo({ durationMin, distanceKm });

            if (activePopupRef.current) {
              activePopupRef.current.remove();
              activePopupRef.current = null;
            }
          } catch {
            setRouteError(
              lang === "fr"
                ? "Impossible de calculer l'itinéraire. Veuillez réessayer."
                : "Could not calculate the route. Please try again."
            );
          }
        },
        () => {
          setRouteError(
            lang === "fr"
              ? "Impossible d'obtenir votre position."
              : "Could not get your location."
          );
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    [lang, clearRoute]
  );

  // Detect offline state
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

    let style = "mapbox://styles/mapbox/outdoors-v12";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center: island.center,
      zoom: island.zoom,
    });

    map.current.on("load", () => {
      const bounds = islandBounds[island.id];
      if (!bounds) return;

      if (island.id === "tahiti") {
        map.current.fitBounds(
          [
            [bounds.lngMin, bounds.latMin],
            [bounds.lngMax, bounds.latMax],
          ],
          { padding: { top: 80, bottom: 80, left: 160, right: 40 }, duration: 0 }
        );
      } else if (island.id === "bora-bora") {
        map.current.fitBounds(
          [
            [-151.78, -16.58],
            [-151.62, -16.42],
          ],
          { padding: { top: 80, bottom: 80, left: 40, right: 40 }, duration: 0 }
        );
      } else {
        map.current.fitBounds(
          [
            [bounds.lngMin, bounds.latMin],
            [bounds.lngMax, bounds.latMax],
          ],
          { padding: { top: 80, bottom: 80, left: 40, right: 40 }, duration: 0 }
        );
      }
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

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
            if (activePopupRef.current === popup) activePopupRef.current = null;
          }}
          onDirections={() => {
            activePopupRef.current = popup;
            requestRoute(poi);
          }}
        />
      );

      popup.setDOMContent(popupNode);

      const iconSrc = categoryIcons[poi.category?.en] || "/icons/m1-01.svg";

      const el = document.createElement("div");
      el.innerHTML = `
  <img src="${iconSrc}" 
    alt="marker" 
    style="width:32px;height:32px;object-fit:contain;" />
`;
      el.style.cursor = "pointer";

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([poi.location.lng, poi.location.lat])
        .setPopup(popup)
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        if (currentPopup && currentPopup !== popup) {
          currentPopup.remove();
        }
        currentPopup = popup;
        activePopupRef.current = popup;

        map.current.flyTo({
          center: [poi.location.lng, poi.location.lat],
          zoom: 15,
          speed: 1.2,
          curve: 1.42,
          essential: true,
        });
      });

      markersRef.current.push(marker);
    });
  }, [pois, loading, lang, requestRoute]);

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
    <>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100vh", borderRadius: "12px" }}
      />

      {/* Route info bar — compact, top-center */}
      {routeInfo && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px 6px 14px",
            borderRadius: "20px",
            background: "rgba(13, 30, 48, 0.92)",
            border: "1px solid rgba(100,181,246,0.25)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
            color: "#ffffff",
            fontSize: "0.82rem",
            fontWeight: 500,
            maxWidth: "90vw",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "0.95rem" }}>🚗</span>
          <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>
            {routeInfo.durationMin} min
          </span>
          <span style={{ opacity: 0.5, fontWeight: 400 }}>•</span>
          <span>{routeInfo.distanceKm} km</span>
          <button
            onClick={clearRoute}
            aria-label={lang === "fr" ? "Quitter l'itinéraire" : "Exit route"}
            style={{
              marginLeft: "4px",
              width: "26px",
              height: "26px",
              minWidth: "26px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(239,83,80,0.9)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Route error toast */}
      {routeError && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            padding: "10px 18px",
            borderRadius: "12px",
            background: "rgba(239,83,80,0.92)",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 500,
            maxWidth: "90vw",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          onClick={() => setRouteError(null)}
        >
          {routeError}
        </div>
      )}
    </>
  );
}
