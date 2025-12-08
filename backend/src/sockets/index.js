// src/sockets/index.js
import cardSocket from "./cardSocket.js";

export default function socketLoader(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);

    // Load ONLY the card socket logic for Step-2
    cardSocket(io, socket);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
}
