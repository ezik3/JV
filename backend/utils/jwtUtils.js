const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      venueId: user.role === 'venue' ? user._id : undefined
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } else {
      res.status(401).json({ error: 'Authentication required' });
    }
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { generateJWT, authenticateJWT };
