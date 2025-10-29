import React, { useState, useEffect } from 'react';
import AIWaiter from '../components/shared/AIWaiter';
import './PartyProfessionalFeed.css';

const timeAgoMagic = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

const PartyProfessionalFeed = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [taggedListVisible, setTaggedListVisible] = useState(false);
  const [randomProfiles, setRandomProfiles] = useState([]);
  const [postText, setPostText] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState('unknown');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [posts, setPosts] = useState([]);
  const [showCheckInOptions, setShowCheckInOptions] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAIWaiter, setShowAIWaiter] = useState(false);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [venueError, setVenueError] = useState(null);
  const textareaRef = React.useRef(null);
  const [currentUser, setCurrentUser] = useState({
    username: '',
    profilePicture: '',
  });
  const [postVisibility, setPostVisibility] = useState('private');
  const [canUseGold, setCanUseGold] = useState(false);
  const [useGoldPost, setUseGoldPost] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [viewedProfileIds, setViewedProfileIds] = useState(new Set());

  const venues = [
    { id: 1, name: 'Cool Bar', type: 'venue' },
    { id: 2, name: 'Nice Restaurant', type: 'venue' },
    { id: 3, name: 'Fun Club', type: 'venue' },
    { id: 4, name: 'Club Neon', type: 'venue' }
  ];

  const people = [
    { id: 1, name: 'Mikey', type: 'person' },
    { id: 2, name: 'Sarah', type: 'person' },
  ];

  const animatePounds = () => {
    const animation = document.querySelector('.pounds-animation');
    const leftFist = document.querySelector('.fist-left');
    const rightFist = document.querySelector('.fist-right');

    animation.style.display = 'block';
    leftFist.style.animation = 'fistBump 1s ease-in-out';
    rightFist.style.animation = 'fistBump 1s ease-in-out reverse';

    setTimeout(() => {
      animation.style.display = 'none';
      leftFist.style.animation = '';
      rightFist.style.animation = '';
    }, 1000);
  };

  const handleVenueClick = async (venueName) => {
    try {
      setVenueError(null);
      setLoadingVenue(true);
      const venue = venues.find(v => v.name === venueName);
      
      if (!venue) {
        throw new Error(`Venue "${venueName}" not found`);
      }

      setSelectedVenue(venue);
      setShowAIWaiter(true);
      setLoadingVenue(false);
    } catch (error) {
      setVenueError(error.message);
      setLoadingVenue(false);
    }
  };

  const handleOrderRequest = async (items) => {
    try {
      console.log('Order requested:', items);
      setOrderPlaced(true);
      
      setTimeout(() => {
        setOrderPlaced(false);
        setShowAIWaiter(false);
        setSelectedVenue(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  // Removed random profile generation - only showing real user data

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchFeedPosts(); // Use new feed endpoint
  }, []);

  useEffect(() => {
    const tickTock = setInterval(() => {
      setPosts([...posts]);
    }, 60000);

    return () => clearInterval(tickTock);
  }, [posts]);

  const handleProfileClick = (profile) => {
    try {
      const profileData = {
        ...profile,
        timestamp: new Date().toISOString()
      };
      const profileParam = encodeURIComponent(JSON.stringify(profileData));
      window.location.href = `/city-view?profile=${profileParam}`;
    } catch (error) {
      console.error('Error navigating to profile:', error);
    }
  };

  useEffect(() => {
    const lastAtSymbolIndex = postText.lastIndexOf('@', cursorPosition);
    if (lastAtSymbolIndex !== -1 && cursorPosition > lastAtSymbolIndex) {
      const query = postText.slice(lastAtSymbolIndex + 1, cursorPosition).toLowerCase();
      const results = [...venues, ...people].filter(item =>
        item.name.toLowerCase().includes(query)
      );
      setAutocompleteResults(results);
      setShowAutocomplete(results.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }, [postText, cursorPosition]);

  const handleTextChange = (e) => {
    setPostText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleAutocompleteSelect = (item) => {
    const beforeMention = postText.slice(0, postText.lastIndexOf('@', cursorPosition));
    const afterMention = postText.slice(cursorPosition);
    const newText = `${beforeMention}@${item.name} ${afterMention}`;
    setPostText(newText);
    setShowAutocomplete(false);
    if (item.type === 'venue') {
      setSelectedVenue(item);
      setShowCheckInOptions(true);
    }
  };

  const handleCheckInOption = (option) => {
    const checkInText = ` (${option})`;
    setPostText(postText + checkInText);
    setCheckInStatus(option);
    setShowCheckInOptions(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    // Check if public post requires location
    if (postVisibility === 'public' && !locationPermission) {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        alert('Location permission is required for public posts');
        return;
      }
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          content: postText,
          username: currentUser.username,
          profilePicture: currentUser.profilePicture,
          visibility: postVisibility,
          location: postVisibility === 'public' ? userLocation : null,
          isGold: useGoldPost,
          venue: selectedVenue?.name
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        await fetchFeedPosts(); // Refresh feed
        if (postVisibility === 'public') {
          await fetchPublicProfiles(); // Refresh public profiles
        }
        setPostText('');
        setModalVisible(false);
        setPostVisibility('private');
        setUseGoldPost(false);
        setSelectedVenue(null);
        checkGoldPostAvailability(); // Refresh gold post availability
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleOrderPlaced = (order) => {
    setOrderPlaced(true);
    socket.emit('orderPlaced', order);
  };

  const handleVenueCheckin = async (venue) => {
    try {
      // Simplified check-in logic
      setShowAIWaiter(true);
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleAIOrder = async (orderItems) => {
    try {
      console.log('Order placed:', orderItems);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Order failed:', error);
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission(true);
          resolve(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Location permission denied. You need to enable location to post public or check in to venues.');
          resolve(false);
        }
      );
    });
  };

  // Check if user can use gold post
  const checkGoldPostAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts/can-use-gold', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCanUseGold(data.canUseGold);
      }
    } catch (error) {
      console.error('Error checking gold post availability:', error);
    }
  };

  // Fetch public profiles for carousel
  const fetchPublicProfiles = async () => {
    if (!userLocation) return;
    
    try {
      const response = await fetch(
        `http://localhost:5001/api/posts/public?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setPublicProfiles(data);
      }
    } catch (error) {
      console.error('Error fetching public profiles:', error);
    }
  };

  // Fetch feed posts
  const fetchFeedPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts/feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching feed posts:', error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`http://localhost:5001/api/auth/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser({
            username: userData.showUsername ? userData.username : (userData.fullName || userData.username),
            profilePicture: userData.profilePicture || '/default-avatar.png'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
    checkGoldPostAvailability();
    requestLocationPermission();
  }, []);

  // Fetch public profiles when location is available
  useEffect(() => {
    if (userLocation) {
      fetchPublicProfiles();
      const interval = setInterval(fetchPublicProfiles, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  // Load viewed profiles from sessionStorage
  useEffect(() => {
    const storedViewed = sessionStorage.getItem('viewedProfileIds');
    if (storedViewed) {
      setViewedProfileIds(new Set(JSON.parse(storedViewed)));
    }
  }, []);

  // Save viewed profiles to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('viewedProfileIds', JSON.stringify([...viewedProfileIds]));
  }, [viewedProfileIds]);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <a href="/feed" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            Feed
          </a>
          <a href="/top10" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
            </svg>
            Top 10
          </a>
          <a href="/venues" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
            Venues
          </a>
          <a href="/maps" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
            Maps
          </a>
          <a href="/messages" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            Messages
          </a>
          <a href="/notifications" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            Notifications
          </a>
          <a href="/profile" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Profile
          </a>
        </div>
      </nav>

      <div className="app-container">
        {!selectedVenue && (
          <div className="venue-selection">
            <h3>Select a Venue to Order From:</h3>
            <div className="venue-list">
              {venues.map((venue) => (
                <button
                  key={venue.id}
                  className="venue-button"
                  onClick={() => handleVenueClick(venue.name)}
                >
                  {venue.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          className="waiter-bell-button"
          onClick={() => setShowAIWaiter(!showAIWaiter)}
        >
          {showAIWaiter ? '×' : '🔔'}
        </button>

        {showAIWaiter && selectedVenue && (
          <AIWaiterCharacter
            onClose={() => setShowAIWaiter(false)}
            onOrder={handleOrderRequest}
          />
        )}

        {orderPlaced && (
          <div className="order-confirmation">
            Order placed successfully!
          </div>
        )}

        {venueError && (
          <div className="venue-error-message">
            {venueError}
          </div>
        )}

        <div className="post-box" onClick={() => setModalVisible(true)}>
          <img 
            src={currentUser.profilePicture || 'https://randomuser.me/api/portraits/women/32.jpg'} 
            alt={currentUser.username} 
            className="post-box-avatar" 
          />
          <span className="post-box-prompt">What's happening in the party scene?</span>
        </div>

        {modalVisible && (
          <div id="postModal" className="modal" onClick={() => setModalVisible(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
              
              {/* Privacy Toggle */}
              <div className="privacy-toggle" style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setPostVisibility('private')}
                  style={{
                    padding: '8px 16px',
                    background: postVisibility === 'private' ? '#007bff' : '#f0f0f0',
                    color: postVisibility === 'private' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  🔒 Private (Friends Only)
                </button>
                <button 
                  onClick={async () => {
                    if (!locationPermission) {
                      const hasPermission = await requestLocationPermission();
                      if (!hasPermission) return;
                    }
                    setPostVisibility('public');
                  }}
                  style={{
                    padding: '8px 16px',
                    background: postVisibility === 'public' ? '#28a745' : '#f0f0f0',
                    color: postVisibility === 'public' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  🌍 Public
                </button>
              </div>

              {/* Gold Post Option */}
              {canUseGold && (
                <div className="gold-post-option" style={{ 
                  marginBottom: '15px',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFE9B3 100%)',
                  borderRadius: '8px',
                  border: '2px solid #FFD700'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={useGoldPost}
                      onChange={(e) => setUseGoldPost(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ 
                      color: '#D4A000', 
                      fontWeight: 'bold',
                      fontSize: '28px'
                    }}>⭐</span>
                    <span style={{ color: '#B8860B', fontWeight: 'bold' }}>Use Gold Post (1 per 24hrs)</span>
                  </label>
                  <p style={{ 
                    margin: '5px 0 0 40px', 
                    fontSize: '12px', 
                    color: '#996515',
                    fontStyle: 'italic'
                  }}>
                    Your post will be highlighted and prioritized in the feed!
                  </p>
                </div>
              )}
              
              <textarea 
                ref={textareaRef}
                placeholder="Share your party vibes..."
                value={postText}
                onChange={handleTextChange}
                style={useGoldPost ? { border: '2px solid #FFD700', boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)' } : {}}
              ></textarea>

              {showAutocomplete && (
                <div className="autocomplete-dropdown">
                  {autocompleteResults.map(item => (
                    <div
                      key={item.id}
                      className={`autocomplete-item ${item.type}`}
                      onClick={() => handleAutocompleteSelect(item)}
                    >
                      {item.type === 'venue' ? '🏢' : '👤'} {item.name}
                    </div>
                  ))}
                </div>
              )}

              {showCheckInOptions && (
                <div className="check-in-options">
                  <button onClick={() => handleCheckInOption('Heading to')}>Heading to</button>
                  <button onClick={() => handleCheckInOption('Checked in at')}>Check in</button>
                  <button onClick={() => setShowCheckInOptions(false)}>Cancel</button>
                </div>
              )}

              <div className="modal-actions">
                <button className="modal-button">📷 Photo/Video</button>
                <button className="modal-button">🏷️ Tag Friends</button>
                <button className="modal-button">📍 Add Location</button>
                <button className="modal-button post" onClick={handlePostSubmit}>🎉 Post</button>
              </div>
            </div>
          </div>
        )}

        {posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="post-user-info">
                <img 
                  src={post.profilePicture || '/default-avatar.png'}
                  alt="Profile" 
                  className="profile-picture"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <span>{post.username}</span>
              </div>
              <div>
                <div className="post-user"><strong>{post.authorName}</strong></div>
                <div className="post-time">
                  {timeAgoMagic(post.timestamp)}
                  {post.venue && (
                    <span className="post-venue" onClick={() => handleVenueClick(post.venue)}>
                      · @{post.venue}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="post-content">
              <p className="post-text">{post.content}</p>
              {post.image && <img src={post.image} alt="Post" className="post-image" />}
            </div>
            <div className="pounds-animation">
              <div className="fist fist-left"></div>
              <div className="fist fist-right"></div>
            </div>
            <div className="post-actions">
              <button className="action-button pounds-button" onClick={animatePounds}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.22 2.5h-2.44c-.55 0-1.06.28-1.35.74L12 10.33 7.57 3.24a1.5 1.5 0 0 0-1.35-.74H3.78C2.8 2.5 2 3.3 2 4.28v15.44c0 .98.8 1.78 1.78 1.78h2.44c.55 0 1.06-.28 1.35-.74L12 13.67l4.43 7.09c.29.46.8.74 1.35.74h2.44c.98 0 1.78-.8 1.78-1.78V4.28c0-.98-.8-1.78-1.78-1.78z" />
                </svg>
                Pounds
              </button>
              <button className="action-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                Comment
              </button>
              <button className="action-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        ))}

        <div className="recent-posters-container">
          <div className="recent-posters">
            {publicProfiles.length > 0 ? (
              publicProfiles.map((profile, index) => (
                <div 
                  className="recent-poster" 
                  key={profile._id} 
                  onClick={() => {
                    setViewedProfileIds(prev => new Set([...prev, profile._id]));
                    handleProfileClick({
                      id: profile._id,
                      name: profile.user.fullName || profile.user.username,
                      imgSrc: profile.user.profilePicture,
                      content: profile.content,
                      distance: profile.distance,
                      isGold: profile.isGold
                    });
                  }}
                  style={profile.isGold ? { border: '3px solid #FFD700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' } : {}}
                >
                  <img 
                    src={profile.user.profilePicture || '/default-avatar.png'} 
                    alt={profile.user.username}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <p>{profile.user.username}</p>
                  <span style={{ fontSize: '0.8em', color: '#888' }}>{profile.distance.toFixed(1)}km away</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                <p>No public profiles nearby</p>
                <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
                  When users post publicly, they'll appear here based on distance
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartyProfessionalFeed;
