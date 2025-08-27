import { useMarketStore } from "../../stores/marketStore";
import StockCard from "./StockCard";

function FeaturedStocks() {
  const featuredStocks = useMarketStore((state) => state.featuredStocks);
  const stocks = Object.values(featuredStocks);

  if (stocks.length === 0) {
    return <p className="text-center text-gray-400">Connecting to market...</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
}

export default FeaturedStocks;
