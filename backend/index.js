import http from "node:http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import socketLoader from "./src/sockets/index.js";
import { dynamicCorsOptions } from "./src/utils/corsConfig.js";

dotenv.config();

const httpServer = http.createServer(app);

//
// --------------------------
// EXPRESS – Dynamic CORS
// --------------------------
app.use(
  cors(dynamicCorsOptions(),
)
);
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204); // respond to preflight
  }
  next();
});
//
// --------------------------
// SOCKET.IO – Dynamic CORS
// --------------------------
const io = new Server(httpServer, {
  cors: dynamicCorsOptions(["GET", "POST"]),
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
