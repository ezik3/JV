/**
 * Nocturne POS Interface
 * Main entry point for the Nocturne POS system
 * Clean JavaScript implementation - no external dependencies
 */

import React, { useState } from 'react';
import { POSProvider } from './contexts/POSContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Menu from './pages/Menu';

const NocturneInterface = ({ venueId, userId, ...props }) => {
  const [activePage, setActivePage] = useState('dashboard');

  // Render the appropriate page based on activePage state
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-order':
        return <NewOrder />;
      case 'orders':
        return <Orders />;
      case 'menu':
        return <Menu />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <POSProvider venueId={venueId}>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#f7fafc' }}>
        <Sidebar onNavigate={setActivePage} activePage={activePage} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </POSProvider>
  );
};

export default NocturneInterface;
