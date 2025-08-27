import { createContext, useContext, useEffect } from "react";
import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000");

const useTradingStore = create((set, get) => ({
  messages: [],
  history: {},
  loading: false,
  connected: false,

  addAiMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { role: "ai", text: msg }],
      loading: false,
    })),

  sendMessage: async (symbol) => {
    if (!symbol.trim()) return;

    set((state) => ({
      messages: [...state.messages, { role: "user", text: symbol }],
      loading: true,
    }));

    try {
      socket.emit("askAI", symbol);

      // ambil historical data Vantage (opsional)
      const res = await axios.get(
        `http://localhost:3000/api/trading/history/${symbol}`
      );
      set((state) => ({ history: { ...state.history, [symbol]: res.data } }));
    } catch (err) {
      set((state) => ({
        messages: [
          ...state.messages,
          { role: "ai", text: "Gagal mengambil data chart." },
        ],
        loading: false,
      }));
    }
  },

  checkConnection: () => set({ connected: socket.connected }),
}));

const TradingStoreContext = createContext();

export const TradingStoreProvider = ({ children }) => {
  const store = useTradingStore();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      store.checkConnection();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      store.checkConnection();
    });

    socket.on("aiMessage", (msg) => {
      store.addAiMessage(msg);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("aiMessage");
    };
  }, []);

  return (
    <TradingStoreContext.Provider value={store}>
      {children}
    </TradingStoreContext.Provider>
  );
};

export const useTrading = () => useContext(TradingStoreContext);
