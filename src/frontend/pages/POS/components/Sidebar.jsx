import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  return (
    <div className="pos-sidebar">
      <div className="sidebar-header">
        <h2>POS System</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/venue/pos/dashboard">Dashboard</Link>
        <Link to="/venue/pos/order">Orders</Link>
        <Link to="/venue/pos/kitchen">Kitchen</Link>
        {userRole === 'manager' && (
          <>
            <Link to="/venue/pos/sales">Sales</Link>
            <Link to="/venue/pos/staff">Staff</Link>
            <Link to="/venue/pos/analytics">Analytics</Link>
            <Link to="/venue/pos/settings">Settings</Link>
            <Link to="/venue/pos/menu-management">Menu</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;