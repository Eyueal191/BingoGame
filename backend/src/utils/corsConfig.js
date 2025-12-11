// src/utils/corsConfig.js
export function dynamicCorsOptions(allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
  return {
    // (origin, callback) => {
    //   if (!origin) return callback(null, true); // allow Postman / server-to-server
    //   console.log("🌍 CORS request from:", origin);
    //   callback(null, true); // allow all origins dynamically
    // }
    origin: ["http://localhost:4173","http://localhost:5173"],
    credentials: true, // allows cookies / auth headers
    methods: allowedMethods, // use the passed methods
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
