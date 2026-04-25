import { Response } from "express";
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  doc, 
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { dbAdmin as db } from "../lib/firebase-admin.ts";
import { AuthRequest } from "../middleware/auth.ts";

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { offerId } = req.body;
    const userId = req.user?.userId;

    if (!userId) throw new Error("Unauthorized");

    const favoriteData = {
      userId,
      offerId,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "favorites"), favoriteData);
    res.json({ success: true, data: { id: docRef.id, ...favoriteData } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: favorites });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const docRef = doc(db, "favorites", req.params.id);
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
