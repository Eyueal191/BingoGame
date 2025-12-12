// src/routes/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../contexts/AuthContext.jsx";

function PublicRoute() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  // Wait until auth check finishes
  if (loading) return null; // optional: show a spinner

  // Redirect logged-in users to home
  if (isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default PublicRoute;
