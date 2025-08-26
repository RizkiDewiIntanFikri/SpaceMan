const express = require("express")
const { UserController } = require("../controllers/userController")
const { StockController } = require("../controllers/stockController")
const route = express.Router()

route.post("/register", UserController.register)
route.get("/stocks/:symbol", StockController.getStockQuote)

module.exports = route