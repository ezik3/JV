const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  }
});

// Compound index to prevent duplicate friendships and optimize queries
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
friendSchema.index({ userId: 1, status: 1 });
friendSchema.index({ friendId: 1, status: 1 });

// Helper method to check if two users are friends
friendSchema.statics.areFriends = async function(userId1, userId2) {
  const friendship = await this.findOne({
    $or: [
      { userId: userId1, friendId: userId2, status: 'accepted' },
      { userId: userId2, friendId: userId1, status: 'accepted' }
    ]
  });
  return !!friendship;
};

// Get all friends for a user
friendSchema.statics.getFriends = async function(userId) {
  const friendships = await this.find({
    $or: [
      { userId: userId, status: 'accepted' },
      { friendId: userId, status: 'accepted' }
    ]
  });

  // Extract friend IDs
  return friendships.map(f => 
    f.userId.toString() === userId.toString() ? f.friendId : f.userId
  );
};

module.exports = mongoose.model('Friend', friendSchema);
