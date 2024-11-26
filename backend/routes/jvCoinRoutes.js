const express = require('express');
const router = express.Router();
const jvCoinService = require('../jvCoinService');
const stripeService = require('../stripeService');
const User = require('../models/user');

router.post('/purchase', async (req, res) => {
  try {
    const { userId, amount, token } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!user.xrpAddress) {
      return res.status(400).json({ error: 'User XRP address not set' });
    }

    // Process payment
    await stripeService.processPayment(amount, token);

    // If payment successful, create JV Coins
    const result = await jvCoinService.purchaseJVCoin(userId, amount);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing JV Coin purchase:', error);
    res.status(500).json({ error: 'Failed to process purchase', message: error.message });
  }
});

router.get('/balance/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    res.json({ balance: user.jvCoinBalance });
  } catch (error) {
    console.error('Error fetching JV Coin balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

module.exports = router;