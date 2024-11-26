import React, { useState } from 'react';
import { useAuth } from '@wasp/auth';

// This is the setup form for new venues
const VenuePOSSetup = () => {
  // Store venue information
  const [venueDetails, setVenueDetails] = useState({
    name: '',           // Venue name
    type: '',          // Type of venue (restaurant, bar, etc)
    acceptStablecoin: true  // Whether they'll accept JV tokens
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send venue details to backend
      const response = await fetch('/api/venue/setup-pos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueDetails)
      });
      
      if (response.ok) {
        // If successful, go to POS page
        window.location.href = '/venue/pos';
      }
    } catch (error) {
      console.error('Failed to setup POS:', error);
      alert('Failed to setup POS. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Setup Your Venue POS</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Venue Name Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Venue Name</label>
          <input
            type="text"
            value={venueDetails.name}
            onChange={(e) => setVenueDetails({...venueDetails, name: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
            required
          />
        </div>
        
        {/* Venue Type Selection */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Venue Type</label>
          <select
            value={venueDetails.type}
            onChange={(e) => setVenueDetails({...venueDetails, type: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
            required
          >
            <option value="">Select Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="bar">Bar</option>
            <option value="cafe">Cafe</option>
          </select>
        </div>

        {/* JV Stablecoin Option */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={venueDetails.acceptStablecoin}
              onChange={(e) => setVenueDetails({...venueDetails, acceptStablecoin: e.target.checked})}
              style={{ marginRight: '8px' }}
            />
            Accept JV Stablecoin payments
          </label>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create POS Instance
        </button>
      </form>
    </div>
  );
};

export default VenuePOSSetup;