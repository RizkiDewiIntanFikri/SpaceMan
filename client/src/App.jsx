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

  return (
    <div>
      <h1>Socket Test</h1>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
