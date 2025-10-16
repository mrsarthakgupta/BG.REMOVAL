import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Connect DB lazily inside request or via middleware
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.get("/", (req, res) => res.send("API is working with DB"));

// ✅ Export (no app.listen)
export default app;
