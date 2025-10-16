import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // ✅ Import dotenv
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./configs/mongodb.js";

dotenv.config(); // ✅ Load .env variables before using them

const app = express();
app.use(cors());

// Normal JSON parsing for most routes
app.use(express.json());

// Raw body for Clerk webhooks
app.use("/api/users/webhook", express.raw({ type: "application/json" }));

// Routes
app.use("/api/users", userRoutes);

// Connect to MongoDB
connectDB();

// Root route
app.get("/", (req, res) => res.send("✅ BG Removal API is working"));

// Only listen in local development (Vercel handles serverless)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;
