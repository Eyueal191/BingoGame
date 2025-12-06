import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../hooks/useAuth";

function PublicRoute() {
  const { isLoggedIn } = useAuthStore();

  // Redirect logged-in users to dashboard or home
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // render login/register pages
}

export default PublicRoute;
