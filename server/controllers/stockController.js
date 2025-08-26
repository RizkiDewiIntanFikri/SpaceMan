const { MarketDataService } = require("../services/marketData");

class StockController {

    static async getStockQuote(req, res, next) {
        try {
            const { symbol } = req.params;
            if (!symbol) {
                throw new Error("VALIDATION_ERROR_SYMBOL"); // A new validation error type
            }
            const quote = await MarketDataService.fetchStockQuote(symbol.toUpperCase());
            res.status(200).json(quote);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}

module.exports = { StockController };