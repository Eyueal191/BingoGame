import { io } from "socket.io-client";

const SOCKET_URL = "https://bingogame-5pg5.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

/**
 * Connect socket
 * Can be called anytime (e.g., after login)
 */
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    socket.removeAllListeners();
  }
};

// Socket event logs
socket.on("connect", () => console.log("[SOCKET] Connected:", socket.id));
socket.on("disconnect", (reason) =>
  console.log("[SOCKET] Disconnected:", reason)
);
socket.on("connect_error", (err) =>
  console.error("[SOCKET] Connect error:", err.message)
);

export default socket;
