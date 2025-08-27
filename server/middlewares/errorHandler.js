const errorHandler = (err, req, res, next) => {
    console.log("ERROR IN HANDLER ===> ", err);
    let code = 500
    let message = "Internal Server Error"

    if (err.message === "VALIDATION_ERROR") {
        code = 400
        message = "Enter Username"
    } else if (err.message === "USER_ALREADY_EXISTS") {
        code = 409
        message = "Username already exists"
    } else if (err.message === "VALIDATION_ERROR_SYMBOL") {
        code = 400
        message = "Stock symbol is required"
    } else if (err.message === "STOCK_NOT_FOUND") {
        code = 404
        message = "Stock symbol not found"
    } else if (err.message === "ALPHA_VANTAGE_API_ERROR") {
        code = 503
        message = "Could not connect to the market data provider"
    } else if (err.message === "UNAUTHORIZED") {
        code = 403
        message = "You are unauthorized to do that"
    } else if (err.message === "INSUFFICIENT_FUNDS") {
        code = 400;
        message = "Insufficient funds to execute this trade.";
    } else if (err.message === "INSUFFICIENT_SHARES") {
        code = 400;
        message = "You do not own enough shares to sell.";
    } else if (err.message === "INVALID_TRADE_TYPE") {
        code = 400;
        message = "Invalid trade type. Must be 'BUY' or 'SELL'.";
    } else if (err.message === "MISSING_TRADE_DETAILS") {
        code = 400;
        message = "Missing required trade details (symbol, quantity, type).";
    } else if (err.message === "PORTFOLIO_NOT_FOUND") {
        code = 404;
        message = "Could not find a portfolio for this user.";
    }
    res.status(code).json({ error: message })
}

module.exports = errorHandler