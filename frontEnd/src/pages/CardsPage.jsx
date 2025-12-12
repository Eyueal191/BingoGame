// src/pages/CardsPage.jsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext.jsx";
import BingoCard from "../components/BingoCard";

const CardsPage = () => {
  const {
    cards = [], // default to empty array
    reservedcardCount = 0,
    getAllCards,
    resetReservations,
  } = useContext(SocketContext);

  const [searchedNumber, setSearchedNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all cards once on mount
  useEffect(() => {
    const fetchCards = async () => {
      await getAllCards?.();
      setLoading(false);
    };
    fetchCards();
  }, []); // empty dependency array ensures it runs only once

  // Navigate automatically when reserved cards reach 2
  useEffect(() => {
    if (reservedcardCount >= 2) {
      const timer = setTimeout(() => navigate("/countdown"), 2000);
      return () => clearTimeout(timer);
    }
  }, [reservedcardCount, navigate]);

  // Filter cards based on search input
  const filteredCards = useMemo(() => {
    if (!searchedNumber.trim()) return cards;
    return cards.filter((c) => c?.number === Number(searchedNumber));
  }, [searchedNumber, cards]);

  const reservedCards = filteredCards.filter((c) => c?.reserved);
  const availableCards = filteredCards.filter((c) => !c?.reserved);

  return (
    <div className="p-6 md:p-10 font-sans mt-20">
      {/* HEADER + SEARCH */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 mb-6">
          Select an <span className="text-green-500">available card</span> and join the game.
        </h1>

        <div className="flex mt-4">
          <div className="relative w-full max-w-md">
            <input
              type="number"
              placeholder="Search by card number..."
              value={searchedNumber}
              onChange={(e) => setSearchedNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl 
                         border border-neutral-300 bg-white/70 
                         backdrop-blur-md shadow-sm
                         focus:ring-2 focus:ring-green-500 focus:border-green-500
                         transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard title="Available Cards" value={availableCards.length} color="green" />
        <StatCard title="Reserved Cards" value={reservedCards.length} color="red" />
      </div>

      {/* CARD GRID */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-400 text-lg animate-pulse">
          Loading cards...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <BingoCard key={card._id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
};

/** -----------------------------------
 * Reusable StatCard Component
 * ----------------------------------- */
const StatCard = ({ title, value, color }) => (
  <div className="rounded-2xl p-6 bg-white shadow-md border border-neutral-200 hover:shadow-lg transition-all">
    <h2 className="text-lg md:text-xl font-semibold mb-4 text-neutral-700">{title}</h2>
    <div className="flex items-center justify-between">
      <span className={`text-4xl font-bold text-${color}-500`}>{value}</span>
      <span className={`p-4 rounded-xl flex items-center justify-center bg-${color}-100`}>
        <span className={`w-4 h-4 rounded-full bg-${color}-500`}></span>
      </span>
    </div>
  </div>
);

export default CardsPage;
