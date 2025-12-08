import { create } from "zustand";
import socket from "../services/socket.js";

const cardStore = create((set, get) => ({
  cards: [],
  loading: true,

  // Attach socket listeners
  attachListeners: () => {
    console.log("[STORE] Attaching socket listeners...");

    socket.emit("get_all_cards");

    socket.off("all_cards").on("all_cards", (cards) => {
      console.log("[STORE] Received all_cards:", cards.length);
      set({ cards, loading: false });
    });

    socket.off("card_reserved").on("card_reserved", (updatedCard) => {
      set({
        cards: get().cards.map((c) =>
          c._id === updatedCard._id ? updatedCard : c
        ),
      });
    });

    socket.off("reservation_failed").on("reservation_failed", (data) => {
      console.warn("[STORE] Reservation failed:", data.message);
    });
  },

  // Reserve a card (handles userId internally)
  reserveCard: (cardId) => {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) return console.error("[STORE] No user in localStorage");

    const user = JSON.parse(userJSON);
    if (!user._id) return console.error("[STORE] Invalid user data");

    socket.emit("reserve_card", { cardId, userId: user._id });
  },

  // Fetch all cards manually if needed
  getAllCards: () => {
    socket.emit("get_all_cards");
  },

  // Cleanup socket listeners
  cleanup: () => {
    socket.off("all_cards");
    socket.off("card_reserved");
    socket.off("reservation_failed");
  },
}));

export default cardStore;
