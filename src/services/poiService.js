import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addPOI = async (poi) => {
  try {
    const docRef = await addDoc(collection(db, "pois"), poi);
    console.log("POI added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding POI:", error);
  }
};
