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
import './pos-layout.css';

const POSLayout = () => {
  // Get user role from localStorage or context
  // Default to 'staff' (more restrictive) if not set
  const userRole = localStorage.getItem('venueRole') || 'staff';

  return (
    <POSProvider>
      <div className="pos-layout-container">
        <Sidebar userRole={userRole} />
        <main className="pos-main-content">
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