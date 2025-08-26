const express = require("express")
const { UserController } = require("../controllers/userController")
const { StockController } = require("../controllers/stockController")
const auth = require("../middlewares/auth")
const { TradingController } = require("../controllers/tradingController")
const { PortfolioController } = require("../controllers/portfolioController")
const route = express.Router()

route.get('/trades', auth, TradingController.getHistory);
route.post('/trades', auth, TradingController.placeOrder);
route.get('/portfolio', auth, PortfolioController.getPortfolio);
route.post("/register", UserController.register)
route.get("/stocks/:symbol", auth, StockController.getStockQuote)

module.exports = route