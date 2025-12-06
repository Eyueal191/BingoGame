// src/components/NavBar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/BingoLogo.png";
import useAuthStore from "../hooks/useAuth.js";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/countdown", label: "Countdown" },
    { to: "/game", label: "Game" },
  ];

  const getClass = (path) => {
    const base = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200";
    const active = "text-white bg-blue-600 ring-2 ring-blue-400";
    const inactive = "text-gray-700 hover:text-blue-600 hover:ring-1 hover:ring-blue-300";

    return location.pathname.startsWith(path) ? `${base} ${active}` : `${base} ${inactive}`;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Bingo Logo" className="h-10 w-10" />
            <span className="font-bold text-xl text-blue-600">Bingo Game</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={getClass(link.to)}>
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 p-1 rounded"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
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
        </div>
      </div>

      {/* Mobile Links */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col space-y-2 p-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={getClass(link.to)}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
export default NavBar;
