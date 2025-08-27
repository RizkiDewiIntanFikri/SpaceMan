import React, { useEffect } from "react";
import Header from "../components/common/Header";
import OrderForm from "../components/dashboard/OrderForm"; // Import the new component
import RankingTable from "../components/leaderboard/RankingTable"; // Import the new component
import { usePortfolioStore } from "../stores/portfolioStore";
import { useMarketStore } from "../stores/marketStore";
import FeaturedStocks from "../components/trading/FeaturedStocks";

function Dashboard() {
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  const fetchLeaderboard = useMarketStore((state) => state.fetchLeaderboard);

  useEffect(() => {
    fetchPortfolio();
    fetchLeaderboard();
  }, [fetchPortfolio, fetchLeaderboard]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Market Overview
          </h2>
          <FeaturedStocks />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Replace the placeholder with the OrderForm component */}
            <OrderForm />
          </div>
          <div>
            {/* Replace the placeholder with the RankingTable component */}
            <RankingTable />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
