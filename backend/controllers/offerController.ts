import { Response } from "express";
import admin from "firebase-admin";
import { dbAdmin } from "../lib/firebase-admin";
import { AuthRequest } from "../middleware/auth";
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await dbAdmin.collection("offers").add(offerData);
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
        
        const querySnapshot = await dbAdmin.collection("offers").get();
        const offers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        const filtered = offers.filter(offer => {
            const distanceInM = distanceBetween([offer.lat, offer.lng], center) * 1000;
            return distanceInM <= radiusInM;
        });
        
        return res.json({ success: true, data: filtered });
    }

    const querySnapshot = await dbAdmin.collection("offers").get();
    const offers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackView = async (req: AuthRequest, res: Response) => {
    try {
        const docRef = dbAdmin.collection("offers").doc(req.params.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const currentViews = (docSnap.data() as any).viewsCount || 0;
            await docRef.update({ viewsCount: currentViews + 1 });
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Offer not found" });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
