// src/components/Loading.jsx
import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen relative bg-gray-900">
      {/* Outer Circle - Clockwise */}
      <div
        className="absolute border-4 border-green-500 border-t-transparent rounded-full 
                   w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 animate-spin"
      ></div>

      {/* Inner Circle - Anti-clockwise */}
      <div
        className="absolute border-4 border-green-400 border-t-transparent rounded-full 
                   w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 animate-spin-reverse"
      ></div>
    </div>
  );
}

export default Loading;
