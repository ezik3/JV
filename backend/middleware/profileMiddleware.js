const User = require('../models/user');

const requireProfileComplete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.isProfileComplete) {
      return res.status(403).json({ 
        error: 'Profile incomplete', 
        redirectTo: '/profile-setup' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { requireProfileComplete };