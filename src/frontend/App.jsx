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
import { POSProvider } from './context/POSContext';
import POSMenuBuilder from './pages/POS/POSMenuBuilder';
import POSInventory from './pages/POS/POSInventory';
import SimplifiedPOS from './pages/POS/SimplifiedPOS';
import POSDashboard from './pages/POS/POSDashboard';
import WalletPage from './pages/Wallet/WalletPage';

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
          {/* ... other public routes ... */}
            <Route 
              path="/profile-setup" 
              render={(props) => {
                const userId = localStorage.getItem('userId');
                console.log('ProfileSetup Route - userId:', userId);
                
                if (!userId) {
                  return <Redirect to="/login" />;
                }
                
                return (
                  <ProfileSetup
                    userId={userId}
                    userRole="user"
                    onComplete={() => props.history.push('/home')}
                    {...props}
                  />
                );
              }} 
            />
                              {/* Add the wallet route here */}
                              <Route path="/wallet" render={(props) => (
                                <ErrorBoundary>
                                  <WalletPage {...props} />
                                </ErrorBoundary>
                              )} />
          {/* Venue routes */}
          <Route path="/venue">
            <VenueAuthProvider>
              <Switch>
                <Route exact path="/venue/home" component={VenueOwnerHome} />
                <Route path="/venue/messages" component={VenueMessages} />
                <Route path="/venue/notifications" component={VenueNotifications} />
                <Route path="/venue/settings" component={VenueSettings} />
                <Route path="/venue/accounts" component={VenueAccounts} />
                <Route path="/venue/credits" render={() => <div style={{padding: '20px'}}>Credits page - Coming Soon</div>} />
                
                {/* POS routes wrapped in POSProvider */}
                <Route path="/venue/pos">
                  <POSErrorBoundary>
                    <POSProvider>
                      <Switch>
                        <Route exact path="/venue/pos/dashboard" component={POSDashboard} />
                        <Route exact path="/venue/pos/menu" component={POSMenuBuilder} />
                        <Route exact path="/venue/pos/inventory" component={POSInventory} />
                        <Route exact path="/venue/pos/system" component={SimplifiedPOS} />
                      </Switch>
                    </POSProvider>
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
