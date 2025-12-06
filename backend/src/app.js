// backend/src/app.js
import dotenv from "dotenv";
dotenv.config(); // MUST be at the top before using process.env
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
// Debug: check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
// Connect to MongoDB
connectDB();
// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173", // React frontend URL
  credentials: true, // allow cookies/auth headers if needed
}));
// Middleware to parse JSON requests
app.use(express.json());
// Auth routes
app.use("/api/auth", authRoutes);
// Optional: Minimal health check route
app.get("/", (req, res) => {
  res.send("Backend is running");
});
export default app;
