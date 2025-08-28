import { useState } from "react";
import { useTrading } from "../stores/TradingContext";
import StockChart from "../components/stockChart";

export default function TradingChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading, history } = useTrading();

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow bg-white">
      <div className="h-96 overflow-y-auto mb-4 flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-200 self-end"
                : "bg-green-200 self-start"
            }`}
          >
            {msg.text}
            {msg.role === "ai" && history[msg.text.split(" ")[0]] && (
              <div className="mt-2">
                <StockChart data={history[msg.text.split(" ")[0]]} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="p-2 bg-yellow-200 self-start">
            AI sedang mengetik...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan simbol saham, misal AAPL"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
