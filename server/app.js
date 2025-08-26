require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 3000
const http = require("http")
const route = require("./routes/route")
const errorHandler = require("./middlewares/errorHandler")
const { Server } = require("socket.io")

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

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})