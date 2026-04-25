import { Response } from "express";
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc
} from "firebase/firestore";
import { dbAdmin as db } from "../lib/firebase-admin.ts";
import { AuthRequest } from "../middleware/auth.ts";
import { distanceBetween, geohashForLocation } from "geofire-common";

export const createOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId, title, description, price, originalPrice, expiryDate, lat, lng } = req.body;
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const geohashValue = geohashForLocation([latitude, longitude]);

    const offerData = {
      shopId,
      title,
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      expiryDate: expiryDate || null,
      lat: latitude,
      lng: longitude,
      geohash: geohashValue,
      viewsCount: 0,
      clicksCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "offers"), offerData);
    res.json({ success: true, data: { id: docRef.id, ...offerData } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOffers = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, radiusKm } = req.query;
    
    if (lat && lng && radiusKm) {
        const center: [number, number] = [parseFloat(lat as string), parseFloat(lng as string)];
        const radiusInM = parseFloat(radiusKm as string) * 1000;
        
        const querySnapshot = await getDocs(collection(db, "offers"));
        const offers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        const filtered = offers.filter(offer => {
            const distanceInM = distanceBetween([offer.lat, offer.lng], center) * 1000;
            return distanceInM <= radiusInM;
        });
        
        return res.json({ success: true, data: filtered });
    }

    const querySnapshot = await getDocs(collection(db, "offers"));
    const offers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackView = async (req: AuthRequest, res: Response) => {
    try {
        const docRef = doc(db, "offers", req.params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const currentViews = (docSnap.data() as any).viewsCount || 0;
            await updateDoc(docRef, { viewsCount: currentViews + 1 });
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Offer not found" });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
