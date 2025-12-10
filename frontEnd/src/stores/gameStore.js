import socket from "../services/socket";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGameStore = create(
  persist(
    (set, get) => ({
      numbers: [],

      attachListeners: () => {
        console.log("store Attaching listeners...");

        socket
          .off("numbers")
          .on("numbers", (numbers) => {
            console.log("Store numbers received:", numbers);
            set({ numbers });
          });
      },

      detachListeners: () => {
        console.log("client Detaching socket listener...");
        socket.off("numbers");
      },

      startGame: () => {
        console.log("client send game_start_event");
        socket.emit("game_start");
      },
    }),
    {
      name: "game-storage", // unique key for localStorage
      getStorage: () => localStorage, // defaults to localStorage
      partialize: (state) => ({ numbers: state.numbers }), // only persist numbers
    }
  )
);

export default useGameStore;
