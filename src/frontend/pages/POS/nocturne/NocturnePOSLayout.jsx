import React from 'react';
import NocturneSidebar from './NocturneSidebar';
import './nocturne-pos.css';

export default function NocturnePOSLayout({ children }) {
  return (
    <div className="nocturne-pos flex min-h-screen w-full bg-background">
      <NocturneSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
