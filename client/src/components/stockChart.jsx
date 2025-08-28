import { Line } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function StockChart({ data }) {
  const { theme } = useTheme();

  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Close Price",
        data: data.map((d) => d.close),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        titleColor: theme === "light" ? "#000" : "#fff",
        bodyColor: theme === "light" ? "#000" : "#fff",
        backgroundColor: theme === "light" ? "#fff" : "#000",
        borderColor: theme === "light" ? "#e5e7eb" : "#1f1f1f",
        borderWidth: 1,
      },
      legend: {
        labels: {
          color: theme === "light" ? "#000" : "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme === "light" ? "#000" : "#fff" },
        grid: {
          color: theme === "light" ? "#e5e7eb" : "#1f1f1f",
        },
      },
      y: {
        ticks: { color: theme === "light" ? "#000" : "#fff" },
        grid: {
          color: theme === "light" ? "#e5e7eb" : "#1f1f1f",
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}
