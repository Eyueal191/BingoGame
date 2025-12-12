// src/components/NavBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BingoLogo.png";

import { useContext } from "react";
import AuthContext from "../contexts/AuthContext.jsx";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">

          {/* --- Logo --- */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Bingo Logo"
              className="h-14 w-14 md:h-16 md:w-16 transition-transform duration-300 hover:scale-105"
            />
            <span className="font-extrabold text-2xl md:text-3xl text-blue-600 ml-2">
              Bingo Game
            </span>
          </div>

          {/* --- Desktop Logout Button --- */}
          {user && (
            <div className="hidden md:flex">
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl text-base font-semibold text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 shadow-md"
              >
                Logout
              </button>
            </div>
          )}

          {/* --- Mobile Menu Button --- */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 rounded"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* --- Mobile Logout Menu --- */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white shadow-md flex flex-col space-y-3 p-4 rounded-b-lg">
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl text-base font-semibold text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
