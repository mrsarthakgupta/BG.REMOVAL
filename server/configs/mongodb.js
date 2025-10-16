import mongoose from "mongoose";

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) return; // ✅ Reuse existing connection

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`);
    isConnected = true;
    console.log("✅ Database Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};

export default connectDB;
