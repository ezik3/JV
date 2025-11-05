import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ userRole = 'manager' }) => {
  const location = useLocation();
  
  return (
    <div className="pos-sidebar">
      <div className="sidebar-header">
        <h1>JV POS</h1>
        <div className="user-role">{userRole}</div>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/venue/pos/dashboard" 
          className={`nav-item ${location.pathname === '/venue/pos/dashboard' ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </Link>
        <Link 
          to="/venue/pos/order" 
          className={`nav-item ${location.pathname === '/venue/pos/order' ? 'active' : ''}`}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">New Order</span>
        </Link>
        <Link 
          to="/venue/pos/kitchen" 
          className={`nav-item ${location.pathname === '/venue/pos/kitchen' ? 'active' : ''}`}
        >
          <span className="nav-icon">🍳</span>
          <span className="nav-label">Kitchen</span>
        </Link>
        {userRole === 'manager' && (
          <>
            <Link 
              to="/venue/pos/menu-management" 
              className={`nav-item ${location.pathname === '/venue/pos/menu-management' ? 'active' : ''}`}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-label">Menu</span>
            </Link>
            <Link 
              to="/venue/pos/inventory" 
              className={`nav-item ${location.pathname === '/venue/pos/inventory' ? 'active' : ''}`}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-label">Inventory</span>
            </Link>
            <Link 
              to="/venue/pos/sales" 
              className={`nav-item ${location.pathname === '/venue/pos/sales' ? 'active' : ''}`}
            >
              <span className="nav-icon">💰</span>
              <span className="nav-label">Sales</span>
            </Link>
            <Link 
              to="/venue/pos/staff" 
              className={`nav-item ${location.pathname === '/venue/pos/staff' ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Staff</span>
            </Link>
            <Link 
              to="/venue/pos/analytics" 
              className={`nav-item ${location.pathname === '/venue/pos/analytics' ? 'active' : ''}`}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-label">Analytics</span>
            </Link>
            <Link 
              to="/venue/pos/settings" 
              className={`nav-item ${location.pathname === '/venue/pos/settings' ? 'active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Settings</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
