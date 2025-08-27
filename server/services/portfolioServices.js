const { User, Portfolio, Holding, Stock, sequelize } = require('../models');

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

    static async recalculateAllPortfolios() {
        // This is a complex raw SQL query for efficiency. It joins all the necessary tables,
        // calculates the total value of all holdings for each user, and then updates
        // the user's portfolioValue by adding their cashBalance to their calculated holdingsValue.
        const query = `
            UPDATE "Users"
            SET "portfolioValue" = "cashBalance" + COALESCE(holdings_value, 0)
            FROM (
                SELECT
                    p."userId",
                    SUM(h.quantity * s.price) AS holdings_value
                FROM "Holdings" h
                JOIN "Stocks" s ON h.symbol = s.symbol
                JOIN "Portfolios" p ON h."portfolioId" = p.id
                GROUP BY p."userId"
            ) AS user_holdings
            WHERE "Users".id = user_holdings."userId";
        `;

        try {
            await sequelize.query(query);
            console.log('Successfully recalculated all user portfolio values.');
        } catch (error) {
            console.error('Error recalculating portfolio values:', error);
        }
    }
}

module.exports = PortfolioService;