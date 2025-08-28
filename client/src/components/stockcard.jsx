import { useTheme } from "../../context/ThemeContext";

export default function StockCard({ stock, onTrade }) {
  const { symbol, name, logo, price, changePct } = stock;
  const { theme } = useTheme();

  const bgColor = theme === "light" ? "white" : "black";
  const borderColor = theme === "light" ? "#e5e7eb" : "#1f1f1f";
  const textColor = theme === "light" ? "black" : "white";
  const buttonBg = theme === "light" ? "#f3f4f6" : "#1f1f1f";
  const buttonText = theme === "light" ? "black" : "white";

  return (
    <div
      className="border rounded-2xl p-4"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          {logo} {name}
        </div>
        <div className={changePct >= 0 ? "text-green-600" : "text-red-600"}>
          {price.toFixed(2)} ({changePct.toFixed(2)}%)
        </div>
      </div>
      <button
        className="mt-2 w-full py-1 rounded-xl border"
        style={{
          backgroundColor: buttonBg,
          color: buttonText,
          borderColor: borderColor,
        }}
        onClick={() => onTrade(symbol, price)}
      >
        Buy/Sell
      </button>
    </div>
  );
}
