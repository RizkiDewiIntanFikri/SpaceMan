import { registerPriceUpdates } from "./priceUpdates.js";

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

 
    registerPriceUpdates(socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
