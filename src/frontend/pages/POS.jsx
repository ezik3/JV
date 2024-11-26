import React from 'react';
import VenueOrders from '../pages/VenueOrders';
import POSInterface from '../components/POSInterface';

const POS = () => {
  return (
    <div>
      <h1>Venue POS System</h1>
      <VenueOrders />
      <POSInterface />
    </div>
  );
};

export default POS;