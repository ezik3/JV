import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ userRole = 'manager' }) => {
  const menuItems = userRole === 'manager' ? [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/venue/pos/order', label: 'Orders', icon: '📝' },
    { path: '/venue/pos/kitchen', label: 'Kitchen', icon: '🍳' },
    { path: '/venue/pos/menu-management', label: 'Menu', icon: '📋' },
    { path: '/venue/pos/inventory', label: 'Inventory', icon: '📦' },
    { path: '/venue/pos/sales', label: 'Sales', icon: '💰' },
    { path: '/venue/pos/staff', label: 'Staff', icon: '👥' },
    { path: '/venue/pos/analytics', label: 'Analytics', icon: '📈' },
    { path: '/venue/pos/settings', label: 'Settings', icon: '⚙️' },
    { path: '/venue/pos/jv-list', label: 'JV-LIST', icon: '📝' }
  ] : [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/venue/pos/order', label: 'Orders', icon: '📝' },
    { path: '/venue/pos/kitchen', label: 'Kitchen', icon: '🍳' }
  ];

  return (
    <aside className="pos-sidebar" style={{ border: '3px solid lime' }}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🎵</span>
          <span className="logo-text">JointVibe POS</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className="nav-link"
                activeClassName="active"
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;