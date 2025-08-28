import { create } from 'zustand';
// 1. Import our real API service functions
import { getPortfolio, getTradeHistory } from '../services/apiService';

export const usePortfolioStore = create((set) => ({
  portfolio: null,
  tradeHistory: [],
  isLoading: true,

  // 2. Add an action to fetch the initial portfolio data from the backend
  fetchPortfolio: async () => {
    try {
      set({ isLoading: true });
      const portfolioRes = await getPortfolio();
      const historyRes = await getTradeHistory();
      // Note the capital 'H' on Holdings to match our backend response
      const portfolioData = {
        ...portfolioRes.data,
        Holdings: portfolioRes.data.Holdings || []
      };
      set({ portfolio: portfolioData, tradeHistory: historyRes.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
      set({ isLoading: false });
    }
  },

  // 3. Add an action that the socketService will call with real-time updates
  updatePortfolioFromSocket: (newPortfolioData) => {
    console.log("Updating portfolio from socket with:", newPortfolioData);
    set({ portfolio: newPortfolioData });
  }
}));