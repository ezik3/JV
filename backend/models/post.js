const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  username: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: '/default-avatar.png'
  },
  image: {
    type: String
  },
  venue: {
    type: String
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  isGold: {
    type: Boolean,
    default: false
  },
  savedToProfile: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    },
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired posts
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Index for efficient querying
postSchema.index({ userId: 1, timestamp: -1 });
postSchema.index({ visibility: 1, expiresAt: 1 });
postSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('Post', postSchema);
