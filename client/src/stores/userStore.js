import { create } from 'zustand'

export const useUserStore = create((set) => ({
  username: null,
  token: null,
  isAuthenticated: false,
  register: (username) => set({ username, isAuthenticated: true }),
  logout: () => set({ username: null, token: null, isAuthenticated: false }),
}))
