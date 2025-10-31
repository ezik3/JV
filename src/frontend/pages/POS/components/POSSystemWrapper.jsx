import React, { useState } from 'react';
import EnhancedPOS from './EnhancedPOS';
import ModeToggle from './ModeToggle';

/**
 * POS System Wrapper with Mode Selection
 * Provides both Classic and Professional modes
 */
const POSSystemWrapper = () => {
  const [mode, setMode] = useState('professional');

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Mode Toggle in top-right corner */}
      <div style={{ 
        position: 'absolute', 
        top: '1rem', 
        right: '1rem', 
        zIndex: 100 
      }}>
        <ModeToggle 
          currentMode={mode}
          onModeChange={setMode}
        />
      </div>

      {/* POS Interface */}
      <EnhancedPOS mode={mode} />
    </div>
  );
};

export default POSSystemWrapper;
