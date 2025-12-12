import http from "node:http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import socketLoader from "./src/sockets/index.js";

dotenv.config();

// Create HTTP server
const httpServer = http.createServer(app);

// --------------------------
// SOCKET.IO – Dynamic CORS
// --------------------------
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      // Log origin for debugging
      console.log("🌍 Socket.io CORS request from:", origin);

      // Allow all origins dynamically (or restrict to an array)
      return callback(null, true);
    },
    credentials: true, // allow cookies and auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Load all socket event handlers
socketLoader(io);

// --------------------------
// START SERVER
// --------------------------
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
