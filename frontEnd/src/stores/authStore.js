// src/stores/authStore.js
import { create } from "zustand";
import Axios from "../api/axiosInstance.js"; // Axios with token interceptor

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,

  // Login action
  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true");

    set({ user, token, isLoggedIn: true });
  },

  // Logout action
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");

    set({ user: null, token: null, isLoggedIn: false });
  },

  // Check authentication
  checkAuth: async () => {
    const token = get().token;

    // Don't call API if no token
    if (!token) {
      get().logout();
      return false;
    }

    try {
      // Axios already attaches the token via interceptor
      const res = await Axios.get("/api/auth/check-auth");

      if (res.data.success) {
        const user = res.data.user;
        set({ user, isLoggedIn: true });
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      } else {
        get().logout();
        return false;
      }
    } catch (error) {
      get().logout();
      return false;
    }
  },
}));

export default useAuthStore;
