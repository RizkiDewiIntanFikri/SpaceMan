
import { Routes, Route, Navigate } from 'react-router'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import StocksDashboard from "./pages/StocksDashboard";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to backend. My socket.id:", socket.id);
      setStatus("Connected ✅");

      // ambil token dari localStorage (atau state global kamu)
      const token = localStorage.getItem("access_token");
      socket.emit("authenticate", token);
      console.log("Sent authenticate event with token:", token);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
      setStatus("Disconnected ❌");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stocks" element={<StocksDashboard />} />
      </Routes>
    </Layout>
  )
}




export default App;
