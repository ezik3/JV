import React, { useState, useEffect } from 'react';
import './Top10Joints.css';

const Top10 = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCity, setActiveCity] = useState('All Cities');
  const [isVideo, setIsVideo] = useState(false);
  const [selectedType, setSelectedType] = useState('People');
  const [peopleContent, setPeopleContent] = useState([]);

  useEffect(() => {
    generatePeopleContent(isVideo);
  }, [isVideo]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    alert(`Category "${category}" selected. Filtering functionality coming soon!`);
  };

  const handleCityClick = (city) => {
    setActiveCity(city);
    alert(`Switched to ${city} top 10. City-specific data coming soon!`);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === 'Venues') {
      alert('Venues content coming soon!');
    } else {
      generatePeopleContent(isVideo);
    }
  };

  const generatePeopleContent = (isVideo) => {
    const newContent = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      imageUrl: `https://source.unsplash.com/random/400x400?face&${Math.random()}`,
      profileUrl: `https://source.unsplash.com/random/60x60?face&${Math.random()}`,
      username: `User ${i + 1}`,
      pounds: Math.floor(Math.random() * 1000),
      description: isVideo ? 'Amazing video content' : 'Stunning photo'
    }));
    setPeopleContent(newContent);
  };

  const viewProfile = (userId) => {
    alert(`Viewing profile of User ${userId}. Full profile page coming soon!`);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <a href="/feed" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Feed
          </a>
          <a href="/top10" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
            Top 10
          </a>
          <a href="/venues" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            Venues
          </a>
          <a href="/maps" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
            </svg>
            Maps
          </a>
          <a href="/messages" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            Messages
          </a>
          <a href="/notifications" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            Notifications
          </a>
          <a href="/profile" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Profile
          </a>
        </div>
      </nav>

      <header className="top10-header">
        <div className="top10-title-container">
          <h1 className="top10-title">Top 10 Joints</h1>
          <div className="dropdown">
            <button className="dropbtn">{selectedType} ▼</button>
            <div className="dropdown-content">
              <a href="#" onClick={() => handleTypeChange('People')}>People</a>
              <a href="#" onClick={() => handleTypeChange('Venues')}>Venues</a>
            </div>
          </div>
        </div>
        <div className="toggle-container" style={{ display: selectedType === 'Venues' ? 'none' : 'flex' }}>
          <span>Photos</span>
          <label className="switch">
            <input type="checkbox" checked={isVideo} onChange={() => setIsVideo(!isVideo)} />
            <span className="slider round"></span>
          </label>
          <span>Videos</span>
        </div>
      </header>

      <div className="city-nav">
        {['All Cities', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas', 'San Francisco', 'New Orleans', 'Nashville', 'Austin'].map((city) => (
          <button
            key={city}
            className={`city-button ${activeCity === city ? 'active' : ''}`}
            onClick={() => handleCityClick(city)}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="category-tabs">
        {['All', 'Nightclubs', 'Bars/Pubs', 'Restaurants/Cafes', 'Events'].map((category, index) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
            {index === 0 && <span className="dropdown-arrow">▼</span>}
          </button>
        ))}
      </div>

      <div className="top10-list">
        {peopleContent.map((item) => (
          <div key={item.id} className="top10-item">
            <div className="top10-number">{item.id}</div>
            <img src={item.imageUrl} alt={`Person ${item.id}`} className="top10-image" />
            <div className="top10-user-info">
              <img
                src={item.profileUrl}
                alt={`Profile ${item.id}`}
                className="top10-profile-img"
                onClick={() => viewProfile(item.id)}
              />
              <div className="top10-user-details">
                <span className="top10-username">{item.username}</span>
                <span className="top10-pounds">{item.pounds} pounds</span>
              </div>
            </div>
            <div className="top10-content">
              <p className="top10-description">{item.description}</p>
              <a href={`/profile/user${item.id}`} className="top10-button">View Profile</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top10;