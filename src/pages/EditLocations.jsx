import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { TextField, Button, Stack, Paper, Typography } from "@mui/material";
import RichTextBox from "../components/RichTextBox";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { deleteObject } from "firebase/storage";

export default function EditLocations() {
  const { id } = useParams();
  const db = getFirestore();
  const navigate = useNavigate();

  const storage = getStorage();

  const [newImage, setNewImage] = useState(null);
  const [newAudioEn, setNewAudioEn] = useState(null);
  const [newAudioFr, setNewAudioFr] = useState(null);

  const [removeImage, setRemoveImage] = useState(false);
  const [removeAudioEn, setRemoveAudioEn] = useState(false);
  const [removeAudioFr, setRemoveAudioFr] = useState(false);

  const [poi, setPoi] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const deleteFileByUrl = async (url) => {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (err) {
      console.warn("Storage delete skipped:", err.message);
    }
  };

  useEffect(() => {
    const loadPOI = async () => {
      const ref = doc(db, "pois", id);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        setPoi(snapshot.data());
      }
    };

    loadPOI();
  }, [id]);

  if (!poi) return <div>Loading...</div>;

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const refDoc = doc(db, "pois", id);
      let updatedData = { ...poi };

      /* ---------- IMAGE ---------- */
      if (removeImage) {
        if (poi.imgUrl) await deleteFileByUrl(poi.imgUrl);
        updatedData.imgUrl = "";
      } else if (newImage) {
        const imgUrl = await uploadFile(newImage, `poi/${id}/image.jpg`);
        updatedData.imgUrl = imgUrl;
      }

      /* ---------- AUDIO EN ---------- */
      if (removeAudioEn) {
        if (poi.audio?.en) await deleteFileByUrl(poi.audio.en);
        updatedData.audio = { ...updatedData.audio, en: "" };
      } else if (newAudioEn) {
        const audioEnUrl = await uploadFile(
          newAudioEn,
          `poi/${id}/audio-en.mp3`
        );
        updatedData.audio = { ...updatedData.audio, en: audioEnUrl };
      }

      /* ---------- AUDIO FR ---------- */
      if (removeAudioFr) {
        if (poi.audio?.fr) await deleteFileByUrl(poi.audio.fr);
        updatedData.audio = { ...updatedData.audio, fr: "" };
      } else if (newAudioFr) {
        const audioFrUrl = await uploadFile(
          newAudioFr,
          `poi/${id}/audio-fr.mp3`
        );
        updatedData.audio = { ...updatedData.audio, fr: audioFrUrl };
      }

      await updateDoc(refDoc, updatedData);
      alert("POI updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this record?")) return;
    await deleteDoc(doc(db, "pois", id));
    navigate("/admin/edit");
  };

  return (
    <Paper sx={{ padding: 3, margin: 3 }}>
      <h2>Edit POI</h2>

      <Stack spacing={3}>
        {/* Title EN */}
        <TextField
          label="Title (EN)"
          value={poi.title.en}
          onChange={(e) =>
            setPoi({
              ...poi,
              title: { ...poi.title, en: e.target.value },
            })
          }
        />

        {/* Title FR */}
        <TextField
          label="Title (FR)"
          value={poi.title.fr}
          onChange={(e) =>
            setPoi({
              ...poi,
              title: { ...poi.title, fr: e.target.value },
            })
          }
        />

        {/* Description EN */}
        <div>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Description (EN)
          </Typography>
          <RichTextBox
            value={poi.description.en}
            onChange={(val) =>
              setPoi({
                ...poi,
                description: { ...poi.description, en: val },
              })
            }
          />
        </div>

        {/* Description FR */}
        <div>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Description (FR)
          </Typography>
          <RichTextBox
            value={poi.description.fr}
            onChange={(val) =>
              setPoi({
                ...poi,
                description: { ...poi.description, fr: val },
              })
            }
          />
        </div>

        {/* IMAGE */}
        <div>
          <Typography fontWeight={600}>Image</Typography>

          {poi.imgUrl && !removeImage && (
            <>
              <img
                src={poi.imgUrl}
                alt="current"
                style={{ width: 200, borderRadius: 8 }}
              />
              <Button
                size="small"
                color="error"
                onClick={() => setRemoveImage(true)}
                variant="outlined"
                sx={{ m: 2 }}
              >
                Remove Image
              </Button>
            </>
          )}

          {removeImage && (
            <Typography color="error">Image will be removed</Typography>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setNewImage(e.target.files[0]);
              setRemoveImage(false);
            }}
          />
        </div>

        <div>
          <Typography fontWeight={600}>Audio (EN)</Typography>

          {poi.audio?.en && !removeAudioEn && (
            <>
              <audio controls src={poi.audio.en} />
              <Button
                size="small"
                color="error"
                onClick={() => setRemoveAudioEn(true)}
                variant="outlined"
              >
                Remove Audio EN
              </Button>
            </>
          )}

          {removeAudioEn && (
            <Typography color="error">Audio EN will be removed</Typography>
          )}

          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              setNewAudioEn(e.target.files[0]);
              setRemoveAudioEn(false);
            }}
          />
        </div>

        <div>
          <Typography fontWeight={600}>Audio (FR)</Typography>

          {poi.audio?.fr && !removeAudioFr && (
            <>
              <audio controls src={poi.audio.fr} />
              <Button
                size="small"
                color="error"
                onClick={() => setRemoveAudioFr(true)}
                variant="outlined"
              >
                Remove Audio FR
              </Button>
            </>
          )}

          {removeAudioFr && (
            <Typography color="error">Audio FR will be removed</Typography>
          )}

          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              setNewAudioFr(e.target.files[0]);
              setRemoveAudioFr(false);
            }}
          />
        </div>

        {/* SAVE */}
        <Button variant="contained" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>

        {/* DELETE */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={isSaving}
        >
          Delete Record
        </Button>
      </Stack>
    </Paper>
  );
}
