import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";

// Create Express App
const app = express();

// Connect to MongoDB (only once, not per request)
await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("API is working"));

// ✅ Export Express app instead of listening
export default app;
