import React from 'react';
import NocturnePOSLayout from './NocturnePOSLayout';
import POSMenuBuilder from '../components/POSMenuBuilder';

// Wrapper component for Wasp routing - combines layout and POSMenuBuilder
export default function NocturnePOSMenuWrapper() {
  return (
    <NocturnePOSLayout>
      <POSMenuBuilder />
    </NocturnePOSLayout>
  );
}
