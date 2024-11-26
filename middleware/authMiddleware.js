   const rateLimit = require('express-rate-limit');
   const User = require('../models/user');

   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // Limit each IP to 5 login requests per window
     message: 'Too many login attempts, please try again after 15 minutes',
     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
   });

   const lockoutMiddleware = async (req, res, next) => {
     const { email } = req.body;
     const user = await User.findOne({ email });
     
     if (user && user.lockUntil && user.lockUntil > Date.now()) {
       return res.status(423).json({ error: 'Account is locked. Try again later.' });
     }
     
     next();
   };

   module.exports = { loginLimiter, lockoutMiddleware };
