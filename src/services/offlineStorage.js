import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebaseConfig";
import { detectIslandByLocation } from "../data/islands";

const MANIFEST_DIR = "fenua-offline";
const MANIFEST_PREFIX = "manifest_";

function manifestPath(islandId) {
  return `${MANIFEST_DIR}/${MANIFEST_PREFIX}${islandId}.json`;
}

function mediaDir(islandId) {
  return `${MANIFEST_DIR}/${islandId}`;
}

async function ensureDir(path) {
  try {
    await Filesystem.mkdir({
      path,
      directory: Directory.Data,
      recursive: true,
    });
  } catch (e) {
    // directory already exists — ignore
  }
}

async function downloadFile(url, islandId, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64 = await blobToBase64(blob);
  const dir = mediaDir(islandId);
  await ensureDir(dir);
  const filePath = `${dir}/${filename}`;
  await Filesystem.writeFile({
    path: filePath,
    data: base64,
    directory: Directory.Data,
    recursive: true,
    encoding: Encoding.Base64,
  });
  return filePath;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64 = typeof result === "string" ? result.split(",")[1] : "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function getIslandPois(islandId) {
  const snapshot = await getDocs(collection(db, "pois"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((poi) => {
      if (poi.island) return poi.island === islandId;
      const detected = detectIslandByLocation(
        poi.location?.lat,
        poi.location?.lng
      );
      return detected === islandId;
    });
}

export async function downloadIsland(islandId) {
  const pois = await getIslandPois(islandId);
  const manifest = {
    islandId,
    downloadedAt: new Date().toISOString(),
    pois: [],
  };

  await ensureDir(MANIFEST_DIR);

  for (const poi of pois) {
    const entry = { id: poi.id, data: { ...poi } };

    // Download image
    if (poi.imgUrl) {
      try {
        const imageRef = ref(storage, poi.imgUrl);
        const url = await getDownloadURL(imageRef);
        const ext = poi.imgUrl.split(".").pop().split("?")[0] || "jpg";
        const filename = `${sanitizeFilename(poi.id)}_img.${ext}`;
        const localPath = await downloadFile(url, islandId, filename);
        entry.localImage = localPath;
      } catch (e) {
        console.warn(`Failed to download image for POI ${poi.id}:`, e);
      }
    }

    // Download audio (FR + EN)
    entry.localAudio = {};
    for (const lang of ["fr", "en"]) {
      const audioPath = poi.audio?.[lang];
      if (audioPath) {
        try {
          const audioRef = ref(storage, audioPath);
          const url = await getDownloadURL(audioRef);
          const ext = audioPath.split(".").pop().split("?")[0] || "mp3";
          const filename = `${sanitizeFilename(poi.id)}_audio_${lang}.${ext}`;
          const localPath = await downloadFile(url, islandId, filename);
          entry.localAudio[lang] = localPath;
        } catch (e) {
          console.warn(`Failed to download ${lang} audio for POI ${poi.id}:`, e);
        }
      }
    }

    manifest.pois.push(entry);
  }

  await Filesystem.writeFile({
    path: manifestPath(islandId),
    data: JSON.stringify(manifest),
    directory: Directory.Data,
    encoding: Encoding.UTF8,
    recursive: true,
  });

  return manifest;
}

export async function readIslandManifest(islandId) {
  try {
    const result = await Filesystem.readFile({
      path: manifestPath(islandId),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    const text =
      typeof result.data === "string"
        ? result.data
        : await result.data.text();
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

export async function isIslandDownloaded(islandId) {
  try {
    await Filesystem.stat({
      path: manifestPath(islandId),
      directory: Directory.Data,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteIslandData(islandId) {
  // Delete manifest
  try {
    await Filesystem.deleteFile({
      path: manifestPath(islandId),
      directory: Directory.Data,
    });
  } catch (e) {
    // file may not exist
  }

  // Delete media directory
  try {
    await Filesystem.rmdir({
      path: mediaDir(islandId),
      directory: Directory.Data,
      recursive: true,
    });
  } catch (e) {
    // directory may not exist
  }
}
