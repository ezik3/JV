const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateJWT } = require('../utils/jwtUtils');

// Update username
router.post('/update-username', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, showUsername } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        username,
        showUsername,
        isProfileComplete: true 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: {
        username: updatedUser.username,
        showUsername: updatedUser.showUsername,
        isProfileComplete: updatedUser.isProfileComplete
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/update-photo', authenticateJWT, async (req, res) => {
  console.log('Received photo update request');
  try {
    const { profilePic } = req.body;
    const userId = req.body.userId || req.user._id;

    if (!profilePic) {
      return res.status(400).json({ error: 'No profile picture provided' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        profilePicture: profilePic,
        isProfileComplete: true 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ 
      success: true, 
      profilePicture: user.profilePicture 
    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile picture',
      details: error.message 
    });
  }
});

module.exports = router;
