import { Response } from "express";
import admin from "firebase-admin";
import { dbAdmin } from "../lib/firebase-admin.ts";
import { AuthRequest } from "../middleware/auth.ts";

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { offerId } = req.body;
    const userId = req.user?.userId;

    if (!userId) throw new Error("Unauthorized");

    const favoriteData = {
      userId,
      offerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await dbAdmin.collection("favorites").add(favoriteData);
    res.json({ success: true, data: { id: docRef.id, ...favoriteData } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    const querySnapshot = await dbAdmin.collection("favorites").where("userId", "==", userId).get();
    const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: favorites });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const docRef = dbAdmin.collection("favorites").doc(req.params.id);
    await docRef.delete();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
