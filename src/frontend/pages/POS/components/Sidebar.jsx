import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ userRole }) => {
  return (
    <div className="pos-sidebar">
      <div className="sidebar-header">
        <h2>POS System</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/venue/pos/dashboard">Dashboard</Link>
        <Link to="/venue/pos/orders">Orders</Link>
        <Link to="/venue/pos/kitchen">Kitchen</Link>
        {userRole === 'manager' && (
          <>
            <Link to="/venue/pos/sales">Sales</Link>
            <Link to="/venue/pos/staff">Staff</Link>
            <Link to="/venue/pos/analytics">Analytics</Link>
            <Link to="/venue/pos/settings">Settings</Link>
            <Link to="/venue/pos/menu">Menu</Link>
            <Link to="/venue/pos/inventory">Inventory</Link>
            <Link to="/venue/pos/system">POS System</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;