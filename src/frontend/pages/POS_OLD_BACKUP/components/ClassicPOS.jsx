import React from 'react';
import EnhancedPOS from './EnhancedPOS';

/**
 * Classic POS Mode - Simplified interface for beginners
 * Features:
 * - Larger buttons and text
 * - Simpler category system
 * - Fewer options to reduce complexity
 * - Streamlined checkout process
 */
const ClassicPOS = () => {
  return <EnhancedPOS mode="classic" />;
};

export default ClassicPOS;
