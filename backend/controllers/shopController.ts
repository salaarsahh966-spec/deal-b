import { Response } from "express";
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { dbAdmin as db } from "../lib/firebase-admin.ts";
import { AuthRequest } from "../middleware/auth.ts";
import { geohashForLocation } from "geofire-common";

export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, address, lat, lng } = req.body;
    const ownerId = req.user?.userId;

    if (!ownerId) throw new Error("Unauthorized");

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const geohashValue = geohashForLocation([latitude, longitude]);

    const shopData = {
      ownerId,
      name,
      description,
      address,
      lat: latitude,
      lng: longitude,
      geohash: geohashValue,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "shops"), shopData);
    res.json({ success: true, data: { id: docRef.id, ...shopData } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShops = async (req: AuthRequest, res: Response) => {
  try {
    const querySnapshot = await getDocs(collection(db, "shops"));
    const shops = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: shops });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShopById = async (req: AuthRequest, res: Response) => {
  try {
    const docRef = doc(db, "shops", req.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.json({ success: true, data: { id: docSnap.id, ...docSnap.data() } });
    } else {
      res.status(404).json({ success: false, message: "Shop not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
