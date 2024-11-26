const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendVerificationSMS } = require('./notificationService');

class VenueAuthService {
  async registerVenue(venueData) {
    try {
      // Generate verification codes
      const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create new venue user
      const venue = new User({
        username: venueData.username || venueData.fullName,
        email: venueData.email,
        password: venueData.password,
        role: 'venue',
        phone: venueData.phone,
        venueName: venueData.venueName,
        venueType: venueData.venueType,
        address: venueData.address,
        country: venueData.country,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        businessEmail: venueData.businessEmail,
        businessLicense: venueData.businessLicense,
        verificationDocuments: venueData.verificationDocuments || [],
        emailVerificationCode,
        phoneVerificationCode
      });

      await venue.save();

      // Send verification emails and SMS
      await sendVerificationEmail(venue.email, emailVerificationCode);
      await sendVerificationSMS(venue.phone, phoneVerificationCode);

      return {
        success: true,
        venue: {
          id: venue._id,
          venueName: venue.venueName,
          email: venue.email,
          role: venue.role,
          verificationStatus: venue.verificationStatus
        }
      };
    } catch (error) {
      console.error('Venue registration error:', error);
      throw new Error('Failed to register venue: ' + error.message);
    }
  }

  async loginVenue(email, password) {
    try {
      const venue = await User.findOne({ email, role: 'venue' });
      
      if (!venue) {
        throw new Error('Invalid credentials');
      }

      if (venue.isLocked()) {
        throw new Error('Account is locked. Please try again later.');
      }

      const isMatch = await venue.comparePassword(password);
      if (!isMatch) {
        venue.loginAttempts += 1;
        if (venue.loginAttempts >= 5) {
          venue.lockUntil = Date.now() + (15 * 60 * 1000); // Lock for 15 minutes
        }
        await venue.save();
        throw new Error('Invalid credentials');
      }

      // Reset login attempts on successful login
      venue.loginAttempts = 0;
      await venue.save();

      const token = jwt.sign(
        { id: venue._id, role: 'venue' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        venue: {
          id: venue._id,
          venueName: venue.venueName,
          email: venue.email,
          role: venue.role,
          verificationStatus: venue.verificationStatus
        }
      };
    } catch (error) {
      console.error('Venue login error:', error);
      throw new Error('Failed to login: ' + error.message);
    }
  }
}

module.exports = new VenueAuthService();