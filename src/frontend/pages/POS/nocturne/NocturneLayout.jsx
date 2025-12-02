import React from 'react';
import NocturneSidebar from './NocturneSidebar';
import './nocturne-pos.css';

const NocturneLayout = ({ children }) => {
  return (
    <div className="nocturne-pos flex min-h-screen w-full">
      <NocturneSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default NocturneLayout;
