import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Clock } from "lucide-react"; 
import CountDownPageBg from "../assets/CountDownPage.png";
import useCardsStore from "../hooks/useCards.js";

// Define a keyframe animation for floating effect (requires Tailwind setup or a separate CSS file)
// Assuming a 'float' utility class is available or defined via Tailwind config.
// For simplicity within this file, we'll use a direct inline animation style where appropriate.

const CountdownPage = () => {
  const navigate = useNavigate();
  const { cards, attachListeners, cleanup } = useCardsStore();
  
  const [secondsLeft, setSecondsLeft] = useState(60); 

  useEffect(() => {
    attachListeners();
    return () => cleanup();
  }, [attachListeners, cleanup]);

  const totalCards = cards.length;
  const reservedCards = cards.filter((c) => c.reserved);
  const reservedCount = reservedCards.length;
  const percent = totalCards === 0 ? 0 : Math.floor((reservedCount / totalCards) * 100);

  // Countdown Timer Logic
  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate("/game"); 
      return;
    }
    const t = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, navigate]); 

  // Time Formatting
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const accentColor = 'text-amber-400';
  const accentBg = 'bg-amber-500';

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden p-4 sm:p-6"
      style={{ backgroundImage: `url(${CountDownPageBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Darkened, Moody Background Overlay */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" /> 

      {/* Main Content Wrapper: Increased Top Margin and added subtle 'float' animation */}
      <div 
        className="relative z-10 flex flex-col items-center w-full max-w-xl lg:max-w-xl mt-12 md:mt-16"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        {/* Style tag for float animation. In a real project, this would be in global CSS/Tailwind config. */}
        <style jsx="true">{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
        `}</style>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-tight text-white drop-shadow-xl">
          Get Ready: Bingo Experience Loading
        </h1>

        {/* Game Starts In Header with stronger pulse */}
        <div className={`text-2xl font-bold ${accentColor} mb-4 flex items-center gap-3 animate-pulse`}>
            <Clock className="w-7 h-7" /> 
            <span>Game starts in</span>
        </div>

        {/* Countdown Box: Gradient Background */}
        <div className="bg-gradient-to-t from-white/10 to-white/20 border border-amber-400/50 px-12 py-6 rounded-xl shadow-2xl backdrop-blur-lg mb-12">
          <p className={`text-7xl font-mono ${accentColor} font-extrabold drop-shadow-lg tracking-wider`}>
            {minutes}:{seconds}
          </p>
        </div>

        {/* Info Card: Deep Background, stronger focus on numbers */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full text-center shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4 text-white/95">
            <Users className="w-8 h-8" />
            <span className="text-xl font-semibold tracking-wide">Players Reserved Cards</span>
          </div>

          {/* Number Display: Larger, bolder, and contrasted */}
          <div className={`bg-white/10 rounded-xl py-4 mb-5 w-full text-4xl font-extrabold tracking-widest flex justify-center border border-white/30 text-white shadow-inner`}>
            {reservedCount} / {totalCards}
          </div>

          {/* Progress Bar: Using accent color */}
          <div className="w-full h-4 rounded-full bg-gray-700 overflow-hidden mb-3 shadow-inner">
            <div className={`h-full ${accentBg} transition-all duration-700 ease-out`} style={{ width: `${percent}%` }} />
          </div>

          <p className="text-lg font-semibold text-white/80">{percent}% capacity reserved</p>
        </div>

        {/* Checklist: Clean, high contrast */}
        <ul className="mt-10 space-y-4 text-lg text-white/90">
          <li className="flex items-center gap-3 font-medium">
            <CheckCircle className={`w-6 h-6 ${accentColor} flex-shrink-0`} /> Ensure your network connection is stable.
          </li>
          <li className="flex items-center gap-3 font-medium">
            <CheckCircle className={`w-6 h-6 ${accentColor} flex-shrink-0`} /> Ready your card and await the call.
          </li>
          <li className="flex items-center gap-3 font-medium">
            <CheckCircle className={`w-6 h-6 ${accentColor} flex-shrink-0`} /> Waiting for the game engine to initialize.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CountdownPage;