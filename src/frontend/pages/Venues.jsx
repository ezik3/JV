import React, { useState } from 'react';
import './Venues.css';

const Venues = () => {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [showDropdown, setShowDropdown] = useState(false);

  const cities = [
    "All Cities", "New York", "Los Angeles", "Chicago", "Miami", 
    "Las Vegas", "San Francisco", "New Orleans", "Nashville", "Austin"
  ];

  const venues = [
    {
      id: 1,
      name: "Club Neon",
      description: "Electrifying atmosphere with world-class DJs",
      rating: 4.9,
      reviews: 1024,
      type: "nightclub"
    },
    {
      id: 2,
      name: "Skyline Lounge",
      description: "Breathtaking views and signature cocktails",
      rating: 4.8,
      reviews: 896,
      type: "rooftop-bar"
    },
    // Add more venue data here
  ];

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
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2z"/>
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

      <div className="venues-container">
        <div className="search-bar">
          <input type="text" className="search-input" placeholder="Search for venues..." />
          <button className="search-button">Search</button>
        </div>

        <div className="filters">
          <button className="filter-button">All</button>
          <button className="filter-button">Nightclubs</button>
          <button className="filter-button">Bars</button>
          <button className="filter-button">Restaurants</button>
          <button className="filter-button">Events</button>
        </div>

        <div className="city-nav">
          <div className="city-dropdown">
            <button 
              className="city-dropdown-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedCity}
            </button>
            {showDropdown && (
              <div className="city-dropdown-content">
                {cities.map((city, index) => (
                  <a 
                    key={index} 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCity(city);
                      setShowDropdown(false);
                    }}
                  >
                    {city}
                  </a>
                ))}
              </div>
            )}
          </div>
          {cities.slice(1).map((city, index) => (
            <button 
              key={index} 
              className="city-button"
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <img 
                src={`https://source.unsplash.com/random/400x250?${venue.type}`} 
                alt={venue.name} 
                className="venue-image" 
              />
              <div className="venue-info">
                <h2 className="venue-name">{venue.name}</h2>
                <p className="venue-description">{venue.description}</p>
                <div className="venue-rating">
                  <span className="star">★★★★★</span>
                  <span>{venue.rating} ({venue.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="dynamic-background"></div>
      </div>
    </div>
  );
};

export default Venues;