import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import '../styles/posOrders.css';

const POSOrders = () => {
  const [activeTab, setActiveTab] = useState('All Orders');

  const stats = [
    { value: '24', label: 'Active Orders' },
    { value: '8', label: 'Pending Orders' },
    { value: '12', label: 'Preparing' },
    { value: '4', label: 'Ready for Pickup' }
  ];

  const orders = [
    {
      id: '#ORD-2345',
      status: 'pending',
      items: [
        { name: 'Mojito', quantity: 2 },
        { name: 'Craft Beer', quantity: 1 }
      ],
      table: '12',
      total: '$32.00'
    },
    {
      id: '#ORD-2346',
      status: 'preparing',
      items: [
        { name: 'Margarita', quantity: 3 },
        { name: 'Wine (Red)', quantity: 2 }
      ],
      table: '8',
      total: '$54.00'
    },
    {
      id: '#ORD-2347',
      status: 'ready',
      items: [
        { name: 'Old Fashioned', quantity: 1 },
        { name: 'Gin & Tonic', quantity: 2 }
      ],
      table: '15',
      total: '$42.00'
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getActionButton = (status) => {
    switch(status) {
      case 'pending':
        return 'Accept Order';
      case 'preparing':
        return 'Mark Ready';
      case 'ready':
        return 'Complete Order';
      default:
        return 'View Order';
    }
  };

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">JoinVibe POS</div>
        <nav className="nav-menu">
          {/* Copy the same nav items from POSDashboard.jsx */}
        </nav>
      </aside>

      <main className="main-content">
        <div className="orders-header">
          <h1>Orders Management</h1>
          <div className="order-filters">
            <select className="filter-dropdown">
              <option>All Orders</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <select className="filter-dropdown">
              <option>All Status</option>
              <option>Pending</option>
              <option>Preparing</option>
              <option>Ready</option>
            </select>
          </div>
        </div>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="orders-tabs">
          {['All Orders', 'Pending', 'Preparing', 'Ready'].map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="order-cards">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-number">{order.id}</span>
                <span className={`order-status status-${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="order-details">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-meta">
                <span>Table {order.table}</span>
                <span className="order-total">{order.total}</span>
              </div>
              <div className="order-actions">
                <button className="order-button button-primary">
                  {getActionButton(order.status)}
                </button>
                <button className="order-button button-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default POSOrders;
