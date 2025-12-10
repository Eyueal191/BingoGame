// src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Axios from "../api/axiosInstance.js";
import { connectSocket, disconnectSocket } from "../services/socket";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      /** ---------------------------
       * Login action
       * --------------------------- */
      login: (user, token) => {
        set({ user, token, isLoggedIn: true });

        // Connect socket after login (no socket.auth needed)
        connectSocket();
        console.log("[AUTH] Socket connected for user:", user?._id);
        localStorage.setItem("userId", user._id)
      },

      /** ---------------------------
       * Logout action
       * --------------------------- */
      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });

        // Disconnect socket on logout
        disconnectSocket();
        console.log("[AUTH] Socket disconnected on logout");
      },

      /** ---------------------------
       * Check authentication
       * --------------------------- */
      checkAuth: async () => {
        const token = get().token;

        if (!token) {
          get().logout();
          return false;
        }

        try {
          const res = await Axios.get("/api/auth/check-auth");

          if (res.data.success) {
            const user = res.data.user;
            set({ user, isLoggedIn: true });

            // Connect socket if not already connected
            if (!res.data.socketConnected) {
              connectSocket();
              console.log("[AUTH] Socket connected for user:", user?._id);
            }

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
      name: "auth-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
