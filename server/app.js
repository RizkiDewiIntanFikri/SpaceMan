require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 3000
const http = require("http")
const route = require("./routes/route")
const errorHandler = require("./middlewares/errorHandler")
const { Server } = require("socket.io")
const PriceUpdater = require("./jobs/priceUpdater")
const { verifyToken } = require("./utilities/utils")
const socketManager = require("./utilities/socketManager")

const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: "*" }
})

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
            socketManager.addUser(payload.userId, socket.id)
        } catch (error) {
            console.log("AUTHENTICATION ERROR IN SOCKET ===>", error);

        }
    })

    socket.on('disconnect', () => {
        socketManager.removeUser(socket.id);
        console.log('User disconnected:', socket.id);
    });
});

const priceUpdaterJob = new PriceUpdater(io);
priceUpdaterJob.start();

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})