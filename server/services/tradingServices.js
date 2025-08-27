const { User, Portfolio, Holding, Trade, Stock, sequelize } = require('../models');
const { MarketDataService } = require('../services/marketData');
const socketManager = require('../utilities/socketManager');

class TradingServices {
    static async executeTrade({ userId, symbol, quantity, type }) {
        const t = await sequelize.transaction()
        try {
            // 1. Fetch current market price for the stock
            const stockQuote = await MarketDataService.fetchStockQuote(symbol);
            if (!stockQuote) {
                throw new Error("STOCK_NOT_FOUND");
            }
            const currentPrice = stockQuote.price;
            const totalCost = quantity * currentPrice;

            const [stock, created] = await Stock.findOrCreate({
                where: { symbol: stockQuote.symbol },
                defaults: {
                    symbol: stockQuote.symbol,
                    name: "Loading...", // Use a temporary name
                    price: stockQuote.price
                },
                transaction: t
            });

            // If a new stock record was just created, fetch its real name.
            if (created) {
                const companyName = await MarketDataService.fetchStockName(stock.symbol);
                if (companyName) {
                    stock.name = companyName;
                    await stock.save({ transaction: t }); // Save the updated name
                }
            }

            // 2. Get the user and their portfolio, and lock the rows for this transaction
            // to prevent race conditions (e.g., user trying to place two trades at once).
            const user = await User.findByPk(userId, { transaction: t, lock: t.LOCK.UPDATE });
            const portfolio = await Portfolio.findOne({ where: { userId: user.id }, transaction: t });

            let tradeRecord;

            if (type.toUpperCase() === 'BUY') {
                // --- BUY LOGIC ---
                if (user.cashBalance < totalCost) {
                    throw new Error("INSUFFICIENT_FUNDS");
                }

                // Update user's cash
                user.cashBalance = parseFloat(user.cashBalance) - totalCost;
                await user.save({ transaction: t });

                // Find or create the holding for this stock
                let holding = await Holding.findOne({ where: { portfolioId: portfolio.id, symbol: symbol }, transaction: t });

                if (holding) {
                    // Update existing holding: recalculate average price
                    const existingValue = holding.quantity * holding.avgPrice;
                    const newValue = quantity * currentPrice;
                    holding.avgPrice = (existingValue + newValue) / (holding.quantity + quantity);
                    holding.quantity += quantity;
                    await holding.save({ transaction: t });
                } else {
                    // Create new holding
                    await Holding.create({
                        portfolioId: portfolio.id,
                        symbol: symbol,
                        quantity: quantity,
                        avgPrice: currentPrice
                    }, { transaction: t });
                }

            } else if (type.toUpperCase() === 'SELL') {
                // --- SELL LOGIC ---
                const holding = await Holding.findOne({ where: { portfolioId: portfolio.id, symbol: symbol }, transaction: t });

                if (!holding || holding.quantity < quantity) {
                    throw new Error("INSUFFICIENT_SHARES");
                }

                // Update user's cash
                user.cashBalance = parseFloat(user.cashBalance) + totalCost;
                await user.save({ transaction: t });

                // Decrease holding quantity or delete if all shares are sold
                holding.quantity -= quantity;
                if (holding.quantity === 0) {
                    await holding.destroy({ transaction: t });
                } else {
                    await holding.save({ transaction: t });
                }

            } else {
                throw new Error("INVALID_TRADE_TYPE");
            }

            // 3. Create a record of the trade
            tradeRecord = await Trade.create({
                userId,
                symbol,
                type: type.toUpperCase(),
                quantity,
                price: currentPrice,
                total: totalCost
            }, { transaction: t });

            // 4. If all steps succeed, commit the transaction
            await t.commit();

            // ! REAL-TIME LOGIC
            const socketId = socketManager.getSocketId(userId)

            if (socketId) {
                console.log(`User ${userId} is online. Sending portfolio update to socket ${socketId}.`);
                // Fetch the user's brand new portfolio state
                const updatedPortfolio = await PortfolioService.getPortfolio(userId);
                // Emit the event directly and only to that user's socket
                io.to(socketId).emit('portfolio-updated', updatedPortfolio);
            }

            return tradeRecord;

        } catch (error) {
            // If any step fails, roll back all database changes
            await t.rollback();
            // Re-throw the error to be handled by the controller and errorHandler
            throw error;
        }
    }

    static async getTradeHistory(userId) {
        const trades = await Trade.findAll({
            where: { userId: userId },
            // Order by the most recent trades first
            order: [['timestamp', 'DESC']],
            // We don't need the full user or stock object, just the symbol
            attributes: ['id', 'symbol', 'type', 'quantity', 'price', 'total', 'timestamp']
        });

        return trades;
    }
}

module.exports = { TradingServices }