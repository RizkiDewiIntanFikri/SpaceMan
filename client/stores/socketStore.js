import { create } from "zustand";

export const useSocketStore = create((set) => ({
  aiMessages: [],
  addAiMessage: (msg) =>
    set((state) => ({ aiMessages: [...state.aiMessages, msg] })),
  resetChat: () => set({ aiMessages: [] }),
  socket: null,
  setSocket: (s) => set({ socket: s }),
  status: "Disconnected",
  setStatus: (s) => set({ status: s }),
}));
