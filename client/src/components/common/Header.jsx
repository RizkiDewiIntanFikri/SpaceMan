// /src/components/common/Header.jsx

import React from "react";
import { Link, useNavigate } from "react-router";
import { useUserStore } from "../../stores/userStore";
import { usePortfolioStore } from "../../stores/portfolioStore";

function Header() {
  const { username, logout } = useUserStore();
  const portfolio = usePortfolioStore((state) => state.portfolio);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing page after logout
  };

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-white">
          SpaceMan
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-lg">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link to="/portfolio" className="text-gray-300 hover:text-white">
            Portfolio
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-white font-semibold">{username}</p>
            {portfolio && (
              <p className="text-green-400 text-sm">
                {formatCurrency(portfolio.cashBalance)}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
