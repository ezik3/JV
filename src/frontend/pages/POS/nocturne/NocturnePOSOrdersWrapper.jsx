import React from 'react';
import NocturnePOSLayout from './NocturnePOSLayout';
import POSOrders from '../components/POSOrders';

// Wrapper component for Wasp routing - combines layout and POSOrders
export default function NocturnePOSOrdersWrapper() {
  return (
    <NocturnePOSLayout>
      <POSOrders />
    </NocturnePOSLayout>
  );
}
