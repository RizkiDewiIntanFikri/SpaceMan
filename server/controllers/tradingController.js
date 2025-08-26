const TradingService = require('../services/tradingService');

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

            const executedTrade = await TradingService.executeTrade(tradeDetails);

            res.status(201).json({
                message: `${type.toUpperCase()} order executed successfully`,
                trade: executedTrade
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = { TradingController };