import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import POSLogin from './POSLogin';
import POSSignup from './POSSignup';
import NocturneDashboard from './NocturneDashboard';
import NocturnePOSLayout from './NocturnePOSLayout';
import './nocturne-pos.css';

// Import existing POS components from the JV repo
import POSMenuBuilder from '../components/POSMenuBuilder';
import POSInventory from '../components/POSInventory';
import SimplifiedPOS from '../components/SimplifiedPOS';
import POSOrders from '../components/POSOrders';

// Protected route wrapper for POS
const ProtectedPOSRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token || userRole !== 'venue') {
    // If not authenticated, show login
    return <POSLogin />;
  }
  
  return children;
};

export default function NocturnePOSEntry() {
  const { path } = useRouteMatch();
  
  return (
    <Switch>
      {/* Auth routes - no layout */}
      <Route exact path={path}>
        <POSLogin />
      </Route>
      <Route path={`${path}/signup`}>
        <POSSignup />
      </Route>
      
      {/* Protected POS routes - with layout */}
      <Route path={`${path}/dashboard`}>
        <ProtectedPOSRoute>
          <NocturnePOSLayout>
            <NocturneDashboard />
          </NocturnePOSLayout>
        </ProtectedPOSRoute>
      </Route>
      
      <Route path={`${path}/menu`}>
        <ProtectedPOSRoute>
          <NocturnePOSLayout>
            <POSMenuBuilder />
          </NocturnePOSLayout>
        </ProtectedPOSRoute>
      </Route>
      
      <Route path={`${path}/inventory`}>
        <ProtectedPOSRoute>
          <NocturnePOSLayout>
            <POSInventory />
          </NocturnePOSLayout>
        </ProtectedPOSRoute>
      </Route>
      
      <Route path={`${path}/system`}>
        <ProtectedPOSRoute>
          <NocturnePOSLayout>
            <SimplifiedPOS />
          </NocturnePOSLayout>
        </ProtectedPOSRoute>
      </Route>
      
      <Route path={`${path}/orders`}>
        <ProtectedPOSRoute>
          <NocturnePOSLayout>
            <POSOrders />
          </NocturnePOSLayout>
        </ProtectedPOSRoute>
      </Route>
      
      {/* Fallback to login */}
      <Route>
        <POSLogin />
      </Route>
    </Switch>
  );
}
