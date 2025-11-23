// src/frontend/pages/POS/POSAuthManager.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const POSAuthManager = () => {
  const [name, setName] = useState('');
  const [venueName, setVenueName] = useState('');
  const history = useHistory();

  const onCreateManager = async (e) => {
    e.preventDefault();
    // TODO: call backend to create manager and set venue->manager
    // For now, mark local role and redirect to dashboard
    localStorage.setItem('venueRole', 'manager');
    // TODO: ideally save manager info to backend & create account
    history.push('/venue/pos/dashboard');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Activate POS — Manager Signup</h2>
      <p>This flow creates the first manager for this venue and activates the POS.</p>
      <form onSubmit={onCreateManager}>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label><br />
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Venue name</label><br />
          <input value={venueName} onChange={e => setVenueName(e.target.value)} required />
        </div>
        <button type="submit">Activate POS</button>
      </form>
    </div>
  );
};

export default POSAuthManager;
