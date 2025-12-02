import React from 'react';
import Sidebar from './Sidebar';
import './nocturne.css';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
