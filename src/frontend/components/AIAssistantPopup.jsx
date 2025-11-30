import React, { useState } from 'react';
import AIWaiter from './shared/AIWaiter';
import './AIAssistantPopup.css';

function AIAssistantPopup({ venueId, onClose }) {
  const [activeOption, setActiveOption] = useState(null);

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  return (
    <div className="ai-assistant-popup">
      <button className="close-button" onClick={onClose}>Close</button>
      {!activeOption && (
        <div className="assistant-options">
          <button onClick={() => handleOptionClick('aiWaiter')}>AI Waiter</button>
          <button onClick={() => handleOptionClick('callWaiter')}>Call Waiter</button>
          <button onClick={() => handleOptionClick('startOrder')}>Start Order</button>
        </div>
      )}
      {activeOption === 'aiWaiter' && <AIWaiter venueId={venueId} />}
      {activeOption === 'callWaiter' && <div>A waiter has been called to your table.</div>}
      {activeOption === 'startOrder' && <AIWaiter venueId={venueId} startWithOrder={true} />}
    </div>
  );
}

export default AIAssistantPopup;