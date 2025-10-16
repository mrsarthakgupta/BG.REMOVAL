import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./configs/mongodb.js";

dotenv.config();

const app = express();
app.use(cors());

// ✅ Root route for testing
app.get("/", (req, res) => res.send("✅ BG Removal API is working"));

// ✅ Normal JSON parsing for normal routes
app.use(express.json());

// ✅ Raw body parser ONLY for Clerk webhook route
app.post("/api/users/webhook", express.raw({ type: "application/json" }), userRoutes);

connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;
