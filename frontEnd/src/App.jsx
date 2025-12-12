import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ErrorBoundary } from "./router/ErrorBoundary.jsx";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CardsPage from "./pages/CardsPage";
import CountdownPage from "./pages/CountdownPage";
import GamePage from "./pages/GamePage";
import NotFoundPage from "./pages/NotFoundPage";
import WinnerPage from "./pages/WinnerPage.jsx";
import LoserPage from "./pages/LoserPage.jsx";
import ProtectedRoute from "./router/ProtectedRoute";
import PublicRoute from "./router/PublicRoute";
import Loading from "./components/Loading";

import { SocketContext } from "./contexts/SocketContext.jsx";

const App = () => {
  const { socketReady } = useContext(SocketContext);

  if (!socketReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<CardsPage />} />
              <Route path="countdown" element={<CountdownPage />} />
              <Route path="game" element={<GamePage />} />
              <Route path="winner" element={<WinnerPage />} />
              <Route path="loser" element={<LoserPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>

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
