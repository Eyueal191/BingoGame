import React from "react";
import useCardsStore from "../hooks/useCards";

const BingoCard = ({ card }) => {
  const { numbers: bingoNumbers = {}, reserved, _id, number } = card;
  const bingoHeader = ["B", "I", "N", "G", "O"];
  const { reserveCard, unreserveCard } = useCardsStore();

  return (
    <div className="relative border rounded-2xl p-5 shadow-md bg-white hover:shadow-lg transition-all">

      {/* --- STATUS BADGE --- */}
      <div
        className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm 
        ${reserved ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
      >
        {reserved ? "Reserved" : "Available"}
      </div>

      {/* --- CARD NUMBER AT TOP RIGHT --- */}
      <div className="absolute top-3 right-3 text-xs font-bold text-neutral-500">
        #{number}
      </div>

      {/* --- HEADER BINGO LETTERS --- */}
      <div className="grid grid-cols-5 gap-x-2 mb-4 mt-8 text-center font-extrabold text-xl md:text-2xl tracking-wider text-neutral-700">
        {bingoHeader.map((letter, idx) => (
          <div
            key={letter}
            className={`drop-shadow-sm flex items-center justify-center h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full
            ${idx % 2 === 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* --- BINGO NUMBERS GRID --- */}
      <div className="grid grid-cols-5 gap-2">
        {bingoHeader.map((col) => (
          <div key={col} className="flex flex-col space-y-1">
            {bingoNumbers[col]?.map((num, idx) => {
              if (col === "N" && idx === 2) {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16
                    font-semibold text-sm md:text-lg text-white rounded-xl bg-green-600 shadow-sm"
                  >
                    FREE
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-center h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 
                  font-semibold text-sm md:text-lg rounded-xl ring-1 ring-gray-300 
                  ${col === "B" || col === "G"
                      ? "bg-green-50 text-green-700"
                      : col === "I" || col === "O"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-white text-gray-700"}`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* --- RESERVE / UNRESERVE BUTTONS --- */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => reserveCard(_id)}
          disabled={reserved}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm md:text-base transition-all 
            shadow-sm ${reserved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          {reserved ? "Already Reserved" : "Reserve Card"}
        </button>

        <button
          onClick={() => unreserveCard(_id)}
          disabled={!reserved}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm md:text-base transition-all 
            shadow-sm ${!reserved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"}`}
        >
          Unreserve
        </button>
      </div>

    </div>
  );
};

export default BingoCard;
