import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const VenueAuthContext = createContext(null);

export const VenueAuthProvider = ({ children }) => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const venueId = localStorage.getItem('venueId');
    console.log('VenueAuthProvider Init:', { venueId });

    if (venueId) {
      checkVenueAuth(venueId);
    } else {
      console.log('No venueId found in localStorage');
      setLoading(false);
    }
  }, []);

  const checkVenueAuth = async (venueId) => {
    try {
      console.log('Checking venue auth for:', venueId);
      const response = await api.get(`/api/venue/${venueId}/current`);
      console.log('Venue auth response:', response.data);
      setVenue(response.data);
      setError(null);
    } catch (error) {
      console.error('Venue auth error:', error);
      setError(error);
      setVenue(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    venue,
    setVenue,
    loading,
    error
  };

  return (
    <VenueAuthContext.Provider value={value}>
      {children}
    </VenueAuthContext.Provider>
  );
};

export const useVenueAuth = () => {
  const context = useContext(VenueAuthContext);
  if (!context) {
    throw new Error('useVenueAuth must be used within a VenueAuthProvider');
  }
  return context;
};
