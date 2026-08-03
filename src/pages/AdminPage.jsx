import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import RichTextBox from "../components/RichTextBox";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { logoutAdmin } from "../services/adminAuth";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const storage = getStorage();
  const db = getFirestore();

  const navigate = useNavigate();

  // Form States
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [categoryFr, setCategoryFr] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [descEn, setDescEn] = useState("");
  const [descFr, setDescFr] = useState("");

  const [audioEnFile, setAudioEnFile] = useState(null);
  const [audioFrFile, setAudioFrFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docId = Date.now().toString();

      // Upload files
      const imageUrl = imageFile
        ? await uploadFile(imageFile, `poi/${docId}/image.jpg`)
        : "";

      const audioEnUrl = audioEnFile
        ? await uploadFile(audioEnFile, `poi/${docId}/audio-en.mp3`)
        : "";

      const audioFrUrl = audioFrFile
        ? await uploadFile(audioFrFile, `poi/${docId}/audio-fr.mp3`)
        : "";

      // Save Firestore document
      await addDoc(collection(db, "pois"), {
        title: { en: titleEn, fr: titleFr },
        category: { en: categoryEn, fr: categoryFr },
        audio: { en: audioEnUrl, fr: audioFrUrl },
        description: { en: descEn, fr: descFr },
        imgUrl: imageUrl,
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        createdAt: Timestamp.now(),
      });

      alert("POI saved successfully!");

      // Reset Form
      setTitleEn("");
      setTitleFr("");
      setCategoryEn("");
      setCategoryFr("");
      setLat("");
      setLng("");
      setDescEn("");
      setDescFr("");
      setAudioEnFile(null);
      setAudioFrFile(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error saving POI:", error);
      alert("Error occurred! Check console.");
    }

    setLoading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 4,
        borderRadius: 3,
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={() => (window.location.href = "/admin/edit")}
        sx={{ mb: 3 }}
        fullWidth
      >
        Edit Existing Data
      </Button>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add New Location
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* TITLE EN */}
          <TextField
            label="Title (EN)"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            fullWidth
            required
            size="small"
          />

          {/* TITLE FR */}
          <TextField
            label="Title (FR)"
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            fullWidth
            required
            size="small"
          />

          {/* CATEGORY EN */}
          <TextField
            label="Category (EN)"
            value={categoryEn}
            onChange={(e) => setCategoryEn(e.target.value)}
            select
            fullWidth
            required
            size="small"
          >
            <MenuItem value="Points of interest">Points of interest</MenuItem>
            <MenuItem value="Restaurants">Restaurants</MenuItem>
            <MenuItem value="Tourist activities">Tourist activities</MenuItem>
          </TextField>

          {/* CATEGORY FR */}
          <TextField
            label="Category (FR)"
            value={categoryFr}
            onChange={(e) => setCategoryFr(e.target.value)}
            select
            fullWidth
            required
            size="small"
          >
            <MenuItem value="Point d'intérêt">Point d'intérêt</MenuItem>
            <MenuItem value="Restaurants">Restaurants</MenuItem>
            <MenuItem value="Activités touristiques">
              Activités touristiques
            </MenuItem>
          </TextField>

          {/* LAT */}
          <TextField
            label="Latitude"
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            fullWidth
            required
            size="small"
          />

          {/* LNG */}
          <TextField
            label="Longitude"
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            fullWidth
            required
            size="small"
          />

          {/* DESC EN */}
          <Box>
            <Typography fontWeight="600" mb={1}>
              Description (EN)
            </Typography>
            <RichTextBox value={descEn} onChange={setDescEn} />
          </Box>

          {/* DESC FR */}
          <Box>
            <Typography fontWeight="600" mb={1}>
              Description (FR)
            </Typography>
            <RichTextBox value={descFr} onChange={setDescFr} />
          </Box>

          {/* IMAGE */}
          <Button variant="outlined" component="label" fullWidth>
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>

          {/* AUDIO EN */}
          <Button variant="outlined" component="label" fullWidth>
            Upload Audio (EN)
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => setAudioEnFile(e.target.files[0])}
            />
          </Button>

          {/* AUDIO FR */}
          <Button variant="outlined" component="label" fullWidth>
            Upload Audio (FR)
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => setAudioFrFile(e.target.files[0])}
            />
          </Button>

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Location"}
          </Button>
          <Button
            color="error"
            onClick={() => {
              logoutAdmin();
              navigate("/admin-login");
            }}
          >
            Logout
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
