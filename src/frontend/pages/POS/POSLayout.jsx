import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const POSLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      <Sidebar userRole="manager" />
      <div style={{ flex: 1, padding: '20px', background: '#0F172A', color: '#F8FAFC' }}>
        {children}
      </div>
    </div>
  );
};

export default POSLayout;