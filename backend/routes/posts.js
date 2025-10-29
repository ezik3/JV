const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../utils/jwtUtils');
const Post = require('../models/post');
const Friend = require('../models/friend');
const User = require('../models/user');

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Check if user can use gold post
router.get('/can-use-gold', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const now = new Date();
    const lastGoldPost = user.lastGoldPostDate;
    
    // Check if 24 hours have passed since last gold post
    const canUseGold = !lastGoldPost || (now - lastGoldPost) >= 24 * 60 * 60 * 1000;
    
    res.json({ canUseGold });
  } catch (error) {
    console.error('Error checking gold post availability:', error);
    res.status(500).json({ error: 'Failed to check gold post availability' });
  }
});

// Create a new post
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { content, username, profilePicture, visibility, location, isGold, venue, savedToProfile } = req.body;
    
    // Get userId from JWT token or fallback to body
    const userId = req.user?.userId || req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify gold post eligibility
    if (isGold) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const now = new Date();
      const lastGoldPost = user.lastGoldPostDate;
      
      if (lastGoldPost && (now - lastGoldPost) < 24 * 60 * 60 * 1000) {
        return res.status(400).json({ error: 'You can only create one gold post per 24 hours' });
      }
      
      // Update last gold post date
      user.lastGoldPostDate = now;
      await user.save();
    }

    // Update user location if provided
    if (location) {
      await User.findByIdAndUpdate(userId, {
        currentLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: new Date()
        }
      });
    }

    const post = new Post({
      userId,
      content,
      username,
      profilePicture,
      visibility: visibility || 'private',
      location,
      isGold: isGold || false,
      venue,
      savedToProfile: savedToProfile || false,
      timestamp: new Date()
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Get feed posts (user's own posts + friends' private posts + public posts)
router.get('/feed', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { userLatitude, userLongitude } = req.query;
    
    // Get user's friends
    const friendIds = await Friend.getFriends(userId);
    
    // Get posts that are:
    // 1. User's own posts (any visibility)
    // 2. Friends' private posts
    // 3. All public posts
    const posts = await Post.find({
      $or: [
        { userId }, // User's own posts
        { userId: { $in: friendIds }, visibility: 'private' }, // Friends' private posts
        { visibility: 'public' } // All public posts
      ],
      expiresAt: { $gt: new Date() } // Only non-expired posts
    })
    .sort({ isGold: -1, timestamp: -1 }) // Gold posts first, then by time
    .limit(100);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Get public posts with distance sorting
router.get('/public', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'User location required' });
    }

    // Get all public posts with location data
    const posts = await Post.find({
      visibility: 'public',
      'location.latitude': { $exists: true },
      'location.longitude': { $exists: true },
      expiresAt: { $gt: new Date() }
    })
    .populate('userId', 'username fullName profilePicture')
    .lean();

    // Calculate distance for each post and add it to the post object
    const postsWithDistance = posts.map(post => ({
      ...post,
      distance: calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        post.location.latitude,
        post.location.longitude
      ),
      user: post.userId // Renaming userId to user for clarity
    }));

    // Sort by distance (closest first)
    postsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(postsWithDistance);
  } catch (error) {
    console.error('Error fetching public posts:', error);
    res.status(500).json({ error: 'Failed to fetch public posts' });
  }
});

// Delete a post (only if it belongs to the user)
router.delete('/:postId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await Post.findOne({ _id: postId, userId });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    await Post.deleteOne({ _id: postId });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
