// Polished CardsPage with modern shadows, accents, and improved typography
import React, { useEffect } from "react";
import useCardsStore from "../hooks/useCards.js";
import BingoCard from "../components/BingoCard";

const CardsPage = () => {
  const { cards, loading, attachListeners, cleanup } = useCardsStore();

  useEffect(() => {
    attachListeners();
    return () => cleanup();
  }, [attachListeners, cleanup]);

  const reservedCards = cards.filter((c) => c.reserved);
  const availableCards = cards.filter((c) => !c.reserved);

  return (
    <div className="p-6 md:p-10 font-sans">

      {/* -------- TOP TITLE ---------- */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight my-8 text-neutral-900 leading-tight drop-shadow-sm">
        Select an <span className="text-green-600">available card</span> to reserve and join the next game.
      </h1>

      {/* -------- STATS BOXES ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 mt-15">

        {/* Available */}
        <div className="rounded-2xl p-6 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] border border-neutral-200 transition-all hover:shadow-[0_6px_30px_rgba(0,0,0,0.10)]">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-neutral-700">Available Cards</h2>

          <div className="flex items-center justify-between">
            <span className="text-3xl md:text-4xl font-bold text-green-700 drop-shadow-sm">{availableCards.length}</span>

            <span className="p-4 flex rounded-xl items-center justify-center" style={{ backgroundColor: "#BEEEC3" }}>
              <span className="w-4 h-4 rounded-full bg-green-600"></span>
            </span>
          </div>
        </div>

        {/* Reserved */}
        <div className="rounded-2xl p-6 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] border border-neutral-200 transition-all hover:shadow-[0_6px_30px_rgba(0,0,0,0.10)]">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-neutral-700">Reserved Cards</h2>

          <div className="flex items-center justify-between">
            <span className="text-3xl md:text-4xl font-bold text-red-600 drop-shadow-sm">{reservedCards.length}</span>

            <span className="p-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F8D5D4" }}>
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#EB3939" }}></span>
            </span>
          </div>
        </div>

      </div>

      {/* -------- LOADING ---------- */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500 text-lg animate-pulse">
          Loading cards...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <BingoCard key={card._id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};
export default CardsPage;