/**
 * Nocturne POS Interface
 * Main entry point for the Nocturne POS system
 */

import React, { useState } from 'react';
import { POSProvider } from './contexts/POSContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Menu from './pages/Menu';

export default function NocturneInterface() {
  const [activePage, setActivePage] = useState('dashboard');

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
    <POSProvider>
      <div className="flex min-h-screen bg-noc">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </POSProvider>
  );
}
