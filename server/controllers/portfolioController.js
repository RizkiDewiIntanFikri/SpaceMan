const PortfolioService = require('../services/portfolioServices');

class PortfolioController {
    static async getPortfolio(req, res, next) {
        try {

            const userId = req.user.id;
            const portfolio = await PortfolioService.getPortfolio(userId);
            res.status(200).json(portfolio);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { PortfolioController };