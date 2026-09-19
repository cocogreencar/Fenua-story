import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebaseConfig";
import { detectIslandByLocation, islandBounds } from "../data/islands";

const TILE_MIN_ZOOM = 10;
const TILE_MAX_ZOOM = 14;

const MANIFEST_DIR = "fenua-offline";
const MANIFEST_PREFIX = "manifest_";

function manifestPath(islandId) {
  return `${MANIFEST_DIR}/${MANIFEST_PREFIX}${islandId}.json`;
}

function mediaDir(islandId) {
  return `${MANIFEST_DIR}/${islandId}`;
}

function tilesDir(islandId) {
  return `${MANIFEST_DIR}/${islandId}/tiles`;
}

function tilePath(islandId, z, x, y) {
  return `${tilesDir(islandId)}/${z}/${x}/${y}.png`;
}

function lngLatToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) +
          1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );
  return { x, y };
}

function computeTileList(islandId) {
  const bounds = islandBounds[islandId];
  if (!bounds) return [];
  const tiles = [];
  for (let z = TILE_MIN_ZOOM; z <= TILE_MAX_ZOOM; z++) {
    const minTileX = lngLatToTile(bounds.latMin, bounds.lngMin, z).x;
    const maxTileX = lngLatToTile(bounds.latMin, bounds.lngMax, z).x;
    const minTileY = lngLatToTile(bounds.latMax, bounds.lngMin, z).y;
    const maxTileY = lngLatToTile(bounds.latMin, bounds.lngMax, z).y;
    for (let x = minTileX; x <= maxTileX; x++) {
      for (let y = minTileY; y <= maxTileY; y++) {
        tiles.push({ z, x, y });
      }
    }
  }
  return tiles;
}

async function downloadTile(islandId, z, x, y, token) {
  const url = `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}@2x.png?access_token=${token}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    const path = tilePath(islandId, z, x, y);
    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Data,
      recursive: true,
      encoding: Encoding.Base64,
    });
    return path;
  } catch (e) {
    console.warn(`Failed to download tile ${z}/${x}/${y}:`, e);
    return null;
  }
}

async function downloadMapTiles(islandId) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) return null;
  const tiles = computeTileList(islandId);
  for (const t of tiles) {
    await downloadTile(islandId, t.z, t.x, t.y, token);
  }
  return { minZoom: TILE_MIN_ZOOM, maxZoom: TILE_MAX_ZOOM, count: tiles.length };
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

  // Download raster map tiles for offline use
  try {
    const tileInfo = await downloadMapTiles(islandId);
    if (tileInfo) {
      manifest.mapTiles = tileInfo;
      await Filesystem.writeFile({
        path: manifestPath(islandId),
        data: JSON.stringify(manifest),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
        recursive: true,
      });
    }
  } catch (e) {
    console.warn(`Failed to download map tiles for ${islandId}:`, e);
  }

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

  // Delete media directory (includes tiles subdirectory)
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

export function getOfflineMapStyle(islandId) {
  const dir = tilesDir(islandId);
  const baseUri = Capacitor.convertFileSrc(`${dir}/{z}/{x}/{y}.png`);
  return {
    version: 8,
    sources: {
      "offline-tiles": {
        type: "raster",
        tiles: [baseUri],
        tileSize: 512,
        maxzoom: TILE_MAX_ZOOM,
      },
    },
    layers: [
      {
        id: "offline-tiles-layer",
        type: "raster",
        source: "offline-tiles",
        minzoom: TILE_MIN_ZOOM,
        maxzoom: TILE_MAX_ZOOM + 1,
      },
    ],
  };
}
