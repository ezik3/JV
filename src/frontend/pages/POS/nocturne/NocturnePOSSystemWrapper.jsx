import React from 'react';
import NocturnePOSLayout from './NocturnePOSLayout';
import SimplifiedPOS from '../components/SimplifiedPOS';

// Wrapper component for Wasp routing - combines layout and SimplifiedPOS
export default function NocturnePOSSystemWrapper() {
  return (
    <NocturnePOSLayout>
      <SimplifiedPOS />
    </NocturnePOSLayout>
  );
}
