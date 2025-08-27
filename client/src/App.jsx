import { Routes, Route, Navigate } from "react-router";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import StocksDashboard from "./pages/StocksDashboard";
import Chattbot from "./Pages/chattbot";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to backend. My socket.id:", socket.id);
      setStatus("Connected ");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
      setStatus("Disconnected ");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/chatt" element={<Chattbot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stocks" element={<StocksDashboard />} />
      </Routes>
    </Layout>
  );
}
