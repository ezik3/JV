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
    console.log('=== PHOTO UPDATE START ===');
    console.log('Processing photo update for userId:', userId);
    console.log('Has profilePic:', !!profilePic);

    if (!profilePic) {
      console.log('ERROR: No profile picture provided');
      return res.status(400).json({ error: 'No profile picture provided' });
    }

    // ACTUALLY UPDATE THE DATABASE
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        profilePicture: profilePic,
        isProfileComplete: true  // SET THIS TO TRUE
      },
      { new: true }
    );

    if (!user) {
      console.log('ERROR: User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Profile update SUCCESS');
    console.log('User isProfileComplete:', user.isProfileComplete);
    console.log('=== PHOTO UPDATE END ===');
    
    // RETURN isProfileComplete IN THE RESPONSE
    res.json({ 
      success: true, 
      message: 'Profile photo updated successfully',
      profilePicture: user.profilePicture,
      isProfileComplete: user.isProfileComplete  // RETURN THIS
    });
  } catch (error) {
    console.error('=== PHOTO UPDATE ERROR ===');
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
