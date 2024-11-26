import React, { useState } from 'react';
import './VenuePOSSetup.css';

const VenuePOSSetup = () => {
  const [venueDetails, setVenueDetails] = useState({
    name: '',
    type: '',
    email: '',
    phone: '',
    address: '',
    acceptStablecoin: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSetupStatus(null);
    setErrorMessage('');

    try {
      console.log('Sending venue details:', venueDetails);
      
      const response = await fetch('/api/venue/setup-pos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueDetails)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
        console.log('Server response:', data);
      } catch (parseError) {
        console.error('JSON Parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      if (data.success) {
        setSetupStatus('success');
        localStorage.setItem('venueData', JSON.stringify(data.data));
        setTimeout(() => {
          window.location.href = '/venue/pos';
        }, 2000);
      } else {
        setSetupStatus('error');
        setErrorMessage(data.message || 'Failed to setup POS');
      }
    } catch (error) {
      console.error('Failed to setup POS:', error);
      setSetupStatus('error');
      setErrorMessage(error.message || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-form">
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Setup Your Venue POS</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Venue Name Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Venue Name</label>
            <input
              type="text"
              value={venueDetails.name}
              onChange={(e) => setVenueDetails({...venueDetails, name: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={venueDetails.email}
              onChange={(e) => setVenueDetails({...venueDetails, email: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          {/* Phone Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
            <input
              type="tel"
              value={venueDetails.phone}
              onChange={(e) => setVenueDetails({...venueDetails, phone: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>

          {/* Address Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
            <input
              type="text"
              value={venueDetails.address}
              onChange={(e) => setVenueDetails({...venueDetails, address: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>
          
          {/* Venue Type Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Venue Type</label>
            <select
              value={venueDetails.type}
              onChange={(e) => setVenueDetails({...venueDetails, type: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            >
              <option value="">Select Type</option>
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar</option>
              <option value="cafe">Cafe</option>
              <option value="club">Club</option>
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

          {/* Status Messages */}
          {setupStatus === 'success' && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#e6ffe6', 
              color: '#008000',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              POS setup successful! Redirecting to your POS dashboard...
            </div>
          )}

          {setupStatus === 'error' && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#ffe6e6', 
              color: '#cc0000',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {errorMessage || 'Failed to setup POS. Please try again.'}
            </div>
          )}
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#cccccc' : '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {isLoading ? 'Setting up...' : 'Create POS Instance'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VenuePOSSetup;