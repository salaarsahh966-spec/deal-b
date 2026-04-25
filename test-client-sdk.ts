import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

async function test() {
  console.log("Testing Firestore CLIENT SDK connection...");
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    
    console.log("Attempting to get documents from 'offers'...");
    const querySnapshot = await getDocs(collection(db, "offers"));
    console.log("Success! Documents found:", querySnapshot.size);
  } catch (error: any) {
    console.error("Test failed!");
    console.error("Error Message:", error.message);
  }
}

test();
