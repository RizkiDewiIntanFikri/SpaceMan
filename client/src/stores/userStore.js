import { create } from 'zustand';
// 1. Import our real API service function
import { registerUser as registerUserApi } from '../services/apiService';

export const useUserStore = create((set) => ({
  username: null,
  // Initialize state from localStorage to keep the user logged in on refresh
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  // 2. Replace the fake register with the real one
  register: async (username) => {
    try {
      // Call the backend API
      const response = await registerUserApi(username);
      const { token, user } = response.data;

      // Save the real JWT to localStorage
      localStorage.setItem('access_token', token);
      // Update the state with real data
      set({ username: user.username, token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.error || error.message);
      return { success: false, message: error.response?.data?.error || "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ username: null, token: null, isAuthenticated: false });
  },
}));