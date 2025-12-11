import http from "node:http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import socketLoader from "./src/sockets/index.js";

dotenv.config();

const httpServer = http.createServer(app);

//
// --------------------------
// EXPRESS – Dynamic CORS
// --------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / server-to-server
      console.log("🌍 CORS request from:", origin);
      callback(null, true); // dynamically allow all
    },
    credentials: true, // allows cookies / auth headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//
// --------------------------
// SOCKET.IO – Dynamic CORS
// --------------------------
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow tools like Postman
      console.log("🔌 Socket request from:", origin);
      return callback(null, true); // allow all domains dynamically
    },
    credentials: true, // allows auth headers through WebSocket
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// load socket event handlers
socketLoader(io);

//
// --------------------------
// START SERVER
// --------------------------
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
