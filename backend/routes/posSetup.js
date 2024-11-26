const express = require('express');
const router = express.Router();

router.get('/check-pos-setup/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    console.log('Checking POS setup for venue:', venueId);
    
    // For now, always return not setup to trigger the setup flow
    res.json({
      isSetup: false,
      message: 'POS needs setup'
    });
  } catch (error) {
    console.error('POS setup check error:', error);
    res.status(500).json({
      error: 'Failed to check POS setup'
    });
  }
});

module.exports = router;