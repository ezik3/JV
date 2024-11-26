const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateJWT } = require('../utils/jwtUtils');

// Submit verification documents
router.post('/submit-verification', authenticateJWT, async (req, res) => {
  try {
    const { documents } = req.body;
    const user = await User.findById(req.user.id);

    if (user.role !== 'venue') {
      return res.status(403).json({ error: 'Only venue accounts can submit verification documents' });
    }

    user.verificationDocuments = documents;
    user.verificationStatus = 'pending';
    await user.save();

    res.json({ message: 'Verification documents submitted successfully', status: 'pending' });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({ error: 'Failed to submit verification documents' });
  }
});

// Check verification status
router.get('/verification-status', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role !== 'venue') {
      return res.status(403).json({ error: 'Only venue accounts can check verification status' });
    }

    res.json({
      status: user.verificationStatus,
      isVerified: user.isVenueVerified
    });
  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({ error: 'Failed to check verification status' });
  }
});

router.get('/stats', (req, res) => {
  const mockData = {
    visitorCount: 1000,
    currentOccupancy: 150,
    revenue: 5000,
    pushNotificationCredits: 100,
    jvCoinBalance: 500,
    newVisitors: 300,
    returningVisitors: 700,
    revenueByDay: [1000, 1200, 900, 1500, 2000, 1800, 1600],
  };

  res.json(mockData);
});

// Admin route to approve or reject venue verification
router.post('/admin/verify', authenticateJWT, async (req, res) => {
  try {
    const { userId, isApproved } = req.body;
    const adminUser = await User.findById(req.user.id);

    if (adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can verify venues' });
    }

    const venueUser = await User.findById(userId);
    if (!venueUser || venueUser.role !== 'venue') {
      return res.status(404).json({ error: 'Venue user not found' });
    }

    venueUser.isVenueVerified = isApproved;
    venueUser.verificationStatus = isApproved ? 'approved' : 'rejected';
    await venueUser.save();

    res.json({ message: `Venue ${isApproved ? 'approved' : 'rejected'} successfully` });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ error: 'Failed to process venue verification' });
  }
});

// Get pending venue verifications (admin only)
router.get('/admin/pending-venues', authenticateJWT, async (req, res) => {
    try {
      const adminUser = await User.findById(req.user.id);
  
      if (adminUser.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can access pending venues' });
      }
  
      const pendingVenues = await User.find({ 
        role: 'venue', 
        verificationStatus: 'pending' 
      }).select('venueName email address venueType');
  
      res.json(pendingVenues);
    } catch (error) {
      console.error('Fetch pending venues error:', error);
      res.status(500).json({ error: 'Failed to fetch pending venues' });
    }
  });

module.exports = router;