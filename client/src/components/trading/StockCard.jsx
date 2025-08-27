function StockCard({ stock }) {
  const isPositive = stock.change >= 0;
  const priceColor = isPositive ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
      <p className={`text-2xl font-semibold my-1 ${priceColor}`}>
        ${stock.price?.toFixed(2)}
      </p>
      <div className={`flex items-center text-sm ${priceColor}`}>
        <span>
          {isPositive ? "+" : ""}
          {stock.change?.toFixed(2)}
        </span>
        <span className="mx-2">|</span>
        <span>
          {isPositive ? "+" : ""}
          {stock.changePercent?.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export default StockCard;
