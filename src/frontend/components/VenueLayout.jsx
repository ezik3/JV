import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const VenueLayout = ({ children }) => {
  const location = useLocation();
  // Exclude ALL POS routes from VenueLayout - POS has its own layout with sidebar
  const noLayoutRoutes = ['/venue/pos/login'];
  const shouldShowLayout = !noLayoutRoutes.includes(location.pathname) && !location.pathname.startsWith('/venue/pos');

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  if (!shouldShowLayout) {
    return children;
  }

  return (
    <div className="venue-layout">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/venue/home" className={isActiveRoute('/venue/home')}>Home</Link>
          <Link to="/venue/pos" className={isActiveRoute('/venue/pos')}>POS</Link>
          <Link to="/venue/credits" className={isActiveRoute('/venue/credits')}>Credits</Link>
          <Link to="/venue/notifications" className={isActiveRoute('/venue/notifications')}>Notifications</Link>
          <Link to="/venue/messages" className={isActiveRoute('/venue/messages')}>Messages</Link>
          <Link to="/venue/account" className={isActiveRoute('/venue/account')}>Account</Link>
          <Link to="/venue/settings" className={isActiveRoute('/venue/settings')}>Settings</Link>
        </div>
      </nav>

      <div className="venue-content">
        {children}
      </div>

      <style jsx>{`
        .venue-layout {
          min-height: 100vh;
          background: var(--surface-darker, #151922);
        }

        .navbar {
          background-color: var(--surface-dark, #1A1F2C);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
        }

        .nav-item {
          color: var(--text-secondary, #94A3B8);
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .nav-item:hover {
          color: var(--text-primary, #F8FAFC);
          background: var(--surface-light, #2A303C);
        }

        .nav-item.active {
          color: var(--text-primary, #F8FAFC);
          background: var(--primary, #06B6D4);
        }

        .venue-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
      `}</style>
    </div>
  );
};

export default VenueLayout;
