import React from "react";

function NotFoundPage() {
  return (
    // Background matches LoginPage: dark gray
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 font-poppins">
      
      {/* 404 Text: Vibrant green color and large, bold style */}
      <h1 className="text-8xl sm:text-9xl font-extrabold tracking-widest text-green-400 drop-shadow-lg animate-pulse">
        404
      </h1>
      
      {/* Container for the text block (optional, but helps center) */}
      <div className="text-center mt-6 p-6 bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl">
          
        {/* Oops! Page not found. */}
        <p className="text-2xl md:text-3xl text-green-300 font-semibold mt-4">
          Oops! Page not found.
        </p>
        
        {/* Description text */}
        <p className="mt-2 text-lg md:text-xl text-gray-400">
          The page you’re looking for doesn’t exist.
        </p>
        
        {/* Go Home Button: Adopted green gradient styling from LoginPage button */}
        <a
          href="/"
          className="mt-6 inline-block px-8 py-3 rounded-xl 
                     bg-gradient-to-r from-green-500 via-green-600 to-green-700 
                     text-white font-bold shadow-lg 
                     hover:scale-105 transform transition-all duration-300
                     focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 
                     hover:ring-4 hover:ring-green-400 hover:ring-opacity-50 text-sm sm:text-base"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;