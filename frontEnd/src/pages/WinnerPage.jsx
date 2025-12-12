// src/pages/WinnerPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Users, CheckCircle, Star } from "lucide-react";
import CountDownPageBg from "../assets/CountDownPage.png";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext.jsx";

const WinnerPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const playerCount = Number(localStorage.getItem("playerCount")) || 0;

  // Auto navigate to dashboard/home after 200 seconds
  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden p-4 sm:p-6"
      style={{
        backgroundImage: `url(${CountDownPageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl mt-12 md:mt-16 animate-float">
        {/* Floating animation */}
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>

        {/* Header */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-center tracking-tight drop-shadow-xl">
          Game Over
        </h1>

        {/* Static Winner Message Box */}
        <div className="bg-gradient-to-t from-white/20 to-white/10 border border-amber-400/50 px-12 py-6 rounded-xl shadow-2xl backdrop-blur-lg mb-12 flex flex-col items-center gap-3">
          <Trophy className="w-12 h-12 text-amber-400" />
          <p className="text-4xl md:text-5xl font-extrabold drop-shadow-lg tracking-wider text-amber-300 text-center">
            🎉 Congratulations! You won the game!
          </p>
        </div>

        {/* Player Info Card */}
        <div className="bg-gray-800/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full text-center shadow-2xl mb-10">
          <div className="flex items-center justify-center gap-3 mb-4 text-white/95">
            <Users className="w-8 h-8" />
            <span className="text-xl font-semibold tracking-wide">
              Players Participated
            </span>
          </div>
          <div className="bg-white/10 rounded-xl py-4 mb-5 w-full text-4xl font-extrabold tracking-widest flex justify-center border border-white/30 text-white shadow-inner">
            {playerCount}
          </div>
        </div>

        {/* Checklist */}
        <ul className="mt-10 space-y-4 text-lg text-white/90">
          <li className="flex items-center gap-3 font-medium">
            <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            Celebrate responsibly!
          </li>
          <li className="flex items-center gap-3 font-medium">
            <Star className="w-6 h-6 text-amber-400 flex-shrink-0" />
            Share your achievement.
          </li>
          <li className="flex items-center gap-3 font-medium">
            <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            Wait for the next round or return to lobby.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WinnerPage;
