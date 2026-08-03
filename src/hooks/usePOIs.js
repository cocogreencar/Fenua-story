import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function usePOIs() {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "pois"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPois(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching POIs:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub(); // cleanup
  }, []);

  return { pois, loading, error };
}
