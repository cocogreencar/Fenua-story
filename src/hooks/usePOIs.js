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
    let unsub = null;
    let cancelled = false;

    const manifestToPOIs = (manifest) =>
      manifest.pois.map((entry) => ({
        id: entry.id,
        ...entry.data,
        localImage: entry.localImage,
        localAudio: entry.localAudio,
      }));

    const start = async () => {
      setLoading(true);
      setError(null);

      // Always try the downloaded island first.
      if (islandId) {
        const manifest = await readIslandManifest(islandId);

        if (cancelled) return;

        if (manifest?.pois?.length) {
          setPois(manifestToPOIs(manifest));
          setLoading(false);
        }
      }

      // Then listen to Firestore when available.
      unsub = onSnapshot(
        collection(db, "pois"),
        (snapshot) => {
          if (cancelled) return;

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

          // Do not erase downloaded POIs with an empty offline/cache snapshot.
          if (list.length > 0) {
            setPois(list);
          }

          setLoading(false);
        },
        async (err) => {
          if (cancelled) return;

          console.error("Error fetching POIs:", err);
          setError(err);

          if (islandId) {
            const manifest = await readIslandManifest(islandId);

            if (cancelled) return;

            if (manifest?.pois?.length) {
              setPois(manifestToPOIs(manifest));
            }
          }

          setLoading(false);
        }
      );
    };

    start();

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [islandId]);

  return { pois, loading, error };
}
