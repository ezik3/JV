// vibe/src/frontend/pages/VenueOwnerHome.jsx

import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import api from '../api';
import './VenueOwnerHome.css';
import { FaHome, FaCashRegister, FaCoins, FaUser, FaEnvelope, FaBell, FaCog } from 'react-icons/fa';

const VenueOwnerHome = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('Checking profile with userId:', userId);

      if (!userId) {
        history.push('/login');
        return;
      }

      const response = await api.get(`/api/auth/check-profile/${userId}`);
      console.log('Profile response:', response.data);
      
      if (!response.data.isProfileComplete) {
        history.push('/profile-setup');
        return;
      }

      if (response.data.venue?.id) {
        localStorage.setItem('venueId', response.data.venue.id);
        console.log('Set venueId in localStorage:', response.data.venue.id);
      }

      setIsLoading(false);

    } catch (error) {
      console.error('Error checking profile status:', error);
      history.push('/login');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="venue-owner-home">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/venue/home" className="nav-item active">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/venue/pos" className="nav-item">
            <FaCashRegister className="nav-icon" />
            <span>POS</span>
          </Link>
          <Link to="/venue/credits" className="nav-item">
            <FaCoins className="nav-icon" />
            <span>Credits</span>
          </Link>
          <Link to="/venue/accounts" className="nav-item">
            <FaUser className="nav-icon" />
            <span>Account</span>
          </Link>
          <Link to="/venue/messages" className="nav-item">
            <FaEnvelope className="nav-icon" />
            <span>Messages</span>
          </Link>
          <Link to="/venue/notifications" className="nav-item">
            <FaBell className="nav-icon" />
            <span>Notifications</span>
          </Link>
          <Link to="/venue/settings" className="nav-item">
            <FaCog className="nav-icon" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      <div className="dashboard">
        <h1>Welcome, {localStorage.getItem('venueName') || 'Venue Owner'}</h1>
        <div className="quick-stats">
          <div className="stat-card">
            <h3>Today's Revenue</h3>
            <p className="stat-value">$3,250</p>
          </div>
          <div className="stat-card">
            <h3>Active Orders</h3>
            <p className="stat-value">12</p>
          </div>
          <div className="stat-card">
            <h3>Customers In Venue</h3>
            <p className="stat-value">78</p>
          </div>
        </div>

        <div className="main-content">
          <div className="content-section">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              <li>New order received - Table 5</li>
              <li>Payment processed - $150.00</li>
              <li>Reservation made for 8 PM</li>
              <li>Inventory alert: Low on premium vodka</li>
            </ul>
          </div>
          <div className="content-section">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn">View Menu</button>
              <button className="action-btn">Manage Reservations</button>
              <button className="action-btn">Update Inventory</button>
              <button className="action-btn">Staff Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueOwnerHome;