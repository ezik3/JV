import React from 'react';
import NocturneLayout from './NocturneLayout';
import POSInventory from '../components/POSInventory';

const NocturnePOSInventoryWrapper = () => {
  return (
    <NocturneLayout>
      <POSInventory />
    </NocturneLayout>
  );
};

export default NocturnePOSInventoryWrapper;
