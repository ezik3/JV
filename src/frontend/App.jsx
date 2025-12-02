import React, { useState } from 'react';
import './styles/global.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import RegistrationFlow from './User/RegistrationFlow';
import GenerateKeys from './pages/GenerateKeys';
import Maps from './pages/Maps';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import VenueOwnerHome from './pages/VenueOwnerHome';
import CheckInSystem from './components/CheckInSystem';
import AIWaiter from './components/AIWaiter';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import UserEmailVerification from './User/UserEmailVerification';
import UserPhoneVerification from './User/UserPhoneVerification';
import VenueRegistrationFlow from './pages/VenueRegistrationFlow';
import VenueAccounts from './pages/VenueAccounts';
import CityView from './pages/CityView';
import ErrorBoundary from './components/ErrorBoundary';
import ProfileSetup from './components/ProfileSetup';
import VenueHomeFeed from './pages/VenueHomeFeed';
import OdooTest from './components/OdooTest';
import VenueLayout from './components/VenueLayout';
import { POSInterface } from './pages/POS/POSInterface';
import { OrderProvider } from './contexts/OrderContext';
import ProtectedRoute from './components/ProtectedRoute';
import POSErrorBoundary from './components/POSErrorBoundary';
import { VenueAuthProvider } from './context/VenueAuthContext';
import VenueMessages from './pages/VenueMessages';
import VenueNotifications from './pages/VenueNotifications';
import VenueSettings from './pages/VenueSettings';
import WalletPage from './pages/Wallet/WalletPage';
import NocturneLayout from './pages/POS/nocturne/Layout';
import Login from './pages/POS/nocturne/Login';
import Dashboard from './pages/POS/nocturne/Dashboard';
import NewOrder from './pages/POS/nocturne/NewOrder';
import Orders from './pages/POS/nocturne/Orders';
import Kitchen from './pages/POS/nocturne/Kitchen';
import Menu from './pages/POS/nocturne/Menu';
import Tables from './pages/POS/nocturne/Tables';
import Floorplan from './pages/POS/nocturne/Floorplan';
import Inventory from './pages/POS/nocturne/Inventory';
import Analytics from './pages/POS/nocturne/Analytics';
import Staff from './pages/POS/nocturne/Staff';
import Settings from './pages/POS/nocturne/Settings';

function App() {
  const [currentVenue, setCurrentVenue] = useState(null);

  return (
    <OrderProvider>
      <Router>
        <Switch>
          {/* Public routes */}
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={Login} />

          <Route 
            path="/profile-setup" 
            render={(props) => {
              const userId = localStorage.getItem('userId');
              if (!userId) return <Redirect to="/login" />;
              return <ProfileSetup userId={userId} userRole="user" onComplete={() => props.history.push('/home')} {...props} />;
            }} 
          />

          <Route 
            path="/wallet" 
            render={(props) => (
              <ErrorBoundary>
                <WalletPage {...props} />
              </ErrorBoundary>
            )} 
          />

          {/* Venue routes */}
          <Route path="/venue">
            <VenueAuthProvider>
              <Switch>
                <Route exact path="/venue/home" component={VenueOwnerHome} />
                <Route path="/venue/messages" component={VenueMessages} />
                <Route path="/venue/notifications" component={VenueNotifications} />
                <Route path="/venue/settings" component={VenueSettings} />
                <Route path="/venue/accounts" component={VenueAccounts} />
                <Route path="/venue/credits" render={() => <div style={{ padding: '20px' }}>Credits page - Coming Soon</div>} />

                {/* POS routes - Nocturne Integration */}
                <Route path="/venue/pos">
                  <POSErrorBoundary>
                    <Switch>
                      <Route exact path="/venue/pos" component={Login} />
                      <Route path="/venue/pos">
                        <NocturneLayout>
                          <Switch>
                            <Route exact path="/venue/pos/dashboard" component={Dashboard} />
                            <Route exact path="/venue/pos/new-order" component={NewOrder} />
                            <Route exact path="/venue/pos/orders" component={Orders} />
                            <Route exact path="/venue/pos/kitchen" component={Kitchen} />
                            <Route exact path="/venue/pos/menu" component={Menu} />
                            <Route exact path="/venue/pos/tables" component={Tables} />
                            <Route exact path="/venue/pos/floorplan" component={Floorplan} />
                            <Route exact path="/venue/pos/inventory" component={Inventory} />
                            <Route exact path="/venue/pos/analytics" component={Analytics} />
                            <Route exact path="/venue/pos/staff" component={Staff} />
                            <Route exact path="/venue/pos/settings" component={Settings} />
                          </Switch>
                        </NocturneLayout>
                      </Route>
                    </Switch>
                  </POSErrorBoundary>
                </Route>

              </Switch>
            </VenueAuthProvider>
          </Route>

          {/* 404 route */}
          <Route path="*" render={() => <div>404 Not Found</div>} />
        </Switch>
      </Router>
    </OrderProvider>
  );
}

export default App;
