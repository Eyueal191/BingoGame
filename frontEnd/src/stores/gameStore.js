import socket from "../services/socket";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const GameStore = create(
  persist(
    (set, get) => ({
      numbers: [],          // Bingo numbers for the game
      gameSession: null,    // Current game session
      winnerName: "X",     // Winner's name after game reset

      /** -----------------------------
       * Attach socket listeners
       * ----------------------------- */
      attachListeners: () => {
        console.log("[STORE] Attaching socket listeners...");

        socket.off("numbers").on("numbers", (numbers) => {
          console.log("[STORE] Numbers received:", numbers);
          set({ numbers });
        });

        socket.off("gameSession").on("gameSession", (gameSession) => {
          console.log("[STORE] Game session received:", gameSession);
          set({ gameSession });
        });

        socket.off("winner").on("winner", (winnerName) => {
          console.log("[STORE] Winner received:", winnerName);
          set((state) => ({
            gameSession: state.gameSession
              ? { ...state.gameSession, winner: winnerName }
              : null,
            winnerName, // store winner separately if needed
          }));
        });

        socket.off("game_reset_done").on("game_reset_done", () => {
          console.log("[STORE] Game reset done received");
          set({ numbers: [], gameSession: null, winnerName: null });
        });
      },

      /** -----------------------------
       * Detach socket listeners
       * ----------------------------- */
      detachListeners: () => {
        console.log("[STORE] Detaching socket listeners...");
        ["numbers", "gameSession", "winner", "game_reset_done"].forEach(
          (event) => socket.off(event)
        );
      },

      /** -----------------------------
       * Start a new game
       * ----------------------------- */
      startGame: () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return console.error("[STORE] No userId found!");
        console.log("[STORE] Emitting game_start with userId:", userId);
        socket.emit("game_start", { userId });
        console.log("[STORE] Waiting for numbers and gameSession from server...");
      },

      /** -----------------------------
       * Reset game
       * ----------------------------- */
      resetGame: (userId) => {
        const { gameSession } = get();
        if (!userId) return console.error("[STORE] Cannot reset game: No userId");
        if (!gameSession?._id) return console.error("[STORE] Cannot reset game: No gameSession");

        console.log("[STORE] Emitting game_reset with userId:", userId);
        socket.emit("game_reset", {
          userId,
          gameSessionData: gameSession,
        });
      },

      /** -----------------------------
       * Update game session
       * ----------------------------- */
      updateGameSession: (updatedSession) => {
        set({ gameSession: updatedSession });
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        if (!updatedSession?._id) return console.error("[STORE] Cannot update gameSession: Missing _id");

        socket.emit("update_gameSession", {
          userId,
          gameSessionData: updatedSession,
        });
        console.log("[STORE] Game session sent to server:", updatedSession);
      },
    }),
    {
      name: "game-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        numbers: state.numbers,
        gameSession: state.gameSession,
        winnerName: state.winnerName,
      }),
    }
  )
);

export default GameStore;
