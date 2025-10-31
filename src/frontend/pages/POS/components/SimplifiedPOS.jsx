import React from 'react';
import EnhancedPOS from './EnhancedPOS';

// This component now uses the enhanced POS interface
// Keeping the old import name for backwards compatibility
const SimplifiedPOS = () => {
  return <EnhancedPOS mode="professional" />;
};

export default SimplifiedPOS;
