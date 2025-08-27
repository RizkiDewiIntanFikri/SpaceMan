import { create } from 'zustand';
import { getPortfolio, getTradeHistory } from '../services/apiService';

export const usePortfolioStore = create((set) => ({
    portfolio: null,
    tradeHistory: [],
    isLoading: true,

    // Action to fetch initial portfolio data when a user logs in
    fetchPortfolio: async () => {
        try {
            set({ isLoading: true });
            const portfolioRes = await getPortfolio();
            const historyRes = await getTradeHistory();
            set({ portfolio: portfolioRes.data, tradeHistory: historyRes.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
            set({ isLoading: false });
        }
    },

    // Action that will be called by the socketService to update the portfolio
    updatePortfolioFromSocket: (newPortfolioData) => {
        set({ portfolio: newPortfolioData });
    }
}));