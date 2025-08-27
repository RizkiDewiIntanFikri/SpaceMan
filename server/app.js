require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const env = require("./config/env")
const PORT = env.PORT
const http = require("http")
const route = require("./routes/route")
const errorHandler = require("./middlewares/errorHandler")
const { Server } = require("socket.io")
const PriceUpdater = require("./jobs/priceUpdater")
const { verifyToken } = require("./utilities/utils")
const socketManager = require("./utilities/socketManager")
const { TradingServices } = require("./services/tradingServices")

const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: "*" }
})

TradingServices.initialize(io);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(route)
app.use(errorHandler)

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('authenticate', (token) => {
        try {
            if (!token) {
                console.log('No token provided for socket:', socket.id);
                return;
            }
            const payload = verifyToken(token)
            socketManager.addUser(payload.id, socket.id)
            console.log("DEBUGGING HERE =========", payload);

        } catch (error) {
            console.log("AUTHENTICATION ERROR IN SOCKET ===>", error);

        }
    })

    socket.on('disconnect', () => {
        socketManager.removeUser(socket.id);
        console.log('User disconnected:', socket.id);
    });
});

//! SAFETY CHECK
const priceUpdaterJob = new PriceUpdater(io);
// Only start the job if the environment variable is set to 'true'
if (env.RUN_PRICE_UPDATER === 'true') {
    priceUpdaterJob.start();
} else {
    console.log('Price updater job is disabled. Set RUN_PRICE_UPDATER=true in .env to enable.');
}

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})