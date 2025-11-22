import React, { useMemo } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { POSProvider } from '../../contexts/POSContext'; // keep this path if your POSContext is in `contexts/`
import POSDashboard from './components/POSDashboard';
import POSMenuBuilder from './components/POSMenuBuilder';
import POSInventory from './components/POSInventory';
import SimplifiedPOS from './components/SimplifiedPOS';
import POSOrders from './components/POSOrders';
import Kitchen from './components/Kitchen';
import SalesOverview from './components/SalesOverview';
import StaffManagement from './components/StaffManagement';
import Analytics from './components/Analytics';
import TablesView from './components/TablesView';
import Floorplan from './components/Floorplan';
import VenueSettings from './components/VenueSettings';
import POSAuthManager from './components/POSAuthManager'; // placeholder - implement auth UI for manager signup/login
import './pos-layout.css';

const POSLayout = () => {
  const { path } = useRouteMatch();

  // Determine role (manager / staff) from localStorage or POSContext or venue data
  const userRole = useMemo(() => {
    try {
      return localStorage.getItem('venueRole') || 'staff';
    } catch (e) {
      return 'staff';
    }
  }, []);

  return (
    <POSProvider>
      <div className="pos-layout-container">
        <Sidebar userRole={userRole} />
        <main className="pos-main-content">
          <Switch>
            {/* Manager auth route (first time activation/signup) */}
            <Route path={`${path}/auth/manager`} component={POSAuthManager} />

            {/* Core POS pages */}
            <Route exact path={`${path}/dashboard`} component={POSDashboard} />
            <Route exact path={`${path}/order`} component={POSOrders} />
            <Route exact path={`${path}/orders`} component={POSOrders} />
            <Route exact path={`${path}/kitchen`} component={Kitchen} />
            <Route exact path={`${path}/menu`} component={POSMenuBuilder} />
            <Route exact path={`${path}/inventory`} component={POSInventory} />
            <Route exact path={`${path}/tables`} component={TablesView} />
            <Route exact path={`${path}/floorplan`} component={Floorplan} />
            <Route exact path={`${path}/sales`} component={SalesOverview} />
            <Route exact path={`${path}/staff`} component={StaffManagement} />
            <Route exact path={`${path}/analytics`} component={Analytics} />
            <Route exact path={`${path}/settings`} component={VenueSettings} />
            <Route exact path={`${path}/system`} component={SimplifiedPOS} />

            {/* root of pos -> redirect to dashboard */}
            <Route exact path={`${path}`}>
              <Redirect to={`${path}/dashboard`} />
            </Route>
          </Switch>
        </main>
      </div>
    </POSProvider>
  );
};

export default POSLayout;
