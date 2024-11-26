import React, { useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'; // Changed from Routes
import Sidebar from './components/Sidebar';
import StaffLogin from './auth/StaffLogin';
import Dashboard from './screens/Dashboard';
import SalesOverview from './screens/SalesOverview';
import StaffManagement from './screens/StaffManagement';
import VenueSettings from './screens/VenueSettings';
import Analytics from './screens/Analytics';
import Kitchen from './screens/Kitchen';
import './styles/pos.css';

const POSInterface = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const history = useHistory(); // Use useHistory instead of useNavigate

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <StaffLogin onLogin={(role) => {
      setIsAuthenticated(true);
      setUserRole(role);
      history.push('/pos/dashboard'); // Use history.push instead of navigate
    }} />;
  }

  return (
    <div className="pos-interface">
      <Sidebar userRole={userRole} />
      <div className="pos-content">
        <Switch>
          {/* Staff Routes */}
          <Route path="/pos/dashboard" component={Dashboard} />
          <Route path="/pos/orders" component={Kitchen} />
          
          {/* Manager-only Routes */}
          {userRole === 'manager' && (
            <>
              <Route path="/pos/sales" component={SalesOverview} />
              <Route path="/pos/staff" component={StaffManagement} />
              <Route path="/pos/analytics" component={Analytics} />
              <Route path="/pos/settings" component={VenueSettings} />
            </>
          )}
          
          {/* Default redirect */}
          <Route path="/pos" exact component={Dashboard} />
        </Switch>
      </div>
    </div>
  );
};

export default POSInterface;