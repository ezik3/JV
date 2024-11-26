import React, { useState, useEffect } from 'react';
import useGeolocation from '../../hooks/useGeolocation';
import { Vp, Zp } from '../../mapClasses';
import AIAssistantPopup from './AIAssistantPopup';
import './CheckInSystem.css';

const CheckInSystem = ({ venue, onCheckIn }) => {
  const [checkInStatus, setCheckInStatus] = useState('unknown');
  const [showAIHost, setShowAIHost] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [orderMethod, setOrderMethod] = useState('');
  const { location, error } = useGeolocation();
  const [loadingState, setLoadingState] = useState(0);
  const vpInstance = new Vp();
  const apiHandler = new Zp();

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    if (location && venue) {
      const distance = calculateDistance(location, venue.location);
      if (distance <= venue.checkInRadius) {
        setCheckInStatus('near');
      } else {
        setCheckInStatus('far');
      }
    }
  }, [location, venue]);

  const handleCheckIn = async () => {
    if (checkInStatus === 'near') {
      setLoadingState(1); // Set loading state
      try {
        const response = await fetch('/api/check-in', {
          method: 'POST',
          headers: { ...apiHandler.headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'user_id_here', venueId: venue.id })
        });
        const data = await response.json();
        if (data.success) {
          setCheckInStatus('checked-in');
          setShowAIHost(true);
          onCheckIn(venue.id);
          setLoadingState(2); // Set success state
        } else {
          throw new Error('Check-in failed');
        }
      } catch (error) {
        console.error('Check-in error:', error);
        setLoadingState(3); // Set error state
      }
    }
  };

  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <>
      <div className={`check-in-system ${minimized ? 'minimized' : ''}`}>
        <button className="minimize-button" onClick={toggleMinimize}>
          {minimized ? 'Maximize' : 'Minimize'}
        </button>
        {!minimized && (
          <>
            <div className="ai-host">
              <p>Hello! How can I assist you today?</p>
            </div>
            {checkInStatus === 'near' && (
              <button onClick={handleCheckIn}>Check In</button>
            )}
            {checkInStatus === 'checked-in' && (
              <button className="ai-assistant-button" onClick={toggleAIAssistant}>
                Open AI Assistant
              </button>
            )}
          </>
        )}
      </div>
      {showAIAssistant && <AIAssistantPopup venueId={venue.id} onClose={toggleAIAssistant} />}
    </>
  );
};

function calculateDistance(point1, point2) {
  // ... (keep tconst R = 6371; // Radius of the Earth in km
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kmhe existing calculateDistance function)
}

export default CheckInSystem;
