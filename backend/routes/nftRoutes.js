
const express = require('express');
const router = express.Router();
const xrpService = require('../xrpService');

router.post('/purchase', async (req, res) => {
  try {
    const { cityId, amount, userWalletAddress } = req.body;

    // Verify JV Coin balance
    const hasBalance = await xrpService.verifyJVCoinBalance(userWalletAddress, amount);
    if (!hasBalance) {
      return res.status(400).json({ error: 'Insufficient JV Coins' });
    }

    // Mint the NFT
    const cityData = {
      cityId,
      name: `City ${cityId}`,
      purchaseDate: new Date().toISOString(),
      owner: userWalletAddress
    };

    const nftResult = await xrpService.mintNFT(cityData);

    res.json({
      success: true,
      message: 'NFT purchased successfully',
      nftId: nftResult.hash
    });
  } catch (error) {
    console.error('NFT purchase failed:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

module.exports = router;
