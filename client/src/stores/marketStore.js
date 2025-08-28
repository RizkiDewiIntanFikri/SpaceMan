import { create } from 'zustand';
// 1. Import our real API service function
import { getLeaderboard } from '../services/apiService';

export const useMarketStore = create((set) => ({
  // 2. State will now be populated by our backend, not mock data
  featuredStocks: [], // This will now be an array of stock objects
  leaderboard: [],
  isLoading: true,

  // 3. Add an action to fetch the initial leaderboard
  fetchLeaderboard: async () => {
    try {
      const response = await getLeaderboard();
      set({ leaderboard: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      set({ isLoading: false });
    }
  },

  // 4. Add actions for socketService to call
  updatePricesFromSocket: (priceUpdates) => {
    // The backend sends an array, which we'll store directly
    set({ featuredStocks: priceUpdates });
  },

  updateLeaderboardFromSocket: (newLeaderboardData) => {
    set({ leaderboard: newLeaderboardData });
  }
}));