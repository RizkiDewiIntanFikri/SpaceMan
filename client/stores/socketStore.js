import { create } from "zustand";

export const useSocketStore = create((set) => ({
  socket: null,
  status: "Disconnected",
  aiMessages: [],
  setSocket: (socket) => set({ socket }),
  setStatus: (status) => set({ status }),
  addAiMessage: (msg) =>
    set((state) => ({ aiMessages: [...state.aiMessages, msg] })),
}));
