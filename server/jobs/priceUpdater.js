const { MarketDataService } = require("../services/marketData");
const { Stock } = require("../models");
const PortfolioService = require("../services/portfolioServices");
const { LeaderboardService } = require("../services/leaderboardServices");

const FEATURED_STOCKS = ['AAPL', 'GOOGL', 'AMZN']

class PriceUpdater {

    constructor(io) {
        this.io = io;
        this.interval = null;
    }

    start() {
        // Run the update immediately when the server starts
        this.updatePrices();

        // Then, run it again every 30 seconds (30000 milliseconds)
        this.interval = setInterval(() => this.updatePrices(), 30000);
        console.log('Price updater job started. Fetching every 30 seconds.');
    }
    async updatePrices() {
        console.log('Fetching latest prices for featured stocks...');
        const priceUpdates = [];

        for (const symbol of FEATURED_STOCKS) {
            try {
                const quote = await MarketDataService.fetchStockQuote(symbol);
                if (quote) {
                    priceUpdates.push(quote);
                    // Also update the price in our own database
                    await Stock.update({ price: quote.price }, { where: { symbol: symbol } });
                }
            } catch (error) {
                console.error(`Failed to fetch price for ${symbol}:`, error.message);
            }
        }

        if (priceUpdates.length > 0) {
            // This is the key part: broadcast the updates to ALL connected clients.
            // The event name 'price-update' can be listened for on the frontend.
            this.io.emit('price-update', priceUpdates);
            console.log('Broadcasted price updates to all clients.');
            //UPDATE LEADERBOARD
            try {
                await PortfolioService.recalculateAllPortfolios();
                const newLeaderboard = await LeaderboardService.getLeaderboard();
                this.io.emit('leaderboard-update', newLeaderboard);
            } catch (error) {
                console.log("Failed to broadcast leaderboard", error);

            }
        }
    }

    /**
     * Stops the background job.
     */
    stop() {
        clearInterval(this.interval);
        console.log('Price updater job stopped.');
    }

}

module.exports = PriceUpdater;