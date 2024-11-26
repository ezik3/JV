import React, { useState, useEffect } from 'react';
import { useVenueAuth } from '../context/VenueAuthContext';
import { Redirect } from 'react-router-dom';
import './VenueMessages.css';

const VenueMessages = () => {
  const { venue, loading, error } = useVenueAuth();
  console.log('VenueMessages Render:', { venue, loading, error });

  if (loading) {
    return (
      <div className="messages-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-container">
        <h1>Error: {error.message}</h1>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="messages-container">
        <h1>No venue data found</h1>
        <p>VenueId in localStorage: {localStorage.getItem('venueId')}</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <h2>Messages</h2>
        <div className="chat-list">
          <div className="chat-item">No messages yet</div>
        </div>
      </div>
      <div className="chat-area">
        <div className="no-chat-selected">
          Select a conversation to start messaging
        </div>
      </div>
    </div>
  );
};

export default VenueMessages;
