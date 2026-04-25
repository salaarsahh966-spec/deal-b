import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

export const dbAdmin = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const authAdmin = getAuth(app);
