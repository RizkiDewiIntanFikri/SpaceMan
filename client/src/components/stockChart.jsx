import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function StockChart({ data }) {
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

  return <Line data={chartData} />;
}
