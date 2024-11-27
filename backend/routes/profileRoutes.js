const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get the existing User model
const User = mongoose.model('User');

router.post('/update-username', async (req, res) => {
  const { userId, username, showUsername } = req.body;
  console.log('Received update request:', { userId, username, showUsername });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, showUsername },
      { new: true }
    );
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/update-photo', async (req, res) => {
  const { userId, profilePic } = req.body;
  try {
    // Add console.log to track the request
    console.log('Processing photo update:', { userId, profilePic: !!profilePic });
    
    // Here you would update the user in your database
    // For now, sending success response
    res.json({ 
      success: true, 
      message: 'Profile photo updated successfully',
      user: { userId, profilePic }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;