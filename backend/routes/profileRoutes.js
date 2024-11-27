const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get the existing User model instead of creating a new one
const User = mongoose.model('User');

router.post('/update-username', async (req, res) => {
  const { userId, username, showUsername } = req.body;
  console.log('Received update request:', { userId, username, showUsername });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { username, showUsername },
      { new: true }
    );
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
module.exports = router;