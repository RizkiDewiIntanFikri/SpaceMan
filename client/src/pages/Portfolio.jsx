import React from "react";
import Header from "../components/common/Header";
import Holdings from "../components/portfolio/Holdings";
import TransactionHistory from "../components/portfolio/TransactionHistory";
import { usePortfolioStore } from "../stores/portfolioStore";

function Portfolio() {
  const { portfolio, isLoading } = usePortfolioStore();

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="text-center p-10">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <h2 className="text-3xl font-bold text-white mb-6">My Portfolio</h2>

        {/* Portfolio Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-gray-400 text-sm">Cash Balance</h4>
            <p className="text-2xl font-semibold text-green-400">
              {formatCurrency(portfolio?.cashBalance)}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-gray-400 text-sm">Holdings Value</h4>
            <p className="text-2xl font-semibold text-white">
              {formatCurrency(portfolio?.holdingsValue)}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-gray-400 text-sm">Total Value</h4>
            <p className="text-2xl font-semibold text-blue-400">
              {formatCurrency(portfolio?.totalValue)}
            </p>
          </div>
        </div>

        {/* Holdings and History Components */}
        <Holdings />
        <TransactionHistory />
      </main>
    </div>
  );
}

export default Portfolio;
