// src/layouts/DashboardLayout.jsx
import React from "react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed NavBar */}
      <NavBar />

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
