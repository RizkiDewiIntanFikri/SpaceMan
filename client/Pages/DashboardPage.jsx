import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSocketStore } from "../stores/socketStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { aiMessages, addAiMessage, status, setStatus, setSocket, socket } =
    useSocketStore();
  const [chartData, setChartData] = useState({
    labels: ["Buy", "Sell", "Hold"],
    datasets: [
      {
        label: "Rekomendasi",
        data: [0, 0, 0],
        backgroundColor: ["#34D399", "#F87171", "#FBBF24"],
      },
    ],
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.on("connect", () => setStatus("Connected"));
    s.on("disconnect", () => setStatus("Disconnected"));

    s.on("aiMessage", (msg) => {
      addAiMessage(msg);
      updateChart(msg);
    });

    return () => s.disconnect();
  }, [setSocket, setStatus, addAiMessage]);

  const updateChart = (msg) => {
    const lower = msg.toLowerCase();
    const newData = [...chartData.datasets[0].data];
    if (lower.includes("buy")) newData[0] = (newData[0] || 0) + 1;
    if (lower.includes("sell")) newData[1] = (newData[1] || 0) + 1;
    if (lower.includes("hold")) newData[2] = (newData[2] || 0) + 1;
    setChartData({
      ...chartData,
      datasets: [{ ...chartData.datasets[0], data: newData }],
    });
  };

  const handleSend = () => {
    if (!socket) return;
    socket.emit("askAI");
    addAiMessage("You: Requesting recommendation...");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Gemini AI Chat & Multi-Saham</h1>
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-3 h-3 rounded-full ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <p>
          Socket status: <span className="font-semibold">{status}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="flex-1 flex flex-col border rounded-lg shadow-sm overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {aiMessages.map((msg, i) => (
              <div
                key={i}
                className="p-3 my-1 rounded-lg max-w-[70%] shadow-sm bg-gray-100"
              >
                {msg}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex gap-2 bg-gray-50">
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-5 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Minta Rekomendasi
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/3 p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">Chart Rekomendasi</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}
