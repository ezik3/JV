const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const User = require('../models/user');
const { generateJWT, authenticateJWT } = require('../utils/jwtUtils');
const faceRecognitionService = require('../services/faceRecognitionService');
const { loginLimiter, lockoutMiddleware } = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendVerificationSMS } = require('../services/notificationService');

const formatPhoneNumber = (phone) => {
  if (phone.startsWith('+')) return phone;
  if (phone.startsWith('0')) return `+61${phone.substring(1)}`;
  return `+61${phone}`;
};

router.post('/create-user', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    res.json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      setupTOTP,
      phone,
      fullName
    } = req.body;
    console.log('Registering end-user:', { username: fullName || username, email });
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedPhone = formatPhoneNumber(phone);

    const user = new User({
      username: username || fullName,
      email,
      password,
      role: 'user',
      phone: formattedPhone,
      emailVerificationCode,
      phoneVerificationCode,
      isProfileComplete: false
    });
    await user.save();
    console.log('End-user saved:', user.toObject());

    let totpData = null;
    if (setupTOTP) {
      const { secret, otpauth_url } = authService.generateTOTP();
      user.totpSecret = secret;
      await user.save();
      const qrCode = await authService.generateQRCode(otpauth_url);
      totpData = { secret, qrCode };
    }

    const token = generateJWT(user);

    try {
      await sendVerificationEmail(user.email, emailVerificationCode);
      console.log('Verification email sent');
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    try {
      await sendVerificationSMS(formattedPhone, phoneVerificationCode);
      console.log('Verification SMS sent');
    } catch (smsError) {
      console.error('Error sending verification SMS:', smsError);
    }

    res.json({
      message: 'User registered successfully. Please complete your profile setup.',
      userId: user._id.toString(),
      role: user.role,
      token,
      totpData,
      nextStep: '/profile-setup'
    });
  } catch (error) {
    console.error('End-user registration error:', error);
    res.status(400).json({ error: 'Failed to register user', details: error.message });
  }
});

router.post('/register-venue', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      setupTOTP,
      venueName,
      venueType,
      address,
      country,
      latitude,
      longitude,
      verificationDocuments,
      phone,
      businessEmail,
      businessLicense,
      fullName
    } = req.body;

    console.log('Registering venue:', { venueName, email });
    
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedPhone = formatPhoneNumber(phone);

    const venue = new User({
      username: username || fullName,
      email,
      password,
      role: 'venue',
      phone: formattedPhone,
      emailVerificationCode,
      phoneVerificationCode,
      venueName,
      venueType,
      address,
      country,
      latitude,
      longitude,
      verificationDocuments,
      businessEmail,
      businessLicense,
      isVenueVerified: false,
      verificationStatus: 'pending',
      isProfileComplete: false
    });

    await venue.save();
    console.log('Venue saved:', venue.toObject());

    let totpData = null;
    if (setupTOTP) {
      const { secret, otpauth_url } = authService.generateTOTP();
      venue.totpSecret = secret;
      await venue.save();
      const qrCode = await authService.generateQRCode(otpauth_url);
      totpData = { secret, qrCode };
    }

    const token = generateJWT(venue);

    try {
      await sendVerificationEmail(venue.email, emailVerificationCode);
      console.log('Verification email sent');
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    try {
      await sendVerificationSMS(formattedPhone, phoneVerificationCode);
      console.log('Verification SMS sent');
    } catch (smsError) {
      console.error('Error sending verification SMS:', smsError);
    }

    res.json({
      message: 'Venue registered successfully. Please complete your profile setup.',
      userId: venue._id.toString(),
      role: venue.role,
      token,
      verificationStatus: venue.verificationStatus,
      totpData,
      nextStep: '/profile-setup'
    });
  } catch (error) {
    console.error('Venue registration error:', error);
    res.status(400).json({ error: 'Failed to register venue', details: error.message });
  }
});

