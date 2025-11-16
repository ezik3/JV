import React from 'react';
import POSAdapter from './POSAdapter';

/**
 * POSDashboard - Main POS dashboard entry point
 * Uses POSAdapter to dynamically load the active POS system
 * from posConfig.js (Enhanced or Nocturne)
 */
const POSDashboard = () => {
  return <POSAdapter />;
};

export default POSDashboard;