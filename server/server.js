import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB (skipped on Vercel functions auto-load)
if (process.env.NODE_ENV !== "production") {
  connectDB();
}

// ✅ Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("✅ BG Removal API is working"));

const PORT = process.env.PORT || 4000;

// ✅ Local Server only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app; // ✅ Needed for Vercel
