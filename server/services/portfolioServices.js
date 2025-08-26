const { User, Portfolio, Holding, Stock } = require('../models');

class PortfolioService {

    static async getPortfolio(userId) {
        const user = await User.findByPk(userId, {
            // We only need these specific attributes from the User model
            attributes: ['id', 'username', 'cashBalance', 'portfolioValue'],
            // Eager load the related models
            include: {
                model: Portfolio,
                include: {
                    model: Holding,
                    as: 'Holdings', // This 'as' must match the alias in your Portfolio model association
                    attributes: ['quantity', 'avgPrice'],
                    include: {
                        model: Stock,
                        // We don't need all stock data, just these fields
                        attributes: ['symbol', 'name', 'price']
                    }
                }
            }
        });

        if (!user || !user.Portfolio) {
            throw new Error("PORTFOLIO_NOT_FOUND");
        }

        // The data from Sequelize is nested. Let's format it into a clean object for the frontend.
        const formattedPortfolio = {
            userId: user.id,
            username: user.username,
            cashBalance: user.cashBalance,
            holdingsValue: 0,
            totalValue: user.portfolioValue,
            Holdings: user.Portfolio.Holdings.map(holding => {
                const marketValue = holding.quantity * holding.Stock.price;
                return {
                    symbol: holding.Stock.symbol,
                    name: holding.Stock.name,
                    quantity: holding.quantity,
                    avgPrice: holding.avgPrice,
                    currentPrice: holding.Stock.price,
                    marketValue: marketValue
                };
            })
        };

        // Calculate the total value of all stock Holdings
        formattedPortfolio.holdingsValue = formattedPortfolio.Holdings.reduce((total, holding) => total + holding.marketValue, 0);

        return formattedPortfolio;
    }
}

module.exports = PortfolioService;