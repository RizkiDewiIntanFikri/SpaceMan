import React, { useEffect } from "react";
import Header from "../components/common/Header";
import FeaturedStocks from "../components/trading/FeaturedStocks";
// We will create these components next
// import OrderForm from '../components/trading/OrderForm';
// import RankingTable from '../components/leaderboard/RankingTable';
import { usePortfolioStore } from "../stores/portfolioStore";
import { useMarketStore } from "../stores/marketStore";

function Dashboard() {
  // Get the actions to fetch initial data from our stores
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  const fetchLeaderboard = useMarketStore((state) => state.fetchLeaderboard);

  // This useEffect hook runs once when the component is first mounted
  useEffect(() => {
    // Fetch the user's personal data and the public market data
    fetchPortfolio();
    fetchLeaderboard();
  }, [fetchPortfolio, fetchLeaderboard]); // Dependencies for the effect

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

        {/* This is a responsive layout. On larger screens, it's a two-column grid.
                    On smaller screens, it collapses into a single column. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* The Order Form will go here */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white">
                Trade Component Placeholder
              </h2>
            </div>
          </div>
          <div>
            {/* The Leaderboard will go here */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white">
                Leaderboard Placeholder
              </h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
