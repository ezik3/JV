import React from 'react';
import { ACTIVE_POS_SYSTEM, POS_SYSTEMS } from '../../../config/posConfig';

// Import POS systems
import EnhancedDashboard from './EnhancedDashboard';
import NocturneInterface from '../../NocturnePOS/NocturneInterface';

/**
 * POSAdapter - Dynamically loads the active POS system
 * based on the configuration in posConfig.js
 */
const POSAdapter = () => {
  console.log('POSAdapter: Loading POS system:', ACTIVE_POS_SYSTEM);

  // Select the correct POS system based on config
  switch (ACTIVE_POS_SYSTEM) {
    case POS_SYSTEMS.NOCTURNE:
      console.log('POSAdapter: Loading Nocturne POS');
      return <NocturneInterface />;

    case POS_SYSTEMS.ENHANCED:
    default:
      console.log('POSAdapter: Loading Enhanced POS');
      return <EnhancedDashboard />;
  }
};

export default POSAdapter;
