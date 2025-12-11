import http from "node:http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import socketLoader from "./src/sockets/index.js";

dotenv.config();

const httpServer = http.createServer(app);

// Exact frontend origin for CORS
const FRONTEND_URL = process.env.FRONTEND_URL

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL, // must match frontend exactly
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // allow polling fallback
  allowEIO3: true,                      // ensures compatibility
});

// Load socket modules
socketLoader(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
