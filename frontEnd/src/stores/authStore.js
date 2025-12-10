// src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Axios from "../api/axiosInstance.js"; // Axios with token interceptor

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      // Login action
      login: (user, token) => {
        set({ user, token, isLoggedIn: true });
      },

      // Logout action
      logout: () => {
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
          // Axios automatically attaches the token via interceptor
          const res = await Axios.get("/api/auth/check-auth");

          if (res.data.success) {
            const user = res.data.user;
            set({ user, isLoggedIn: true });
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
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      getStorage: () => localStorage, // you can also use sessionStorage if needed
      partialize: (state) => ({ user: state.user, token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
);

export default useAuthStore;
