const express = require('express');
const router = express.Router();
const jvCoinService = require('../jvCoinService');

router.post('/purchase/fiat', async (req, res) => {
  try {
    const { userId, amount, token } = req.body;
    const result = await jvCoinService.purchaseWithFiat(userId, amount, token);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/purchase/crypto', async (req, res) => {
  try {
    const { userId, amount, cryptoType } = req.body;
    const result = await jvCoinService.purchaseWithCrypto(userId, amount, cryptoType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/rates', async (req, res) => {
  try {
    // Add exchange rate logic here
    const rates = {
      XRP: 1.0,
      BTC: 0.00004,
      ETH: 0.0006
    };
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;