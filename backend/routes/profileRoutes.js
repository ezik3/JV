const express = require('express');
const router = express.Router();
const User = require('../models/user');  // Adjust path if needed
const { authenticateJWT } = require('../utils/jwtUtils');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Update username
router.post('/update-username', async (req, res) => {
  try {
    const { username, showUsername } = req.body;
    const userId = req.user.id;  // From JWT token

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

    // Add this line to send a proper JSON response
    res.json({ success: true, message: 'Username updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Update profile photo
router.post('/update-photo', async (req, res) => {
  try {
    const { userId, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        profilePic,
        isProfileComplete: true 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      profilePicture: profilePic
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
