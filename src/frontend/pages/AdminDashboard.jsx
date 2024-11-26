import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pendingVenues, setPendingVenues] = useState([]);

  useEffect(() => {
    fetchPendingVenues();
  }, []);

  const fetchPendingVenues = async () => {
    try {
      const response = await axios.get('/api/venue/admin/pending-venues', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPendingVenues(response.data);
    } catch (error) {
      console.error('Error fetching pending venues:', error);
      // Add this line to see the error message on the page
      setPendingVenues([{ _id: 'error', venueName: `Error: ${error.message}` }]);
    }
  };

  const handleVerification = async (userId, isApproved) => {
    try {
      await axios.post('/api/venue/admin/verify', 
        { userId, isApproved },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchPendingVenues(); // Refresh the list after verification
    } catch (error) {
      console.error('Error processing verification:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Pending Venue Verifications</h2>
      {pendingVenues.length === 0 ? (
        <p>No pending verifications</p>
      ) : (
        <ul className="venue-list">
          {pendingVenues.map((venue) => (
            <li key={venue._id} className="venue-item">
              <h3>{venue.venueName}</h3>
              <p>Email: {venue.email}</p>
              <p>Address: {venue.address}</p>
              <p>Venue Type: {venue.venueType}</p>
              <div className="verification-actions">
                <button onClick={() => handleVerification(venue._id, true)} className="approve-btn">
                  Approve
                </button>
                <button onClick={() => handleVerification(venue._id, false)} className="reject-btn">
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;