import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuth";

function ProtectedRoute() {
  const { checkAuth, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // show outlet only after auth check

  useEffect(() => {
    const verifyAuth = async () => {
      // If no token, logout immediately
      const tokenExists = localStorage.getItem("token");
      if (!tokenExists) {
        navigate("/login", { replace: true });
        return;
      }

      const authenticated = await checkAuth();
      if (!authenticated) {
        navigate("/login", { replace: true });
      } else {
        setLoading(false);
      }
    };

    verifyAuth();

    const intervalId = setInterval(verifyAuth, 60 * 1000); // check every 1 min
    return () => clearInterval(intervalId);
  }, [checkAuth, navigate]);

  // Show nothing or a loading spinner until auth verified
  if (loading && !isLoggedIn) return null;

  return <Outlet />;
}

export default ProtectedRoute;
