// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Axios from "../api/axiosInstance.js";
import useAuthStore from "../hooks/useAuth.js";
import socket, { connectSocket } from "../services/socket";
import CountDownPage from "../assets/CountDownPage.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await Axios.post("/api/auth/login", formData);

      if (res.data.success) {
        const user = res.data.user;

        // Save userId to localStorage
        localStorage.setItem("userId", user._id);

        // Attach userId to socket.auth and connect
        socket.auth = { userId: user._id };
        connectSocket();

        // Update Zustand store
        login(user, res.data.token);

        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden p-4 sm:p-6"
      style={{
        backgroundImage: `url(${CountDownPage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 md:p-10 bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl animate-float">
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
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-green-400 mb-8 animate-pulse">
          Welcome Back!
        </h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-700 text-red-100 p-3 rounded-lg mb-5 text-center font-semibold text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-green-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 sm:px-5 py-2 bg-green-900/20 text-white border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:text-gray-900 text-sm sm:text-base"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-green-300 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 sm:px-5 py-2 bg-green-900/20 text-white border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:text-gray-900 pr-10 sm:pr-12 text-sm sm:text-base"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-[6.5vh] right-3 sm:right-4 -translate-y-1/2 text-gray-300 hover:text-green-400 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold shadow-lg hover:scale-105 transform transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 hover:ring-4 hover:ring-green-400 hover:ring-opacity-50 text-sm sm:text-base"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-gray-200 text-sm sm:text-base">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-400 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
