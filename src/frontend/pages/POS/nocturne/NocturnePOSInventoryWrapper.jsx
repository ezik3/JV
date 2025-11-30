import React from 'react';
import NocturnePOSLayout from './NocturnePOSLayout';
import POSInventory from '../components/POSInventory';

// Wrapper component for Wasp routing - combines layout and POSInventory
export default function NocturnePOSInventoryWrapper() {
  return (
    <NocturnePOSLayout>
      <POSInventory />
    </NocturnePOSLayout>
  );
}
