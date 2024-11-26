import React from 'react';
import { Link } from 'react-router-dom';
import './RegistrationChoice.css';

const RegistrationChoice = () => {
  return (
    <div className="registration-container">
      <div className="registration-content">
        <h1 className="title">Choose Your Path</h1>
        <div className="cards-container">
          <Link to="/user-signup" className="choice-card user-card">
            <div className="card-content">
              <div className="icon">👤</div>
              <h2>End User</h2>
              <p>Join as an individual to explore and experience venues</p>
              <div className="hover-effect"></div>
            </div>
          </Link>
          
          <Link to="/venue-signup" className="choice-card venue-card">
            <div className="card-content">
              <div className="icon">🏢</div>
              <h2>Venue</h2>
              <p>Register your establishment and connect with users</p>
              <div className="hover-effect"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationChoice;