import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

export default function LocationsList() {
  const db = getFirestore();
  const [pois, setPois] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "pois"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPois(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    await deleteDoc(doc(db, "pois", id));
    setPois(pois.filter((p) => p.id !== id));
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ m: 2 }}>
        Edit POIs
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title (EN)</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Lat</TableCell>
            <TableCell>Lng</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pois.map((poi) => (
            <TableRow key={poi.id}>
              <TableCell>{poi.title?.en}</TableCell>
              <TableCell>{poi.category?.en}</TableCell>
              <TableCell>{poi.location?.lat}</TableCell>
              <TableCell>{poi.location?.lng}</TableCell>

              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() =>
                    (window.location.href = `/admin/edit/${poi.id}`)
                  }
                  sx={{ width: 2 }}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(poi.id)}
                  sx={{ width: 2 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
