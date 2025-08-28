// src/App.jsx
import { Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Layout from "./layouts/Layout";
import StocksDashboard from "./Pages/StocksDashboard";
import Portfolio from "./Pages/Portfolio";
import Leaderboard from "./Pages/Leaderboard";
import Trade from "./pages/Trade";
import Chattbot from "./Pages/chattbot";
import LandingPage from "./Pages/LandingPage";

export default function App() {
  const [status, setStatus] = useState("Disconnected");
  const [socketId, setSocketId] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Inisialisasi socket
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnection: true,
    });

    // Saat connect
    socket.on("connect", () => {
      console.log("Connected to backend. Socket ID:", socket.id);
      setStatus("Connected");
      setSocketId(socket.id);

      // Kirim JWT ke server lewat event "authenticate"
      if (token) socket.emit("authenticate", token);
    });

    // Saat disconnect
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from backend:", reason);
      setStatus("Disconnected");
    });

    // Terima pesan AI
    socket.on("aiMessage", (msg) => {
      console.log("AI says:", msg);
      setAiMessages((prev) => [...prev, msg]);
    });

    // Error handling socket
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Bersihkan socket saat unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout>
      {/* AI messages */}
      {aiMessages.length > 0 && (
        <div>
          <h4>AI Messages:</h4>
          <ul>
            {aiMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/stocks" element={<StocksDashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/chatt" element={<Chattbot />} />
      </Routes>
    </Layout>
  );
}
