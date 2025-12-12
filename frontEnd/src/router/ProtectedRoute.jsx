// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext.jsx";

function ProtectedRoute() {
  const navigate = useNavigate();
  const { isLoggedIn, checkAuth, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      if (!isMounted) return;

      try {
        const authenticated = await checkAuth();

        if (!authenticated && isMounted) {
          navigate("/login", { replace: true });
        } else if (authenticated && isMounted) {
          setLoading(false);
        }
      } catch {
        if (isMounted) navigate("/login", { replace: true });
      }
    };

    // Run immediately if not logged in
    if (!isLoggedIn) {
      verifyAuth();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, navigate, checkAuth]);

  if (loading || authLoading) return null; // can show spinner

  return <Outlet />;
}

export default ProtectedRoute;
