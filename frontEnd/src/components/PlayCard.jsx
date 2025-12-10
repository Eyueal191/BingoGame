import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useGameStore from "../hooks/useGame.js";
import useCardStore from "../hooks/useCards.js";
import useAuthStore from "../stores/authStore.js";
import {
  groupCalledNumbers,
  extractMarkedValues,
  validateBingoCard,
  areMarkedNumbersCalled,
} from "../utils/validators.js";

function PlayCard({ card, calledNumbers = [] }) {
  const { gameSession, updateGameSession, resetGame } = useGameStore();
  const { numbers: bingoNumbers = {} } = card;
  const { user } = useAuthStore();
  const { resetReservations,  reservedcardCount} = useCardStore();
  const userId = user?._id;
  const bingoHeader = ["B", "I", "N", "G", "O"];
  const navigate = useNavigate();

  const [marked, setMarked] = useState({
    B: bingoNumbers.B?.map((num, row) => ({ value: num, row, col: 0, marked: false, isFree: false })) || [],
    I: bingoNumbers.I?.map((num, row) => ({ value: num, row, col: 1, marked: false, isFree: false })) || [],
    N: bingoNumbers.N?.map((num, row) => ({ value: num, row, col: 2, marked: row === 2, isFree: row === 2 })) || [],
    G: bingoNumbers.G?.map((num, row) => ({ value: num, row, col: 3, marked: false, isFree: false })) || [],
    O: bingoNumbers.O?.map((num, row) => ({ value: num, row, col: 4, marked: false, isFree: false })) || [],
  });

  // Toggle mark on a cell
  const toggleMark = (col, idx) => {
    setMarked((prev) => ({
      ...prev,
      [col]: prev[col].map((cell, i) => (i === idx ? { ...cell, marked: !cell.marked } : cell)),
    }));
  };

  // Handle Bingo claim
  const claimBingo = async () => {
    if (!gameSession) {
      toast.error("Cannot claim bingo: game not started");
      return;
    }

    const markedValues = extractMarkedValues(marked);
    const calledNumbersGrouped = groupCalledNumbers(calledNumbers);

    // Check if all marked numbers were called
    if (!areMarkedNumbersCalled(markedValues, calledNumbersGrouped)) {
      toast.error("No, you are not a winner yet.");
      return;
    }

    // Check winning pattern
    const patternMatch = validateBingoCard(marked);
    if (!patternMatch) {
  
      toast.info("No winning pattern yet.");
      return;
    }

    // ✅ Update game session in store
    const updatedSession = { ...gameSession, endTime: new Date(), winner: userId };
    updateGameSession(updatedSession);

    // ✅ Reset game and reservations using existing stores
    await resetGame(userId);       // triggers game_reset socket event
    await resetReservations();      // triggers reset_reservation socket event
    
    // ✅ Navigate after reset
    navigate("/winner");

    toast.success("Bingo! You are the winner!");
  };
useEffect(()=>{
  localStorage.setItem("playerCount", reservedcardCount);
})
  if (!userId) return <h1>UserId is not defined.</h1>;

  return (
    <div className="border border-gray-300 rounded-xl p-8 shadow-lg bg-white max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="grid grid-cols-5 text-center font-bold text-lg text-gray-800 mb-4">
        {bingoHeader.map((letter) => (
          <div key={letter} className="p-2">{letter}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3">
        {bingoHeader.map((col) => (
          <div key={col} className="flex flex-col gap-3">
            {marked[col]?.map((cell, idx) => {
              const isMarked = cell.marked || cell.isFree;
              return (
                <div
                  key={idx}
                  onClick={() => !cell.isFree && toggleMark(col, idx)}
                  className={`flex items-center justify-center h-14 w-14 md:h-16 md:w-16
                    text-md md:text-lg font-semibold border border-gray-300 rounded
                    cursor-pointer transition-all duration-150
                    ${isMarked ? "bg-blue-600 text-white shadow-inner" : "bg-white text-gray-700 hover:bg-blue-100"}`}
                >
                  {cell.isFree ? "Free" : cell.value}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Claim Bingo Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={claimBingo}
          className="px-12 py-4 bg-[#0A2A66] text-[#FFD400] text-xl font-bold rounded-lg border-2 border-transparent shadow-md hover:border-yellow-400 hover:shadow-lg hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-yellow-300 active:scale-95 transition-all duration-300 animate-pulseSide"
        >
          Claim Bingo
        </button>
      </div>
    </div>
  );
}

export default PlayCard;
