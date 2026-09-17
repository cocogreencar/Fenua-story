import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { detectIslandByLocation } from "../data/islands";
import { readIslandManifest } from "../services/offlineStorage";

export default function usePOIs(islandId) {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "pois"),
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((poi) => {
            if (!islandId) return true;
            if (poi.island) return poi.island === islandId;
            const detected = detectIslandByLocation(
              poi.location?.lat,
              poi.location?.lng
            );
            return detected === islandId;
          });
        setPois(list);
        setLoading(false);
      },
      async (err) => {
        console.error("Error fetching POIs:", err);
        setError(err);
        // Offline fallback: load from downloaded manifest
        if (islandId) {
          const manifest = await readIslandManifest(islandId);
          if (manifest?.pois) {
            const list = manifest.pois.map((entry) => ({
              id: entry.id,
              ...entry.data,
              localImage: entry.localImage,
              localAudio: entry.localAudio,
            }));
            setPois(list);
          }
        }
        setLoading(false);
      }
    );

    return () => unsub();
  }, [islandId]);

  return { pois, loading, error };
}
