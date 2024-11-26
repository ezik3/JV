const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  // Add other fields as needed
});

module.exports = mongoose.model('Venue', venueSchema);