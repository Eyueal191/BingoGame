// src/pages/NotFoundPage.jsx
import React from "react";
import CountDownPage from "../assets/CountDownPage.png";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden px-4 sm:px-6"
      style={{
        backgroundImage: `url(${CountDownPage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-6 sm:p-8 md:p-10 bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl animate-float">
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

        {/* 404 Header */}
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-widest text-green-400 drop-shadow-lg animate-pulse">
          404
        </h1>

        {/* Text container */}
        <div className="text-center mt-6 p-6 bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-2xl">
          <p className="text-2xl md:text-3xl text-green-300 font-semibold mt-4">
            Oops! Page not found.
          </p>
          <p className="mt-2 text-lg md:text-xl text-gray-400">
            The page you’re looking for doesn’t exist.
          </p>

          {/* Go Home Button */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-block px-8 py-3 rounded-xl 
                       bg-gradient-to-r from-green-500 via-green-600 to-green-700 
                       text-white font-bold shadow-lg 
                       hover:scale-105 transform transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 
                       hover:ring-4 hover:ring-green-400 hover:ring-opacity-50 text-sm sm:text-base"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
