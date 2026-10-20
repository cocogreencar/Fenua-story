import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebaseConfig";

/**
 * Resolve a displayable image URL for a POI.
 * Prefers the local offline file (from downloaded island manifest),
 * falls back to Firebase Storage, then to a raw URL string.
 */
export function usePoiImage(poi) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      if (poi?.localImage) {
        try {
          const { uri } = await Filesystem.getUri({
            path: poi.localImage,
            directory: Directory.Data,
          });
          if (!cancelled) {
            setImageUrl(Capacitor.convertFileSrc(uri));
            setLoading(false);
          }
          return;
        } catch {
          // fall through to online
        }
      }

      if (poi?.imgUrl) {
        const raw = String(poi.imgUrl).trim();

        // If it's already a full URL (http/https), use it directly
        if (/^https?:\/\//.test(raw)) {
          if (!cancelled) {
            setImageUrl(raw);
            setLoading(false);
          }
          return;
        }

        // Otherwise treat it as a Storage path
        try {
          const url = await getDownloadURL(ref(storage, raw));
          if (!cancelled) {
            setImageUrl(url);
            setLoading(false);
          }
        } catch {
          if (!cancelled) {
            setImageUrl(null);
            setLoading(false);
          }
        }
        return;
      }

      if (!cancelled) {
        setImageUrl(null);
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [poi?.id, poi?.localImage, poi?.imgUrl]);

  return { imageUrl, loading };
}
