import { create } from 'zustand';
// 1. Import our real API service function
import { getLeaderboard as getLeaderboardApi } from '../services/apiService';

export const useLeaderboardStore = create((set) => ({
  // 2. The state is now much simpler. It just holds the real players.
  players: [],
  isLoading: true,

  // 3. An action to fetch the initial leaderboard data from our backend
  fetchLeaderboard: async () => {
    try {
      set({ isLoading: true });
      const response = await getLeaderboardApi();
      // The backend sends an array of users with { username, portfolioValue }
      // We can add a placeholder avatar for the UI
      const playersWithAvatars = response.data.map((player, index) => ({
        ...player,
        id: player.username, // Use username as a unique key for React
        avatar: `https://i.pravatar.cc/48?img=${index + 1}`
      }));
      set({ players: playersWithAvatars, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      set({ isLoading: false });
    }
  },

  // 4. An action that our socketService will call with live updates
  updateLeaderboardFromSocket: (newLeaderboardData) => {
    const playersWithAvatars = newLeaderboardData.map((player, index) => ({
      ...player,
      id: player.username,
      avatar: `https://i.pravatar.cc/48?img=${index + 1}`
    }));
    set({ players: playersWithAvatars });
  }
}));