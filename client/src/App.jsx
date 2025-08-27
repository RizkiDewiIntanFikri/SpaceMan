// src/App.jsx
import { Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Layout from "./layouts/Layout";
import Dashboard from "./Pages/Dashboard";
import StocksDashboard from "./Pages/StocksDashboard";
import Portfolio from "./Pages/Portfolio";
import Leaderboard from "./Pages/Leaderboard";
import Trade from "./Pages/Trade";
import Chattbot from "./Pages/chattbot";

export default function App() {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to backend. Socket ID:", socket.id);
      setStatus("Connected");

      const token = localStorage.getItem("access_token");
      socket.emit("authenticate", token);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
      setStatus("Disconnected");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stocks" element={<StocksDashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/chatt" element={<Chattbot />} />
      </Routes>
    </Layout>
  );
}
