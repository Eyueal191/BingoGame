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
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow requests without origin (e.g. Postman)
      console.log("🌍 CORS request from:", origin); // optional, for debugging
      return callback(null, true); // dynamically allow all origins
    },
    credentials: true, // ✅ enables cookies, tokens, etc.
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); 
// Middleware to parse JSON requests
app.use(express.json());
// Auth routes
app.use("/api/auth", authRoutes);
// Optional: Minimal health check route
app.get("/", (req, res) => {
  res.send("Backend is running");
});
export default app;
