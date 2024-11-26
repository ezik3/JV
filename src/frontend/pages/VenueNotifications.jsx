import React, { useState, useEffect } from 'react';
import { useVenueAuth } from '../context/VenueAuthContext';
import { Redirect } from 'react-router-dom';
import './VenueNotifications.css';

const VenueNotifications = () => {
  const { venue, loading, error } = useVenueAuth();
  const [notifications, setNotifications] = useState([]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!venue) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {/* Your notifications UI */}
    </div>
  );
};

export default VenueNotifications;
