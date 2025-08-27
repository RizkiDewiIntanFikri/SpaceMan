import { create } from 'zustand';
import { registerUser as registerUserApi } from '../services/apiServices';

export const useUserStore = create((set) => ({
    username: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    register: async (username) => {
        try {
            const response = await registerUserApi(username);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            set({ username: user.username, token, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, message: error.response?.data?.error || "Registration failed" };
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ username: null, token: null, isAuthenticated: false });
    }
}));
