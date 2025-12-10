import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  groupCalledNumbers,
  extractMarkedValues,
  validateBingoCard,
  areMarkedNumbersCalled
} from "../utils/validators.js";

const winChecker = (marked, calledNumbers) => {
  const markedValues = extractMarkedValues(marked);
  const calledNumbersGrouped = groupCalledNumbers(calledNumbers);

  const isMarkedCalled = areMarkedNumbersCalled(markedValues, calledNumbersGrouped);
  if (!isMarkedCalled) {
    toast.error("No, you are not a winner yet.");
    return;
  }

  const patternMatch = validateBingoCard(marked);
  if (patternMatch) {
    toast.success("Congrats! You won the game!");
  } else {
    toast.info("No winning pattern yet.");
  }
};

function PlayCard({ card, calledNumbers = [] }) {
  const { numbers: bingoNumbers = {} } = card;
  const bingoHeader = ["B", "I", "N", "G", "O"];

  // FIXED: FREE SPACE NOW HAS isFree: true
  const [marked, setMarked] = useState({
    B: bingoNumbers.B?.map((num, row) => ({
      value: num,
      row,
      col: 0,
      marked: false,
      isFree: false
    })) || [],
    I: bingoNumbers.I?.map((num, row) => ({
      value: num,
      row,
      col: 1,
      marked: false,
      isFree: false
    })) || [],
    N: bingoNumbers.N?.map((num, row) => ({
      value: num,
      row,
      col: 2,
      marked: row === 2,    // middle one marked
      isFree: row === 2     // FREE space flagged
    })) || [],
    G: bingoNumbers.G?.map((num, row) => ({
      value: num,
      row,
      col: 3,
      marked: false,
      isFree: false
    })) || [],
    O: bingoNumbers.O?.map((num, row) => ({
      value: num,
      row,
      col: 4,
      marked: false,
      isFree: false
    })) || []
  });

  const toggleMark = (col, idx) => {
    setMarked((prev) => ({
      ...prev,
      [col]: prev[col].map((cell, i) =>
        i === idx ? { ...cell, marked: !cell.marked } : cell
      )
    }));
  };

  return (
    <div className="border border-gray-300 rounded-xl p-8 shadow-lg bg-white max-w-xl mx-auto w-full">
      
      {/* BINGO Header */}
      <div className="grid grid-cols-5 text-center font-bold text-lg text-gray-800 mb-4">
        {bingoHeader.map((letter) => (
          <div key={letter} className="p-2">
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
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
                    ${
                      isMarked
                        ? "bg-blue-600 text-white shadow-inner"
                        : "bg-white text-gray-700 hover:bg-blue-100"
                    }
                  `}
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
  onClick={() => winChecker(marked, calledNumbers)}
  className="
    px-12 py-4 
    bg-[#0A2A66] text-[#FFD400] 
    text-xl font-bold
    rounded-lg
    border-2 border-transparent
    shadow-md
    hover:border-yellow-400 hover:shadow-lg hover:scale-105 hover:brightness-110
    focus:outline-none focus:ring-4 focus:ring-yellow-300
    active:scale-95
    transition-all duration-300 ease-in-out
    transform
    animate-pulseSide
  "
>
  Claim Bingo
</button>

      </div>
    </div>
  );
}

export default PlayCard;