router.post('/login', loginLimiter, lockoutMiddleware, async (req, res) => {
  try {
    const { email, password, totpToken } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.isTOTPEnabled) {
      if (!totpToken) {
        return res.status(400).json({ error: 'TOTP token required' });
      }

      const isValidTOTP = authService.verifyTOTP(user.totpSecret, totpToken);
      if (!isValidTOTP) {
        return res.status(401).json({ error: 'Invalid TOTP token' });
      }
    }

    user.loginAttempts = 0;
    await user.save();
    const token = generateJWT(user);

    // Determine the next step based on profile completion and role
    const nextStep = !user.isProfileComplete ? '/profile-setup' : 
                    user.role === 'venue' ? '/venue-feed' : 
                    user.role === 'admin' ? '/admin/dashboard' : 
                    '/party-feed';
    
    res.json({ 
      token, 
      userId: user._id, 
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      venueName: user.role === 'venue' ? user.venueName : undefined,
      verificationStatus: user.role === 'venue' ? user.verificationStatus : undefined,
      nextStep
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/verify-face', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user;
    const { faceImage } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.faceEnabled) {
      return res.status(400).json({ error: 'Face recognition not enabled for this user' });
    }
    const isMatch = await faceRecognitionService.compareFaces(user.faceEmbedding, faceImage);
    if (!isMatch) {
      return res.status(401).json({ error: 'Face verification failed' });
    }
    res.json({ message: 'Face verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Face verification failed' });
  }
});

router.post('/setup-face', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user;
    const { faceImage } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const faceEmbedding = await faceRecognitionService.generateEmbedding(faceImage);
    user.faceEmbedding = faceEmbedding;
    user.faceEnabled = true;
    await user.save();
    res.json({ message: 'Face recognition setup successful' });
  } catch (error) {
    res.status(500).json({ error: 'Face recognition setup failed' });
  }
});

router.post('/setup-totp', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { secret, otpauth_url } = authService.generateTOTP();
    user.totpSecret = secret;
    user.isTOTPEnabled = true;
    await user.save();
    const qrCode = await authService.generateQRCode(otpauth_url);
    res.json({ secret, qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup TOTP' });
  }
});

router.post('/verify-totp', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user;
    const { token } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isValid = authService.verifyTOTP(user.totpSecret, token);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid TOTP token' });
    }
    res.json({ message: 'TOTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'TOTP verification failed' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findOne({ emailVerificationCode: verificationCode });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.emailVerificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email', details: error.message });
  }
});

router.post('/verify-phone', async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findOne({ phoneVerificationCode: verificationCode });
    console.log('User found:', user);
    console.log('Stored verification code:', user?.phoneVerificationCode);
    console.log('Received verification code:', verificationCode);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.phoneVerificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    await user.save();
    res.json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Failed to verify phone number' });
  }
});

router.get('/check-profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      isProfileComplete: user.isProfileComplete,
      profileData: {
        username: user.username,
        showUsername: user.showUsername,
        profilePicture: user.profilePicture
      },
      nextStep: !user.isProfileComplete ? '/profile-setup' : 
                user.role === 'venue' ? '/venue-feed' : 
                '/party-feed'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check profile status' });
  }
});

router.post('/complete-profile', authenticateJWT, async (req, res) => {
  try {
    const { userId, username, showUsername, profilePic } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username;
    user.showUsername = showUsername;
    user.profilePicture = profilePic;
    user.isProfileComplete = true;
    
    await user.save();

    const nextStep = user.role === 'venue' ? '/venue-feed' : '/party-feed';

    res.json({ 
      success: true, 
      message: 'Profile setup completed successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        profilePicture: user.profilePicture
      },
      nextStep
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ error: 'Failed to complete profile setup' });
  }
});

router.post('/send-venue-verification-email', async (req, res) => {
  try {
    const { email, venueId } = req.body;
    const venue = await User.findOne({ _id: venueId, role: 'venue' });
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    await sendVerificationEmail(email, venue.emailVerificationCode);
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error sending venue verification email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

router.post('/send-venue-verification-sms', async (req, res) => {
  try {
    const { phone, venueId } = req.body;
    const venue = await User.findOne({ _id: venueId, role: 'venue' });
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    await sendVerificationSMS(phone, venue.phoneVerificationCode);
    res.json({ message: 'Verification SMS sent successfully' });
  } catch (error) {
    console.error('Error sending venue verification SMS:', error);
    res.status(500).json({ error: 'Failed to send verification SMS' });
  }
});

// Add this new route to get user data
router.get('/users/:userId', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      showUsername: user.showUsername
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;