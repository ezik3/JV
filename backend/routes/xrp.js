const express = require('express');
const router = express.Router();
const xrpService = require('../xrpService');
 const stabilizer = require('../stabilizer');
// Get account info
router.get('/account/:address', async (req, res) => {
  try {
    const accountInfo = await xrpService.getAccountInfo(req.params.address);
    res.json(accountInfo);
  } catch (error) {
    console.error('Error fetching account info:', error);
    res.status(500).json({ error: 'Error fetching account info' });
  }
});

// Create token (this would typically be an admin-only operation)
router.post('/create-token', async (req, res) => {
  try {
    const { currency, value, receiver } = req.body;
    const issuer = process.env.XRP_ISSUER_ADDRESS;
    
    // In a real-world scenario, you'd want to add authentication and authorization here
    
    const result = await xrpService.createToken(issuer, currency, value, receiver);
    res.json(result);
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ error: 'Error creating token' });
  }
});

// Transfer token
router.post('/transfer', async (req, res) => {
  try {
    const { sender, receiver, currency, value } = req.body;
    const issuer = process.env.XRP_ISSUER_ADDRESS;
    
    // In a real-world scenario, you'd want to add authentication and authorization here
    
    const result = await xrpService.transferToken(sender, receiver, currency, value, issuer);
    res.json(result);
  } catch (error) {
    console.error('Error transferring token:', error);
    res.status(500).json({ error: 'Error transferring token' });
  }
});

module.exports = router;
   router.post('/create-stablecoin', async (req, res) => {
  try {
    const { receiver, amount } = req.body;
    const result = await xrpService.createStablecoin(receiver, amount);
    if (result.result && result.result.meta && result.result.meta.TransactionResult) {
      if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        res.json({ message: "Stablecoin created successfully", result });
      } else {
        res.status(400).json({ error: `Transaction failed: ${result.result.meta.TransactionResult}`, details: result });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response format', details: result });
    }
  } catch (error) {
    console.error('Error creating stablecoin:', error);
    res.status(500).json({ error: 'Error creating stablecoin', details: error.message });
  }
});

   router.post('/stabilize', async (req, res) => {
     try {
       await stabilizer.adjustSupply();
       res.json({ message: "Stabilization mechanism triggered" });
     } catch (error) {
       console.error('Error in stabilization:', error);
       res.status(500).json({ error: 'Error in stabilization' });
     }
   });
