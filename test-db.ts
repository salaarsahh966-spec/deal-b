import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

async function test() {
  console.log("Testing Firestore connection...");
  console.log("Project:", firebaseConfig.projectId);
  console.log("Database:", firebaseConfig.firestoreDatabaseId);

  try {
    const app = admin.initializeApp();
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    
    console.log("Attempting to list collections in (default) database...");
    const collections = await db.listCollections();
    console.log("Success! Collections found:", collections.length);
  } catch (error: any) {
    console.error("Test failed!");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    if (error.details) console.error("Details:", error.details);
  }
}

test();
