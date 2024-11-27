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
  console.log('Photo upload endpoint hit:', { userId, profilePic });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePic },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Updated user:', updatedUser);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile photo update error:', error);
    res.status(500).json({ error: 'Failed to update profile photo' });
  }
});

module.exports = router;