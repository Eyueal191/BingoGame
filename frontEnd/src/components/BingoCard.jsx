import React from "react";
import useCardsStore from "../hooks/useCards.js";
import { useNavigate } from "react-router-dom";
const BingoCard = ({ card }) => {
  const { _id, numbers: bingoGrid, reserved } = card;
  const { reserveCard } = useCardsStore();
  const navigate = useNavigate();
 const clickHandler = ()=>{
 if(reserved) return navigate("/card")
 }
  const handleReserve = () => {
    if (!reserved) {
      console.log("[CLIENT] Attempting to reserve card:", _id);
      reserveCard(_id);
    }
  };

  const bingoHeader = ["B", "I", "N", "G", "O"];

  const statusStyles = reserved
    ? "bg-[#F8D5D4] border-[#EB3939] text-[#EB3939]"
    : "bg-[#BEEEC3] border-[#3FD951] text-[#094710]";

  return (
    <div
      className={`relative border rounded-2xl p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        reserved ? "bg-gray-200" : "bg-white"
      }`}
      onClick={clickHandler}
    >
      {/* Status Badge */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 font-semibold text-sm border rounded-lg shadow-sm ${statusStyles}`}
      >
        {reserved ? "Reserved" : "Available"}
      </div>

      {/* Header BINGO */}
      <div className="grid grid-cols-5 gap-x-2 mb-4 mt-6 text-center font-extrabold text-xl tracking-wider text-neutral-700">
        {bingoHeader.map((letter, index) => (
          <div
            key={index}
            className="drop-shadow-sm"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
      <div className="flex flex-col gap-y-2">
        {bingoGrid.map((rowNumbers, rowIndex) => (
          <div key={rowIndex} className="flex justify-between gap-x-2">
            {rowNumbers.map((cellNumber, columnIndex) => (
              <div
                key={`row-${rowIndex}-col-${columnIndex}`}
                className={`flex items-center justify-center border rounded-lg h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 font-semibold text-lg tracking-tight bg-white shadow-sm transition-all duration-300 ${
                  reserved
                    ? "text-gray-500 bg-gray-100"
                    : "text-neutral-800 hover:bg-green-50 hover:shadow-md"
                }`}
              >
                {cellNumber}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={reserved}
        className={`mt-4 w-full py-2.5 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
          reserved
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
        }`}
      >
        {reserved ? "Reserved" : "Reserve"}
      </button>
    </div>
  );
};

export default BingoCard;