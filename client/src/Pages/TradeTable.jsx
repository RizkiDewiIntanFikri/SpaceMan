import { useEffect, useState } from "react";
import axios from "axios";

export default function TradeTable() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:3000/trades/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchHistory();
  }, []);

  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade) => (
          <tr key={trade.id}>
            <td>{trade.symbol}</td>
            <td>{trade.type}</td>
            <td>{trade.quantity}</td>
            <td>{trade.price}</td>
            <td>{new Date(trade.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
