require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const route = require("./routes/route");
const {askGemini} = require("./utilities/askGemini");
const errorHandler = require("./middlewares/errorHandler");
const { Server } = require("socket.io");
const PriceUpdater = require("./jobs/priceUpdater");
const { verifyToken } = require("./utilities/utils");
const socketManager = require("./utilities/socketManager");
const { TradingServices } = require("./services/tradingServices");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


TradingServices.initialize(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);
app.use(errorHandler);

async function safeAskGemini(prompt) {
  try {
    const result = await askGemini(prompt); // askGemini() sudah await generateContent
    return result; // sudah berupa teks
  } catch (err) {
    if (err.status === 503) {
      return "AI sedang sibuk, coba lagi sebentar.";
    }
    throw err;
  }
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("authenticate", (token) => {
    try {
      if (!token) {
        console.log("No token provided for socket:", socket.id);
        return;
      }
      const payload = verifyToken(token);
      socketManager.addUser(payload.userId, socket.id);
    } catch (error) {
      console.log("AUTHENTICATION ERROR IN SOCKET ===>", error);
    }
  });

  socket.on("askAI", async (question) => {
    console.log("User asked:", question); // <-- cek prompt user

    try {
      const answer = await safeAskGemini(question);
      console.log("Gemini replied:", answer); // <-- cek jawaban AI
      socket.emit("aiMessage", answer);
    } catch (err) {
      console.log("Gemini error:", err.message || err);
      socket.emit(
        "aiMessage",
        "AI sedang sibuk atau tidak tersedia. Silakan coba beberapa saat lagi."
      );
    }
  });

  socket.on("disconnect", () => {
    socketManager.removeUser(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

// price updater job
const priceUpdaterJob = new PriceUpdater(io);
if (process.env.RUN_PRICE_UPDATER === "true") {
  priceUpdaterJob.start();
} else {
  console.log(
    "Price updater job is disabled. Set RUN_PRICE_UPDATER=true in .env to enable."
  );
}

// start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
