import React, { useState, useEffect } from 'react';
import api from '../api';
import './Maps.css';

const Maps = () => {
  const [venues, setVenues] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch followed venues
    const fetchVenues = async () => {
      try {
        const response = await api.get('/api/venues/followed');
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    // Fetch friends' check-ins
    const fetchFriendsCheckIns = async () => {
      try {
        const response = await api.get('/api/friends/check-ins');
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchVenues();
    fetchFriendsCheckIns();
  }, []);

  return (
    <div className="maps-container">
      <div className="map-search">
        <input 
          type="text" 
          placeholder="Search venues or friends..."
          className="search-input"
        />
      </div>

      <div className="map-placeholder">
        <h2>Map View Coming Soon</h2>
        
        <div className="venues-list">
          <h3>Followed Venues</h3>
          <ul>
            {venues.map(venue => (
              <li key={venue._id} className="venue-item">
                <h4>{venue.name}</h4>
                <p>{venue.address}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="friends-list">
          <h3>Friends' Check-ins</h3>
          <ul>
            {friends.map(friend => (
              <li key={friend._id} className="friend-item">
                <h4>{friend.name}</h4>
                <p>Checked in at: {friend.venueName}</p>
                <p>Time: {new Date(friend.checkIn).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Maps;