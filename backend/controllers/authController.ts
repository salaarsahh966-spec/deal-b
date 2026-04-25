import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { dbAdmin as db } from "../lib/firebase-admin.ts";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userData = {
      email,
      passwordHash,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "users"), userData);
    
    const token = jwt.sign({ userId: docRef.id, email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, data: { token, userId: docRef.id, email } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userDoc.id, email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, data: { token, userId: userDoc.id, email } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req: any, res: Response) => {
    res.json({ success: true, data: req.user });
};
