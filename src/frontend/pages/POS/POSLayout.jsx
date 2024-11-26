import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { POSProvider } from '../../context/POSContext';
import POSMenuBuilder from './components/POSMenuBuilder';
import POSInventory from './components/POSInventory';
import SimplifiedPOS from './components/SimplifiedPOS';

const POSLayout = () => {
  return (
    <POSProvider>
      <Switch>
        <Route path="/venue/pos/menu" component={POSMenuBuilder} />
        <Route path="/venue/pos/inventory" component={POSInventory} />
        <Route path="/venue/pos/system" component={SimplifiedPOS} />
      </Switch>
    </POSProvider>
  );
};

export default POSLayout;