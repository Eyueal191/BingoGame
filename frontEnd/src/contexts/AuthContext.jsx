// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "../api/axiosInstance.js";

// Create context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [loading, setLoading] = useState(true); // tracks initial auth check

  /** Login */
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setIsLoggedIn(true);
    localStorage.setItem("authToken", tokenData);
    localStorage.setItem("userId", userData._id);
  };

  /** Logout */
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  };

  /** Check auth */
  const checkAuth = async () => {
    if (!token) {
      logout();
      return false;
    }

    try {
      const res = await Axios.get("/api/auth/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsLoggedIn(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch {
      logout();
      return false;
    }
  };

  /** Initial auth check on mount */
  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setLoading(false);
    };
    verify();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, checkAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
