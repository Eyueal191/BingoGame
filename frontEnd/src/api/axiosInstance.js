// src/api/axiosInstance.js
import axios from "axios";
import  authStore  from "../stores/authStore.js"; // use store directly

const Axios = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
Axios.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token; // get token from store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
