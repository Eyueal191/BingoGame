// src/utils/corsConfig.js
export function dynamicCorsOptions(allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / server-to-server
      console.log("🌍 CORS request from:", origin);
      callback(null, true); // allow all origins dynamically
    },
    credentials: true, // allows cookies / auth headers
    methods: allowedMethods, // use the passed methods
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
