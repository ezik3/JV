import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = userRole === 'manager' ? [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/venue/pos/menu', label: 'Menu Builder', icon: '📝' },
    { path: '/venue/pos/inventory', label: 'Inventory', icon: '📦' },
    { path: '/venue/pos/system', label: 'System', icon: '⚙️' },
    { path: '/venue/orders', label: 'Orders', icon: '🍽️' }
  ] : [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/venue/pos/menu', label: 'Menu', icon: '📝' },
    { path: '/venue/orders', label: 'Orders', icon: '🍽️' }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">🎵</span>
        JointVibe POS
      </div>
      <nav className="nav-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;