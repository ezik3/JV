const User = require('../models/user');

class VenueService {
  async getAllVenues() {
    try {
      const venues = await User.find({ 
        role: 'venue',
        isVenueVerified: true,
        verificationStatus: 'approved'
      }).select('venueName venueType address country latitude longitude businessEmail');
      
      return venues;
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  }

  async getRecentVenues(limit = 10) {
    try {
      const venues = await User.find({
        role: 'venue',
        isVenueVerified: true,
        verificationStatus: 'approved'
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('venueName venueType address');
      
      return venues;
    } catch (error) {
      console.error('Error fetching recent venues:', error);
      throw error;
    }
  }
}

module.exports = new VenueService();