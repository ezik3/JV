import React, { useMemo } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

// Layout + UI
import Sidebar from '../../components/Sidebar';
import './pos-layout.css';

// POS Context
import POSProvider from '../../contexts/POSContext';

// POS Pages
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

// Manager auth (first-time POS setup)
import POSAuthManager from './components/POSAuthManager';

const POSLayout = () => {
  const { path } = useRouteMatch();

  // Detect user role (manager / staff / default)
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

            {/* ==========  POS Activation (manager signup) ========== */}
            <Route
              path={`${path}/auth/manager`}
              component={POSAuthManager}
            />

            {/* ==========  Core POS Routes  ========== */}
            <Route
              exact
              path={`${path}/dashboard`}
              component={POSDashboard}
            />

            <Route
              exact
              path={`${path}/order`}
              component={POSOrders}
            />

            <Route
              exact
              path={`${path}/orders`}
              component={POSOrders}
            />

            <Route
              exact
              path={`${path}/kitchen`}
              component={Kitchen}
            />

            <Route
              exact
              path={`${path}/menu`}
              component={POSMenuBuilder}
            />

            <Route
              exact
              path={`${path}/inventory`}
              component={POSInventory}
            />

            <Route
              exact
              path={`${path}/tables`}
              component={TablesView}
            />

            <Route
              exact
              path={`${path}/floorplan`}
              component={Floorplan}
            />

            <Route
              exact
              path={`${path}/sales`}
              component={SalesOverview}
            />

            <Route
              exact
              path={`${path}/staff`}
              component={StaffManagement}
            />

            <Route
              exact
              path={`${path}/analytics`}
              component={Analytics}
            />

            <Route
              exact
              path={`${path}/settings`}
              component={VenueSettings}
            />

            <Route
              exact
              path={`${path}/system`}
              component={SimplifiedPOS}
            />

            {/* ========== Default redirect (root -> dashboard) ========== */}
            <Route exact path={path}>
              <Redirect to={`${path}/dashboard`} />
            </Route>

          </Switch>
        </main>
      </div>
    </POSProvider>
  );
};

export default POSLayout;
