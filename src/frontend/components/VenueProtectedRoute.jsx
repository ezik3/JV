import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useVenueAuth } from '../context/VenueAuthContext';

const VenueProtectedRoute = ({ children }) => {
  const { venue, loading } = useVenueAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!venue) {
    return <Navigate to="/venue/login" replace />;
  }

  return children;
};

export default VenueProtectedRoute;
