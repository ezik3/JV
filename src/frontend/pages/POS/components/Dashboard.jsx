import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [theme, setTheme] = useState('dark');
  const [stats] = useState({
    todaysSales: '$3,459.00',
    salesGrowth: '+15.3%',
    activeOrders: '24',
    pendingDeliveries: '4',
    averageOrder: '$42.50',
    weeklyGrowth: '+5.2%',
    totalCustomers: '142',
    newCustomers: '12'
  });

  const [recentOrders] = useState([
    { id: '#12345', customer: 'John Smith', amount: '$75.00', status: 'completed' },
    { id: '#12344', customer: 'Emma Wilson', amount: '$124.00', status: 'pending' },
    { id: '#12343', customer: 'Michael Brown', amount: '$89.00', status: 'completed' }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="header">
          <h1>Dashboard Overview</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </header>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-title">Today's Sales</div>
            <div className="stat-value">{stats.todaysSales}</div>
            <div className="stat-change">{stats.salesGrowth} from yesterday</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Active Orders</div>
            <div className="stat-value">{stats.activeOrders}</div>
            <div className="stat-change">{stats.pendingDeliveries} pending delivery</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Average Order Value</div>
            <div className="stat-value">{stats.averageOrder}</div>
            <div className="stat-change">{stats.weeklyGrowth} this week</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Total Customers</div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-change">{stats.newCustomers} new today</div>
          </div>
        </div>
        
        <div className="grid-layout">
          <div className="card">
            <div className="card-header">
              <h2>Recent Orders</h2>
            </div>
            <table className="recent-orders">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2>Popular Items</h2>
            </div>
            {/* Popular items content will go here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;