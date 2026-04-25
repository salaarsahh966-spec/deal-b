import express from "express";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signup, login, me } from "../controllers/authController.ts";
import { getShops, createShop, getShopById } from "../controllers/shopController.ts";
import { getOffers, createOffer, trackView } from "../controllers/offerController.ts";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController.ts";
import { authenticateToken } from "../middleware/auth.ts";
import { dbAdmin as db } from "../lib/firebase-admin.ts";
import { geohashForLocation } from "geofire-common";

const router = express.Router();

// Seed Route (for demo)
router.post("/seed", async (req, res) => {
    try {
        const dummyOffers = [
            { title: "Summer Sale: 50% Off Sneakers", description: "All premium sneakers are now at half price. Valid for 3 days only!", price: 45, originalPrice: 90, lat: 40.7128, lng: -74.0060 },
            { title: "Buy 1 Get 1 Free: Artisan Coffee", description: "Start your morning with our specialty roasted beans. Neighborhood favorite!", price: 4, originalPrice: 8, lat: 40.7138, lng: -74.0070 },
            { title: "Gourmet Pizza Night", description: "Large wood-fired pizzas at 30% off every Tuesday and Wednesday.", price: 14, originalPrice: 20, lat: 40.7108, lng: -74.0050 },
            { title: "Tech Clearance: Smart Home Kit", description: "Upgrade your home with our discounted starter packs.", price: 99, originalPrice: 150, lat: 40.7158, lng: -74.0080 },
        ];

        for (const off of dummyOffers) {
            const geohash = geohashForLocation([off.lat, off.lng]);
            await addDoc(collection(db, "offers"), {
                ...off,
                discount: Math.round(((off.originalPrice - off.price) / off.originalPrice) * 100),
                geohash,
                viewsCount: Math.floor(Math.random() * 500),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
        res.json({ success: true, message: "Seeded 4 offers" });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Auth
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/me", authenticateToken, me);

// Shops
router.get("/shops", getShops);
router.get("/shops/:id", getShopById);
router.post("/shops", authenticateToken, createShop);

// Offers - Hardcoded as requested
router.get("/offers", (req, res) => {
  res.json([
    { id: 1, title: "50% off Pizza", shop: "Pizza Hub" }
  ]);
});
// router.get("/offers", getOffers); // Original real route
router.post("/offers", authenticateToken, createOffer);
router.post("/offers/:id/view", trackView);

// Favorites
router.get("/favorites", authenticateToken, getFavorites);
router.post("/favorites", authenticateToken, addFavorite);
router.delete("/favorites/:id", authenticateToken, removeFavorite);

export default router;
