import { create } from "zustand";
import socket from "../services/socket.js";

const cardStore = create((set, get) => ({
  cards: [],
  loading: true,
  reservedcardCount: null,

  // Attach socket listeners
  attachListeners: () => {
    console.log("[STORE] Attaching socket listeners...");

    socket.emit("get_all_cards");
    socket.emit("get_reserved_count");

    // ALL CARDS
    socket.off("all_cards").on("all_cards", (cards) => {
      console.log("[STORE] Received all_cards:", cards.length);
      set({ cards, loading: false });
    });

    // CARD RESERVED or UNRESERVED (same event updates UI)
    socket.off("card_reserved").on("card_reserved", (updatedCard) => {
      set({
        cards: get().cards.map((c) =>
          c._id === updatedCard._id ? updatedCard : c
        ),
      });
    });

    // RESERVATION FAILED
    socket.off("reservation_failed").on("reservation_failed", (data) => {
      console.warn("[STORE] Reservation failed:", data.message);
    });

    // UNRESERVE FAILED (NEW)
    socket.off("unreserve_failed").on("unreserve_failed", (data) => {
      console.warn("[STORE] Unreserve failed:", data.message);
    });

    // RESERVED COUNT
    socket.off("reserved_count").on("reserved_count", ({ reservedCount }) => {
      console.log("[STORE] Received reserved_count:", reservedCount);
      set({ reservedcardCount: reservedCount });
    });
  },

  // Reserve a card
  reserveCard: (cardId) => {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) return console.error("[STORE] No user in localStorage");

    const user = JSON.parse(userJSON);
    if (!user._id) return console.error("[STORE] Invalid user data");

    socket.emit("reserve_card", { cardId, userId: user._id });
  },

  // ⭐ NEW: Unreserve a card
  unreserveCard: (cardId) => {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) return console.error("[STORE] No user in localStorage");

    const user = JSON.parse(userJSON);
    if (!user._id) return console.error("[STORE] Invalid user data");

    socket.emit("unreserve_card", { cardId, userId: user._id });
  },

  // Reset all reservations
  resetReservations: () => {
    socket.emit("reset_reservation");
  },

  // Fetch all cards manually
  getAllCards: () => {
    socket.emit("get_all_cards");
  },

  // Cleanup
  cleanup: () => {
    socket.off("all_cards");
    socket.off("card_reserved");
    socket.off("reservation_failed");
    socket.off("unreserve_failed");
    socket.off("reserved_count");
  },
}));
export default cardStore;
