import { create } from 'zustand';
import { getLeaderboard } from '../services/apiService';

export const useMarketStore = create((set) => ({
    featuredStocks: {}, // e.g., { AAPL: { price: 227.16, ... }, ... }
    leaderboard: [],
    isLoading: true,

    // Action to fetch the initial leaderboard data
    fetchLeaderboard: async () => {
        try {
            const response = await getLeaderboard();
            set({ leaderboard: response.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
            set({ isLoading: false });
        }
    },

    // Action called by socketService to update live prices
    updatePricesFromSocket: (priceUpdates) => {
        set(state => {
            const updatedStocks = { ...state.featuredStocks };
            priceUpdates.forEach(stock => {
                updatedStocks[stock.symbol] = stock;
            });
            return { featuredStocks: updatedStocks };
        });
    },

    // Action called by socketService to update the live leaderboard
    updateLeaderboardFromSocket: (newLeaderboardData) => {
        set({ leaderboard: newLeaderboardData });
    }
}));