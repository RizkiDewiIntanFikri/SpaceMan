PortfolioService = require('../services/portfolioServices');
socketManager = require('../utilities/socketManager');

const PortfolioService = require('../services/portfolioServices');
const { TradingServices } = require('../services/tradingServices');
const socketManager = require('../utilities/socketManager');

class TradingController {
    static async placeOrder(req, res, next) {
        try {
            // The user's ID comes from the authentication middleware
            const userId = req.user.id;
            const { symbol, quantity, type } = req.body;

            // Basic validation
            if (!symbol || !quantity || !type) {
                throw new Error("MISSING_TRADE_DETAILS");
            }

            const tradeDetails = {
                userId,
                symbol: symbol.toUpperCase(),
                quantity: parseInt(quantity, 10),
                type: type.toUpperCase()
            };

            const executedTrade = await TradingServices.executeTrade(tradeDetails);

            res.status(201).json({
                message: `${type.toUpperCase()} order executed successfully`,
                trade: executedTrade
            });

        } catch (error) {
            next(error);
        }
    }
    static async getHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const history = await TradingServices.getTradeHistory(userId);
            res.status(200).json(history);
        } catch (error) {
            next(error);
        }
    }

    // ! IMPORTANT : THIS PART FOR REALTIME SOCKET STUFFS

    static initialize(socketIoInstance) {
        io = socketIoInstance;
        console.log("Socket.IO instance initialized in TradingController");
    }

}

module.exports = { TradingController };