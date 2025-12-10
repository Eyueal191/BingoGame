import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket, { connectSocket, disconnectSocket } from "./services/socket.js";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CardsPage = lazy(() => import("./pages/CardsPage"));
const CountdownPage = lazy(() => import("./pages/CountdownPage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const WinnerPage = lazy(()=> import("./pages/WinnerPage.jsx"));
const LoserPage = lazy(()=> import("./pages/LoserPage.jsx"));
import ProtectedRoute from "./router/ProtectedRoute";
import PublicRoute from "./router/PublicRoute";
import Loading from "./components/Loading";

const App = () => {
  useEffect(() => {
    // ✅ Connect socket once when the app mounts, ensuring userId is attached
    connectSocket(() => {
      console.log("[SOCKET] Connected:", socket.id);

      // Global listeners
      socket.on("disconnect", (reason) => console.log("[SOCKET] Disconnected:", reason));
      socket.on("connect_error", (err) => console.error("[SOCKET] Connection error:", err.message));
      socket.on("error", (msg) => console.error("[SOCKET] Server error:", msg));

      // Optional: log any cardsData broadcast from server
      socket.on("cardsData", (cards) => {
        console.log("[SOCKET] Received cardsData:", cards);
      });
    });

    // Cleanup on unmount
    return () => {
      // Remove all global listeners
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("error");
      socket.off("cardsData");

      // Disconnect socket gracefully
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loading />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<CardsPage />} />
              <Route path="countdown" element={<CountdownPage />} />
              <Route path="game" element={<GamePage />} />     
<Route path="winner" element={<WinnerPage />} />
<Route path="loser" element={<LoserPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
