// src/frontend/pages/POS/components/POSDashboard.jsx
import React from 'react';
import { usePOS } from '../../../contexts/POSContext';
import EnhancedDashboard from './EnhancedDashboard';

const POSDashboard = () => {
  const { orders } = usePOS();

  return (
    <div style={{ padding: 20 }}>
      <h1>POS Dashboard</h1>

      <EnhancedDashboard />

      <div style={{ marginTop: 20 }}>
        <h3>Orders Loaded from POSContext:</h3>
        <pre>{JSON.stringify(orders, null, 2)}</pre>
      </div>
    </div>
  );
};

export default POSDashboard;
