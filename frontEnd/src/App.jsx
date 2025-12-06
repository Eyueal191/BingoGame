import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth wrappers
import ProtectedRoute from "./router/ProtectedRoute";
import PublicRoute from "./router/PublicRoute";

// Loading spinner
import Loading from "./components/Loading";

// Lazy-loaded layout and pages
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CardsPage = lazy(() => import("./pages/CardsPage"));
const CardPreviewPage = lazy(() => import("./pages/CardPreviewPage"));
const CountdownPage = lazy(() => import("./pages/CountdownPage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = () => {
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
            {/* Default route "/" goes to DashboardLayout */}
            <Route path="/" element={<DashboardLayout />}>
              {/* Default child of DashboardLayout */}
              <Route index element={<CardsPage />} />
              <Route path="card/:id" element={<CardPreviewPage />} />
              <Route path="countdown" element={<CountdownPage />} />
              <Route path="game" element={<GamePage />} />
            </Route>
          </Route>

          {/* Fallback route */}
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
