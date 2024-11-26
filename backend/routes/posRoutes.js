const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../utils/jwtUtils');
const POSMaster = require('../models/POSMaster');

// Check if master setup exists
router.get('/check-master-setup/:venueId', authenticateJWT, async (req, res) => {
  try {
    const master = await POSMaster.findOne({ venueId: req.params.venueId });
    res.json({ isMasterSetup: !!master });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check master setup' });
  }
});

// Setup master account
router.post('/setup-master', authenticateJWT, async (req, res) => {
  try {
    const { venueId, username, password, pin } = req.body;

    // Check if master already exists
    const existingMaster = await POSMaster.findOne({ venueId });
    if (existingMaster) {
      return res.status(400).json({ error: 'Master account already exists' });
    }

    // Create new master account
    const master = new POSMaster({
      venueId,
      username,
      password, // Remember to hash this
      pin, // Remember to hash this
      isActive: true
    });

    await master.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create master account' });
  }
});

module.exports = router;
