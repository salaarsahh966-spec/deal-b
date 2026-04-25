import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./backend/routes/api.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Basic route
  app.get("/", (req, res) => {
    res.send("Backend working again 🚀");
  });

  // API Routes
  app.use("/api", apiRoutes);

  app.get("/api/health", async (req, res) => {
    try {
      const { dbAdmin } = await import("./backend/lib/firebase-admin.ts");
      const { getDocs, collection } = await import("firebase/firestore");
      // Just try to get one doc from 'offers' or any collection
      await getDocs(collection(dbAdmin, "offers"));
      res.json({ 
        status: "ok", 
        database: "connected"
      });
    } catch (error: any) {
      console.error("Health check failed:", error);
      res.status(500).json({ 
        status: "error", 
        message: error.message,
        code: error.code,
        details: error.details
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
