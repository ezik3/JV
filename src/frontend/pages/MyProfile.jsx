import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './MyProfile.css';

const MyProfile = () => {
  const history = useHistory();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleWalletModal = () => {
    setWalletModalVisible(!walletModalVisible);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear the user's session (remove the token from localStorage)
      localStorage.removeItem('token');
      
      // Redirect to the login page
      history.push('/login');
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="app-container">
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

      <div className="profile-header">
        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <img
          src="https://randomuser.me/api/portraits/women/32.jpg"
          alt="DJ Sarah Spin"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1 className="profile-name">DJ Sarah Spin</h1>
          <p className="profile-username">
            @djsarahspin{' '}
            <a href="/venues/sin-city" className="venue-link">
              @Sin City
            </a>
          </p>
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-value">1,234</div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="stat">
              <div className="stat-value">567</div>
              <div className="stat-label">Following</div>
            </div>
            <div className="stat">
              <div className="stat-value">89</div>
              <div className="stat-label">Events</div>
            </div>
          </div>
          <button className="edit-profile">Edit Profile</button>
          <button className="follow-btn">Follow</button>
        </div>
        <button className="wallet-btn" onClick={toggleWalletModal}>
          Wallet
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="mute-btn" onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="profile-body">
        <div className="profile-section">
          <h2 className="section-title">About Me</h2>
          <p className="bio">
            Electro-house DJ and music producer with a passion for creating unforgettable nights. Spinning beats and igniting dance floors across the globe. Let's make some noise! 🎧🔥
          </p>
          <h3 className="section-title">Interests</h3>
          <div className="interests">
            <span className="interest-tag">Electronic Music</span>
            <span className="interest-tag">DJing</span>
            <span className="interest-tag">Music Production</span>
            <span className="interest-tag">Festivals</span>
            <span className="interest-tag">Nightlife</span>
            <span className="interest-tag">Travel</span>
          </div>
        </div>
        <div className="profile-section">
          <h2 className="section-title">Friends</h2>
          <div className="friends-list">
            {['Emma W.', 'Mike B.', 'Soph L.', 'Dave K.', 'Liv D.', 'E-Wil'].map((name, index) => (
              <div className="friend" key={index}>
                <img
                  src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${65 + index}.jpg`}
                  alt={name}
                  className="friend-avatar"
                />
                <p className="friend-name">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Recent Posts</h2>
        <div className="posts-grid">
          {['concert', 'dj'].map((tag, index) => (
            <div className="post" key={index}>
              <img
                src={`https://source.unsplash.com/random/400x200?${tag}`}
                alt="Post"
                className="post-image"
              />
              <div className="post-content">
                <p className="post-text">Post content about {tag}</p>
                <div className="post-actions">
                  <span className="action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    256
                  </span>
                  <span className="action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                    </svg>
                    42
                  </span>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {walletModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleWalletModal}>
              &times;
            </span>
            <h2>Your Wallet</h2>
            <p>Current Balance: $1,234.56</p>
            <button id="authBtn">Authenticate</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;