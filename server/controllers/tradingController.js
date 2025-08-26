const { TradingServices } = require('../services/tradingServices');

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
}

module.exports = { TradingController };