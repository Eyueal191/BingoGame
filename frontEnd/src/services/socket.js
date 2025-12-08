import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// Connect socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Optional: disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    socket.removeAllListeners();
  }
};

socket.on("connect", () => console.log("[SOCKET] Connected:", socket.id));
socket.on("disconnect", (reason) => console.log("[SOCKET] Disconnected:", reason));
socket.on("connect_error", (err) => console.error("[SOCKET] Connect error:", err.message));

export default socket;
