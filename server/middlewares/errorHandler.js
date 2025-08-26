const errorHandler = (err, req, res, next) => {
    console.log("ERROR IN HANDLER ===> ",err);
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
        code = 503 // Service Unavailable
        message = "Could not connect to the market data provider"
    }
    res.status(code).json({ error: message })
}

module.exports = errorHandler