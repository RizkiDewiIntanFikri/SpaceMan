import { usePortfolioStore } from "../../stores/portfolioStore";
import { formatCurrency } from "../../utils/formatters";
import Card from "../ui/Card"; // Assuming you have a Card component

export default function PortfolioCard() {
  // 1. Get the entire portfolio object and the isLoading flag from our real store.
  const { portfolio, isLoading } = usePortfolioStore();

  // 2. This is the crucial "loading guard". If the data is still being fetched,
  // we show a loading message and stop rendering. This prevents all crashes.
  if (isLoading || !portfolio) {
    return (
      <Card>
        <div className="text-center text-gray-500 p-4">
          Loading Portfolio...
        </div>
      </Card>
    );
  }

  // 3. If we get here, we know 'portfolio' is a valid object.
  // We can now safely calculate the P&L percentage.
  const pnlPct = ((portfolio.totalValue - 100000) / 100000) * 100;
  const up = pnlPct >= 0;

  return (
    <Card>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500">Cash Balance</div>
          {/* 4. Safely access the data from inside the portfolio object */}
          <div className="text-lg font-semibold">
            {formatCurrency(portfolio.cashBalance)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Total Value</div>
          <div className="text-lg font-semibold">
            {formatCurrency(portfolio.totalValue)}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-gray-500">P&L %</div>
          <div
            className={
              "text-sm font-medium " +
              (up ? "text-emerald-600" : "text-rose-600")
            }
          >
            {up ? "▲" : "▼"} {Math.abs(pnlPct).toFixed(2)}%
          </div>
        </div>
      </div>
    </Card>
  );
}
