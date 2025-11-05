import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { POSProvider } from '../../context/POSContext';
import Sidebar from '../../components/Sidebar';
import POSDashboard from './components/POSDashboard';
import POSMenuBuilder from './components/POSMenuBuilder';
import POSInventory from './components/POSInventory';
import SimplifiedPOS from './components/SimplifiedPOS';
import POSOrders from './components/POSOrders';
import Kitchen from './components/Kitchen';
import MenuManagement from './components/MenuManagement';
import SalesOverview from './components/SalesOverview';
import StaffManagement from './components/StaffManagement';
import Analytics from './components/Analytics';
import VenueSettings from './components/VenueSettings';

const POSLayout = () => {
  // Get user role from localStorage or context
  const userRole = localStorage.getItem('venueRole') || 'manager';

  return (
    <POSProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-darker, #151922)' }}>
        <Sidebar userRole={userRole} />
        <main style={{ marginLeft: '250px', flex: 1, padding: '20px', overflow: 'auto' }}>
          <Switch>
            <Route exact path="/venue/pos/dashboard" component={POSDashboard} />
            <Route exact path="/venue/pos/order" component={POSOrders} />
            <Route exact path="/venue/pos/kitchen" component={Kitchen} />
            <Route exact path="/venue/pos/menu-management" component={MenuManagement} />
            <Route exact path="/venue/pos/inventory" component={POSInventory} />
            <Route exact path="/venue/pos/sales" component={SalesOverview} />
            <Route exact path="/venue/pos/staff" component={StaffManagement} />
            <Route exact path="/venue/pos/analytics" component={Analytics} />
            <Route exact path="/venue/pos/settings" component={VenueSettings} />
            <Route exact path="/venue/pos/jv-list" render={() => <div>JV-LIST - Coming Soon</div>} />
            <Route exact path="/venue/pos/menu" component={POSMenuBuilder} />
            <Route exact path="/venue/pos/system" component={SimplifiedPOS} />
          </Switch>
        </main>
      </div>
    </POSProvider>
  );
};

export default POSLayout;