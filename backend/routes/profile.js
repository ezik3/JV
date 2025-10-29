const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateJWT } = require('../utils/jwtUtils');

// Update username
router.post('/update-username', authenticateJWT, async (req, res) => {
  try {
    const { userId, username, showUsername } = req.body;
    console.log('Received update request:', { userId, username, showUsername });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        username,
        showUsername
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Username updated successfully for user:', userId);
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
  try {
    const { profilePic, userId } = req.body;
    console.log('=== PHOTO UPDATE START ===');
    console.log('Processing photo update for userId:', userId);
    console.log('Has profilePic:', !!profilePic);

    if (!profilePic) {
      console.log('ERROR: No profile picture provided');
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
      console.log('ERROR: User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Profile update SUCCESS');
    console.log('User isProfileComplete:', user.isProfileComplete);
    console.log('Returning response with success=true and isProfileComplete=', user.isProfileComplete);
    console.log('=== PHOTO UPDATE END ===');
    
    return res.json({ 
      success: true, 
      profilePicture: user.profilePicture,
      isProfileComplete: user.isProfileComplete
    });

  } catch (error) {
    console.error('=== PHOTO UPDATE ERROR ===');
    console.error('Error updating profile picture:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile picture',
      details: error.message 
    });
  }
});

module.exports = router;
