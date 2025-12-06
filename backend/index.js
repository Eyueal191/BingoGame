// server.js
import http from "node:http";
import app from "./src/app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create HTTP server from Express app
const httpServer = http.createServer(app);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
