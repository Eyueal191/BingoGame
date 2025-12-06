// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Axios from "../api/axiosInstance.js";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await Axios.post("/api/auth/signup", formData);
      const data = res.data;
      if (data.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-poppins">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-green-400 mb-6 sm:mb-8 tracking-wide animate-pulse">
          Join the Bingo Arena!
        </h2>

        {error && (
          <div className="bg-red-700 text-red-100 p-3 rounded-lg mb-5 text-center font-semibold text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name & Email */}
          {["name", "email"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder=" "
                className="w-full px-4 sm:px-5 pt-4 pb-2 bg-green-900/20 text-white border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent peer transition-all duration-200 focus:bg-white focus:text-gray-900 text-sm sm:text-base"
              />
              <label className="absolute left-4 sm:left-5 top-2 text-green-300 text-xs sm:text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-green-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-green-300 peer-focus:text-sm">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 sm:px-5 pt-4 pb-2 bg-green-900/20 text-white border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent peer transition-all duration-200 focus:bg-white focus:text-gray-900 pr-10 sm:pr-12 text-sm sm:text-base"
            />
            <label className="absolute left-4 sm:left-5 top-2 text-green-300 text-xs sm:text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-green-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-green-300 peer-focus:text-sm">
              Password
            </label>
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 text-gray-300 hover:text-green-400 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 sm:px-5 pt-4 pb-2 bg-green-900/20 text-white border border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent peer transition-all duration-200 focus:bg-white focus:text-gray-900 pr-10 sm:pr-12 text-sm sm:text-base"
            />
            <label className="absolute left-4 sm:left-5 top-2 text-green-300 text-xs sm:text-sm font-medium transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-green-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-green-300 peer-focus:text-sm">
              Confirm Password
            </label>
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 text-gray-300 hover:text-green-400 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold shadow-lg hover:scale-105 transform transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 hover:ring-4 hover:ring-green-400 hover:ring-opacity-50 text-sm sm:text-base"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 text-sm sm:text-base">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-400 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
