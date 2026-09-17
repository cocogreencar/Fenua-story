import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { detectIslandByLocation } from "../data/islands";

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
      (err) => {
        console.error("Error fetching POIs:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [islandId]);

  return { pois, loading, error };
}
