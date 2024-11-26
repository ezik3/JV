import React, { useState, useEffect } from 'react';
import { useVenueAuth } from '../context/VenueAuthContext';
import { Redirect } from 'react-router-dom';
import './VenueSettings.css';

const VenueSettings = () => {
  const { venue, loading, error } = useVenueAuth();
  const [settings, setSettings] = useState({});

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!venue) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      {/* Your settings UI */}
    </div>
  );
};

export default VenueSettings;
