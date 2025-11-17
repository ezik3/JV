import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const StaffSetup = () => {
  const [step, setStep] = useState('search'); // search, setup, confirm
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [staffPin, setStaffPin] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const searchEndUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Here you would search your users database
      // For now, we'll simulate finding a user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSelectedUser({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://via.placeholder.com/150'
      });
      
      setStep('setup');
    } catch (err) {
      console.error('Error searching for user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePinGeneration = async () => {
    // Generate a random 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setStaffPin(pin);
    setStep('confirm');
  };

  const handleStaffSetup = async () => {
    try {
      setLoading(true);
      // Here you would save the staff member to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return to staff management
      history.push('/pos/dashboard/manager/staff');
    } catch (err) {
      console.error('Error setting up staff:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-page">
      <div className="setup-container">
        {step === 'search' && (
          <div className="search-section">
            <h2>Add New Staff Member</h2>
            <p>Search for user by name or email</p>
            
            <form onSubmit={searchEndUser}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        )}

        {step === 'setup' && selectedUser && (
          <div className="setup-section">
            <h2>Configure Staff Access</h2>
            
            <div className="user-card">
              <img src={selectedUser.profilePicture} alt={selectedUser.name} />
              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.email}</p>
            </div>

            <div className="permissions">
              <h4>Staff Permissions</h4>
              <label>
                <input type="checkbox" /> Take Orders
              </label>
              <label>
                <input type="checkbox" /> Process Payments
              </label>
              <label>
                <input type="checkbox" /> View Reports
              </label>
            </div>

            <button onClick={handlePinGeneration} disabled={loading}>
              Generate PIN
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="confirm-section">
            <h2>Staff PIN Generated</h2>
            <div className="pin-display">
              <h3>Staff PIN:</h3>
              <div className="pin">{staffPin}</div>
              <p>Make sure to share this PIN securely with the staff member</p>
            </div>

            <button onClick={handleStaffSetup} disabled={loading}>
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffSetup;