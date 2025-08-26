const express = require("express")
const { UserController } = require("../controllers/userController")
const { StockController } = require("../controllers/stockController")
const auth = require("../middlewares/auth")
const { TradingController } = require("../controllers/tradingController")
const route = express.Router()

route.post("/register", UserController.register)
route.get("/stocks/:symbol", auth, StockController.getStockQuote)
route.post('/trades', auth, TradingController.placeOrder);

module.exports = route