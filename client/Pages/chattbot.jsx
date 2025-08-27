import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSocketStore } from "../stores/socketStore";

export default function DashboardPage() {
  const { aiMessages, addAiMessage, status, setStatus, setSocket, socket } =
    useSocketStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Connect Socket.IO
  useEffect(() => {
    const s = io("http://localhost:3000"); // ganti sesuai backend URL
    setSocket(s);

    s.on("connect", () => setStatus("Connected"));
    s.on("disconnect", () => setStatus("Disconnected"));

    s.on("aiMessage", (msg) => addAiMessage(msg));

    return () => s.disconnect();
  }, [setSocket, setStatus, addAiMessage]);

  // Auto scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  // Kirim pesan user
  const handleSend = () => {
    if (!input.trim() || !socket) return;

    const userMessage = input.trim();
    addAiMessage(`You: ${userMessage}`);
    setInput("");

    socket.emit("askAI", userMessage);
  };

  // Tentukan warna chat
  const getMessageColor = (msg) => {
    const text = msg.toLowerCase();
    if (text.includes("buy")) return "bg-green-100 text-green-800";
    if (text.includes("sell")) return "bg-red-100 text-red-800";
    if (text.includes("hold")) return "bg-yellow-100 text-yellow-800";
    if (text.startsWith("You:")) return "bg-blue-100 text-blue-800 self-end";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Gemini AI Chat</h1>

      {/* Status Socket */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <p className="text-gray-700">
          Socket status: <span className="font-semibold">{status}</span>
        </p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {aiMessages.length === 0 && (
            <p className="text-gray-400 italic">Waiting for Gemini...</p>
          )}

          {aiMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 my-1 rounded-lg max-w-[70%] shadow-sm ${getMessageColor(
                msg
              )}`}
            >
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
            className="bg-blue-500 text-white px-5 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
