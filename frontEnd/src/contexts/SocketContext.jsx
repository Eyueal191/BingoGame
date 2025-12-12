import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://bingogame-5pg5.onrender.com";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);
  const [cards, setCards] = useState([]);
  const [reservedcardCount, setReservedCardCount] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gameSession, setGameSession] = useState(null); // ✅ track current session

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setSocketReady(true));
    socket.on("disconnect", () => setSocketReady(false));

    // Cards
    socket.on("all_cards", (cardsData) => {
      setCards(cardsData);
      setReservedCardCount(cardsData.filter((c) => c.reserved).length);
    });

    socket.on("card_reserved", (updatedCard) => {
      setCards((prev) =>
        prev.map((c) => (c._id === updatedCard._id ? { ...c, reserved: updatedCard.reserved } : c))
      );

      setReservedCardCount(
        cards.filter((c) =>
          c._id === updatedCard._id ? updatedCard.reserved : c.reserved
        ).filter(Boolean).length
      );
    });

    socket.on("reserved_count", ({ reservedCount }) => setReservedCardCount(reservedCount));

    // Game numbers
    socket.on("numbers", (numbersData) => setNumbers(numbersData));

    // Winner
    socket.on("winner", (winnerData) => setWinner(winnerData));

    // ✅ Listen to correct backend event
    socket.on("gameSession", (session) => {
      console.log("[SOCKET] gameSession received:", session);
      setGameSession(session);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = (event, data) => socketRef.current?.emit(event, data);

  // Actions
  const reserveCard = ({ cardId, userId }) => emit("reserve_card", { cardId, userId });
  const unreserveCard = ({ cardId, userId }) => emit("unreserve_card", { cardId, userId });
  const getAllCards = () => emit("get_all_cards");
  const resetReservations = () => emit("reset_reservation");

  const startGame = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return console.error("No userId found!");
    emit("game_start", { userId });

    // ✅ set a temporary local session to avoid "game not started" race
    setGameSession({ _id: "temp-session", startTime: new Date() });
  };

  const resetGame = (gameSessionData) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !gameSessionData?._id) return console.error("Cannot reset game");
    emit("game_reset", { userId, gameSessionData });
    setGameSession(null);
  };

  const updateGameSession = (updatedSession) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !updatedSession?._id) return;
    emit("update_gameSession", { userId, gameSessionData: updatedSession });
    setGameSession(updatedSession); // ✅ update local session immediately
  };

  return (
    <SocketContext.Provider
      value={{
        socketReady,
        cards,
        reservedcardCount,
        numbers,
        winner,
        gameSession, // ✅ expose session
        reserveCard,
        unreserveCard,
        getAllCards,
        resetReservations,
        startGame,
        resetGame,
        updateGameSession,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
