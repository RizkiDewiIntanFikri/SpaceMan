const axios = require('axios'); // We need axios to make HTTP requests
const { Stock } = require("../models");
const PortfolioService = require("../services/portfolioServices"); // Corrected path based on your code
const { LeaderboardService } = require("../services/leaderboardServices"); // Corrected path based on your code

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
// You have correctly reduced the number of stocks to stay within limits
const FEATURED_STOCKS = ['AAPL', 'GOOGL', 'AMZN'];

class PriceUpdater {

    constructor(io) {
        this.io = io;
        this.interval = null;
    }

    start() {
        this.updatePrices();
        this.interval = setInterval(() => this.updatePrices(), 15000);
        console.log('Price updater job started (using Finnhub). Fetching every 30 seconds.');
    }

    async updatePrices() {
        console.log('Fetching latest prices from Finnhub for featured stocks...');
        const priceUpdates = [];

        for (const symbol of FEATURED_STOCKS) {
            try {
                // ! CHANGE THE PRICE UPDATE USING FINNHUB
                const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
                const response = await axios.get(url);
                const quoteData = response.data;

                // Finnhub returns price 'c' (current), change 'd', and percent change 'dp'
                if (quoteData && quoteData.c > 0) {
                    const formattedQuote = {
                        symbol: symbol,
                        price: quoteData.c,
                        change: quoteData.d,
                        changePercent: quoteData.dp,
                    };

                    priceUpdates.push(formattedQuote);
                    await Stock.update({ price: formattedQuote.price }, { where: { symbol: symbol } });

                    console.log(`Raw Finnhub Response for ${symbol}:`, response.data);
                }

            } catch (error) {
                console.error(`Failed to fetch price for ${symbol} from Finnhub:`, error.message);
            }
        }

        if (priceUpdates.length > 0) {
            this.io.emit('price-update', priceUpdates);
            console.log('Broadcasted price updates to all clients.');

            try {
                await PortfolioService.recalculateAllPortfolios();
                const newLeaderboard = await LeaderboardService.getLeaderboard();
                this.io.emit('leaderboard-update', newLeaderboard);
                console.log('Broadcasted leaderboard updates to all clients.'); // Added a confirmation log
            } catch (error) {
                console.log("Failed to broadcast leaderboard", error);
            }
        }
    }

    stop() {
        clearInterval(this.interval);
        console.log('Price updater job stopped.');
    }
}

module.exports = PriceUpdater;