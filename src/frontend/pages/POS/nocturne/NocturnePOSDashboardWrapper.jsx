import React from 'react';
import NocturnePOSLayout from './NocturnePOSLayout';
import NocturneDashboard from './NocturneDashboard';

// Wrapper component for Wasp routing - combines layout and dashboard
export default function NocturnePOSDashboardWrapper() {
  return (
    <NocturnePOSLayout>
      <NocturneDashboard />
    </NocturnePOSLayout>
  );
}
