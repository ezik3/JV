/**
 * Nocturne POS Interface
 * Main entry point for the Nocturne POS system
 */

import React, { useState } from 'react';
import { POSProvider } from './contexts/POSContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Kitchen from './pages/Kitchen';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Tables from './pages/Tables';
import Sales from './pages/Sales';
import Staff from './pages/Staff';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Import global styles for Nocturne POS
import './nocturne-styles.css';

const NocturneInterface = ({ venueId, userId, ...props }) => {
  const [activePage, setActivePage] = useState('dashboard');

  // Render the appropriate page based on activePage state
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-order':
        return <NewOrder />;
      case 'kitchen':
        return <Kitchen />;
      case 'orders':
        return <Orders />;
      case 'menu':
        return <Menu />;
      case 'inventory':
        return <Inventory />;
      case 'tables':
        return <Tables />;
      case 'sales':
        return <Sales />;
      case 'staff':
        return <Staff />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <POSProvider venueId={venueId}>
      <div className="nocturne-pos-wrapper">
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
          <Sidebar onNavigate={setActivePage} activePage={activePage} />
          <main style={{ flex: 1, overflow: 'auto' }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </POSProvider>
  );
};

export default NocturneInterface;
