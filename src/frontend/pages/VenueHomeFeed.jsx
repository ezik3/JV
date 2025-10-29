import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import './VenueHomeFeed.css';

const socket = io('http://localhost:5001');

const VenueHomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch initial venue data
    fetchVenueData();

    // Listen for new orders
    socket.on('newOrder', (order) => {
      setOrders(prevOrders => [order, ...prevOrders]);
    });

    return () => {
      socket.off('newOrder');
    };
  }, []);

  const fetchVenueData = async () => {
    try {
      const mockPosts = [
        {
          id: 1,
          authorName: 'Your Venue',
          authorAvatar: 'https://source.unsplash.com/random/400x400?nightclub',
          content: '🎉 Tonight\'s special event! Join us for an unforgettable evening! 🎶',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          image: 'https://source.unsplash.com/random/800x600?party',
          engagement: {
            likes: 156,
            comments: 23,
            shares: 12
          }
        },
        // Add more mock posts as needed
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching venue data:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !selectedImage) return;

    const newPost = {
      id: posts.length + 1,
      authorName: 'Your Venue',
      authorAvatar: 'https://source.unsplash.com/random/400x400?nightclub',
      content: postText,
      timestamp: new Date().toISOString(),
      image: selectedImage,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0
      }
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setSelectedImage(null);
    setModalVisible(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navigateToOrders = () => {
    history.push('/venue/orders');
  };

  const navigateToMenu = () => {
    history.push('/venue/menu');
  };

  return (
    <div className="venue-home-feed">
      <nav className="navbar">
        <div className="navbar-content">
          <a href="/venue/dashboard" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Dashboard
          </a>
          <a href="/venue/orders" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
            Orders
          </a>
          <a href="/venue/menu" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            Menu
          </a>
          <a href="/venue/events" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
            Events
          </a>
          <a href="/venue/stats" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
            Stats
          </a>
          <a href="/venue/settings" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
            Settings
          </a>
        </div>
      </nav>

      <div className="main-content">
        {/* Create Post Section */}
        <div className="create-post-box" onClick={() => setModalVisible(true)}>
          <img src="https://source.unsplash.com/random/400x400?nightclub" alt="Venue" className="venue-avatar"/>
          <div className="post-prompt">Share updates about your venue...</div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <h3>Today's Orders</h3>
            <p>{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Current Occupancy</h3>
            <p>75%</p>
          </div>
          <div className="stat-card">
            <h3>Revenue Today</h3>
            <p>$2,450</p>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="posts-feed">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src={post.authorAvatar} alt={post.authorName} className="post-avatar"/>
                <div>
                  <div className="post-user">{post.authorName}</div>
                  <div className="post-time">{new Date(post.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post" className="post-image"/>}
              </div>
              <div className="post-actions">
                <button>{post.engagement.likes} Likes</button>
                <button>{post.engagement.comments} Comments</button>
                <button>{post.engagement.shares} Shares</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's happening at your venue?"
            />
            <div className="modal-actions">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="upload-button">
                Add Photo
              </label>
              <button onClick={handleCreatePost}>Post</button>
            </div>
            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="Preview"/>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueHomeFeed;
