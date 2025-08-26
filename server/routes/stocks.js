// server/routes/stocks.js
const express = require("express");
const { getStockPrice } = require("../services/marketDataService");

const router = express.Router();

router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const result = await getStockPrice(symbol);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;   