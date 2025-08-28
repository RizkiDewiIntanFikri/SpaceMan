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

  // Setup socket
  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.on("connect", () => setStatus("Connected"));
    s.on("disconnect", () => setStatus("Disconnected"));
    s.on("aiMessage", (msg) => addAiMessage(msg));

    return () => s.disconnect();
  }, [setSocket, setStatus, addAiMessage]);

  // Auto scroll
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

  const handleReset = () => resetChat();

  const getMessageStyle = (msg) => {
    if (msg.sender === "user") return "bg-blue-500 text-white self-end";
    if (msg.sender === "ai") {
      const text = msg.text.toLowerCase();
      if (text.includes("buy")) return "bg-green-100 text-green-800 self-start";
      if (text.includes("sell")) return "bg-red-100 text-red-800 self-start";
      if (text.includes("hold")) return "bg-yellow-100 text-yellow-800 self-start";
      return "bg-gray-100 text-gray-800 self-start";
    }
    return "bg-gray-100 text-gray-800 self-start";
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 font-sans">
      <h1 className="text-4xl font-bold mb-6"> Spaceman AI Chat</h1>

      {/* Status Socket */}
      <div className="mb-6 flex items-center gap-2 text-lg">
        <span
          className={`w-4 h-4 rounded-full ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-gray-700">
          Status: <span className="font-semibold">{status}</span>
        </span>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-3xl border border-gray-300 rounded-2xl shadow-lg bg-white">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[650px] flex flex-col gap-4 text-lg leading-relaxed">
          {aiMessages.length === 0 ? (
            <p className="text-gray-400 italic text-base">
              Waiting for Gemini...
            </p>
          ) : (
            aiMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl max-w-[70%] shadow ${getMessageStyle(
                  msg
                )}`}
              >
                {msg.text || msg}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-3 bg-gray-50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini for trading advice..."
            className="flex-1 p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition text-lg font-medium"
          >
            Send
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-5 py-3 rounded-xl hover:bg-gray-400 transition text-lg font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
