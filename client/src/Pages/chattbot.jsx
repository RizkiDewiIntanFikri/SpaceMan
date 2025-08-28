import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSocketStore } from "../../stores/socketStore";

export default function Chattbot() {
  const {
    aiMessages,
    addAiMessage,
    resetChat,
    status,
    setStatus,
    setSocket,
    socket,
  } = useSocketStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.on("connect", () => setStatus("Connected"));
    s.on("disconnect", () => setStatus("Disconnected"));

    s.on("aiMessage", (msg) => addAiMessage(msg));

    return () => s.disconnect();
  }, [setSocket, setStatus, addAiMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    const userMessage = input.trim();
    addAiMessage({ text: userMessage, sender: "user" });
    setInput("");

    socket.emit("askAI", userMessage);
  };

  // Reset chat
  const handleReset = () => {
    resetChat();
  };

  // Warna chat
  const getMessageStyle = (msg) => {
    if (msg.sender === "user") return "bg-blue-500 text-white self-end";
    if (msg.sender === "ai") {
      const text = msg.text.toLowerCase();
      if (text.includes("buy")) return "bg-green-100 text-green-800 self-start";
      if (text.includes("sell")) return "bg-red-100 text-red-800 self-start";
      if (text.includes("hold"))
        return "bg-yellow-100 text-yellow-800 self-start";
      return "bg-gray-100 text-gray-800 self-start";
    }
    return "bg-gray-100 text-gray-800 self-start";
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">SPACEMAN AI Chat</h1>

      {/* Status Socket */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span
          className={`w-3 h-3 rounded-full ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <span className="text-gray-700">
          status: <span className="font-semibold">{status}</span>
        </span>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col w-full max-w-md border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto bg-white max-h-[500px] flex flex-col gap-2">
          {aiMessages.length === 0 && (
            <p className="text-gray-400 italic text-sm">
              Waiting for Gemini...
            </p>
          )}

          {aiMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[70%] shadow-sm ${getMessageStyle(
                msg
              )}`}
            >
              {msg.text || msg}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Reset */}
        <div className="p-3 border-t border-gray-200 flex gap-2 bg-gray-50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini for trading advice..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
