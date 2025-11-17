import React, { useState } from 'react';
import { Zap, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import '../styles/modeToggle.css';

/**
 * Mode Toggle Component
 * Allows users to switch between Classic and Professional POS modes
 */
const ModeToggle = ({ currentMode, onModeChange }) => {
  const [showInfo, setShowInfo] = useState(false);

  const modes = [
    {
      id: 'classic',
      name: 'Classic Mode',
      description: 'Simple, streamlined interface perfect for beginners and quick service',
      icon: Zap,
      features: [
        'Larger buttons and text',
        'Simplified menu system',
        'Quick checkout process',
        'Essential features only'
      ],
      color: '#10B981'
    },
    {
      id: 'professional',
      name: 'Professional Mode',
      description: 'Full-featured experience with advanced capabilities like Square or Odoo',
      icon: Star,
      features: [
        'Advanced analytics',
        'Detailed reporting',
        'Inventory management',
        'Staff permissions',
        'Multiple payment methods'
      ],
      color: '#6366F1'
    }
  ];

  return (
    <div className="mode-toggle-container">
      <button 
        className="mode-toggle-button"
        onClick={() => setShowInfo(!showInfo)}
      >
        {currentMode === 'classic' ? (
          <ToggleLeft size={20} className="toggle-icon" />
        ) : (
          <ToggleRight size={20} className="toggle-icon active" />
        )}
        <span className="mode-name">
          {currentMode === 'classic' ? 'Classic' : 'Professional'} Mode
        </span>
      </button>

      {showInfo && (
        <>
          <div className="mode-overlay" onClick={() => setShowInfo(false)} />
          <div className="mode-selector-modal">
            <div className="modal-header">
              <h2>Choose Your POS Mode</h2>
              <p>Select the interface that best fits your needs</p>
            </div>

            <div className="mode-options">
              {modes.map(mode => {
                const Icon = mode.icon;
                const isActive = currentMode === mode.id;
                
                return (
                  <button
                    key={mode.id}
                    className={`mode-option mode-${mode.id} ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onModeChange(mode.id);
                      setShowInfo(false);
                    }}
                  >
                    <div className="mode-icon-container">
                      <Icon size={32} />
                    </div>
                    <h3>{mode.name}</h3>
                    <p className="mode-description">{mode.description}</p>
                    
                    <ul className="mode-features">
                      {mode.features.map((feature, index) => (
                        <li key={index}>
                          <span className="feature-dot">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isActive && (
                      <div className="active-badge">
                        Current Mode
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="modal-footer">
              <button 
                className="close-modal-btn"
                onClick={() => setShowInfo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModeToggle;
