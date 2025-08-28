import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useSocketStore } from "../stores/socketStore";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { setSocket, setStatus, addAiMessage } = useSocketStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      auth: { token },
    });

    setSocket(socket);

    socket.on("connect", () => setStatus("Connected"));
    socket.on("disconnect", () => setStatus("Disconnected"));
    socket.on("connect_error", (err) => console.error("Socket error:", err.message));

    // Gemini AI response
    socket.on("aiMessage", (msg) => addAiMessage(msg));

    return () => socket.disconnect();
  }, [setSocket, setStatus, addAiMessage]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
