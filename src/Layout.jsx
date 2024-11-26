import React from 'react';
import axios from 'axios';

// Configure axios to use the environment variable or fallback to port 5000
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const Layout = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};
