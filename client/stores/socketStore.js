import { create } from "zustand";

export const useSocketStore = create((set, get) => ({
  aiMessages: [],
  socket: null,
  status: "Disconnected",
  setSocket: (socket) => set({ socket }),
  setStatus: (status) => set({ status }),
  addAiMessage: (msg) =>
    set((state) => ({ aiMessages: [...state.aiMessages, msg] })),
  resetChat: () => set({ aiMessages: [] }),
}));
