const axios = require('axios');

const API_KEY = process.env.ALPHA_VANTAGE_API;
const BASE_URL = 'https://www.alphavantage.co/query';

class MarketDataService {
    static async fetchStockQuote(symbol) {
        try {
            const params = {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: API_KEY,
            };

            const response = await axios.get(BASE_URL, { params });
            console.log(params);
            // console.log(API_KEY);
            console.log('Raw Alpha Vantage Response:', response.data);
            const quoteData = response.data['Global Quote'];

            // If the API returns an empty object, it means the symbol is invalid.
            if (!quoteData || Object.keys(quoteData).length === 0) {
                // Throw a specific error that our errorHandler will recognize.
                throw new Error("STOCK_NOT_FOUND");
            }

            // Format the response into a clean object.
            const formattedQuote = {
                symbol: quoteData['01. symbol'],
                price: parseFloat(quoteData['05. price']),
                change: parseFloat(quoteData['09. change']),
                changePercent: parseFloat(quoteData['10. change percent'].replace('%', '')),
                volume: parseInt(quoteData['06. volume'], 10)
            };

            return formattedQuote;

        } catch (error) {
            // If the error is the one we threw, just re-throw it for the controller.
            if (error.message === "STOCK_NOT_FOUND") {
                throw error;
            }
            // If it's a different error (e.g., network issue, API key invalid),
            // wrap it in a generic API error.
            console.error('Alpha Vantage API Error:', error.message);
            throw new Error("ALPHA_VANTAGE_API_ERROR");
        }
    }

    static async fetchStockName(symbol) {
        try {
            const params = {
                function: 'SYMBOL_SEARCH',
                keywords: symbol,
                apikey: API_KEY,
            };

            const response = await axios.get(BASE_URL, { params });
            const matches = response.data.bestMatches;

            if (!matches || matches.length === 0) {
                return null;
            }

            // Find the exact match from the search results
            const exactMatch = matches.find(match => match['1. symbol'] === symbol);

            if (exactMatch) {
                return exactMatch['2. name']; // Return the company name
            }

            return null;

        } catch (error) {
            console.error('Alpha Vantage Symbol Search Error:', error.message);
            return null;
        }
    }

}

module.exports = { MarketDataService };