// src/components/BingoCard.jsx
import React from "react";
import useCardsStore from "../hooks/useCards";
import useAuthStore from "../stores/authStore";

const BingoCard = ({ card }) => {
  const { numbers: bingoNumbers = {}, reserved, _id, number } = card;
  const bingoHeader = ["B", "I", "N", "G", "O"];
  const { reserveCard, unreserveCard } = useCardsStore();
  const { user } = useAuthStore();

  if (!user) return null; // prevent errors if user is not logged in

  return (
    <div className="relative border rounded-3xl p-5 md:p-6 lg:p-8 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 w-full max-w-sm mx-auto">

      {/* --- STATUS BADGE --- */}
      <div
        className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm 
        ${reserved ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
      >
        {reserved ? "Reserved" : "Available"}
      </div>

      {/* --- CARD NUMBER AT TOP RIGHT (Updated) --- */}
      <div className="absolute top-3 right-3 text-sm md:text-base lg:text-lg font-extrabold text-white bg-green-600 px-3 py-1 rounded-xl shadow-lg">
        #{number}
      </div>

      {/* --- HEADER BINGO LETTERS --- */}
      <div className="grid grid-cols-5 gap-2 mb-4 mt-10 text-center font-extrabold text-lg sm:text-xl md:text-2xl tracking-wider text-gray-700">
        {bingoHeader.map((letter, idx) => (
          <div
            key={letter}
            className={`flex items-center justify-center aspect-square rounded-full
              text-base sm:text-lg md:text-xl lg:text-2xl drop-shadow-sm
              ${idx % 2 === 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* --- BINGO NUMBERS GRID --- */}
      <div className="grid grid-cols-5 gap-2">
        {bingoHeader.map((col) => (
          <div key={col} className="flex flex-col gap-2">
            {bingoNumbers[col]?.map((num, idx) => {
              const isFreeSpace = col === "N" && idx === 2;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-center aspect-square
                  font-semibold text-sm sm:text-base md:text-lg rounded-xl ring-1 ring-gray-300
                  transition-all duration-200
                  ${isFreeSpace
                    ? "bg-green-600 text-white shadow-inner"
                    : col === "B" || col === "G"
                    ? "bg-green-50 text-green-700"
                    : col === "I" || col === "O"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-white text-gray-700"} 
                  hover:shadow-lg hover:-translate-y-0.5 active:scale-95`}
                >
                  {isFreeSpace ? "FREE" : num}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* --- RESERVE / UNRESERVE BUTTONS --- */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => reserveCard({ cardId: _id, user })}
          disabled={reserved}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200
            shadow-md ${reserved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white hover:scale-105 hover:shadow-lg"
            }`}
        >
          {reserved ? "Already Reserved" : "Reserve Card"}
        </button>

        <button
          onClick={() => unreserveCard({ cardId: _id, user })}
          disabled={!reserved}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200
            shadow-md ${!reserved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:scale-105 hover:shadow-lg"
            }`}
        >
          Unreserve
        </button>
      </div>
    </div>
  );
};
export default BingoCard;
