const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../utils/jwtUtils');
const Friend = require('../models/friend');
const User = require('../models/user');

// Send friend request
router.post('/request', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.body;

    // Check if friendship already exists
    const existing = await Friend.findOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: 'Friend request already exists or you are already friends' });
    }

    const friendship = new Friend({
      userId,
      friendId,
      status: 'pending'
    });

    await friendship.save();
    res.json({ message: 'Friend request sent', friendship });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Accept friend request
router.post('/accept/:friendshipId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendshipId } = req.params;

    const friendship = await Friend.findById(friendshipId);
    
    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Verify the request is for this user
    if (friendship.friendId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    friendship.status = 'accepted';
    friendship.acceptedAt = new Date();
    await friendship.save();

    res.json({ message: 'Friend request accepted', friendship });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Get user's friends
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendIds = await Friend.getFriends(userId);
    
    // Get friend details
    const friends = await User.find({ _id: { $in: friendIds } })
      .select('username fullName profilePicture');

    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Get pending friend requests
router.get('/requests', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const requests = await Friend.find({
      friendId: userId,
      status: 'pending'
    }).populate('userId', 'username fullName profilePicture');

    res.json(requests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
});

// Remove friend
router.delete('/:friendId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.params;

    await Friend.deleteOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

module.exports = router;
