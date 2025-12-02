import React from 'react';
import NocturneLayout from './NocturneLayout';
import POSMenuBuilder from '../components/POSMenuBuilder';

const NocturnePOSMenuWrapper = () => {
  return (
    <NocturneLayout>
      <POSMenuBuilder />
    </NocturneLayout>
  );
};

export default NocturnePOSMenuWrapper;
