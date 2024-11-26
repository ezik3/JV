import React from 'react';
import { Redirect } from 'react-router-dom';

export const POSInterface = () => {
  // Directly redirect to Manager Login
  return <Redirect to="/venue/pos/auth/manager" />;
}; 