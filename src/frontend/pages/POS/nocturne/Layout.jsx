import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import './nocturne.css';

const Layout = ({ children }) => {
  useEffect(() => {
    // Ensure CSS variables are applied
    document.documentElement.style.setProperty('--background', '0 0% 100%');
    document.documentElement.style.setProperty('--foreground', '222.2 47.4% 11.2%');
  }, []);

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: 'hsl(0, 0%, 100%)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
