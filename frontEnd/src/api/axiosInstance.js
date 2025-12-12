// src/api/axiosInstance.js
import axios from "axios";
const Axios = axios.create({
  baseURL:"http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
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
