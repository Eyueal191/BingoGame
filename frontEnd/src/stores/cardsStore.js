import { create } from "zustand";
import socket from "../services/socket.js";

const cardStore = create((set, get) => ({
  cards: [],
  loading: true,
  reservedcardCount: 0,

  // Attach socket listeners
  attachListeners: () => {
    console.log("[STORE] Attaching socket listeners...");

    socket.emit("get_all_cards");
    socket.emit("get_reserved_count");

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

    socket.off("unreserve_failed").on("unreserve_failed", (data) => {
      console.warn("[STORE] Unreserve failed:", data.message);
    });

    socket.off("reserved_count").on("reserved_count", ({ reservedCount }) => {
      console.log("[STORE] Received reserved_count:", reservedCount);
      set({ reservedcardCount: reservedCount });
    });

    // Listen to server confirmation of reset
    socket.off("reseted").on("reseted", () => {
      console.log("[STORE] Reset confirmed from server");

      // Reset local store state
      set({
        cards: get().cards.map((c) => ({ ...c, reserved: false, reservedBy: null })),
        reservedcardCount: 0,
      });
    });
  },

  // Reserve a card
  reserveCard: ({ cardId, user }) => {
    socket.emit("reserve_card", { cardId, userId: user._id });
  },

  // Unreserve a card
  unreserveCard: ({ cardId, user }) => {
    socket.emit("unreserve_card", { cardId, userId: user._id });
  },

  // Reset all reservations
  resetReservations: () => {
    socket.emit("reset_reservation");
    // UI state will reset when "reseted" event is received
  },

  // Fetch all cards manually
  getAllCards: () => {
    socket.emit("get_all_cards");
  },

  // Cleanup socket listeners
  cleanup: () => {
    socket.off("all_cards");
    socket.off("card_reserved");
    socket.off("reservation_failed");
    socket.off("unreserve_failed");
    socket.off("reserved_count");
    socket.off("reseted");
  },
}));

export default cardStore;
