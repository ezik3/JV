import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../styles/Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [activeFilter, setActiveFilter] = useState('This Week');

  const sidebarLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/pos", label: "POS" },
    { path: "/sales", label: "Sales" },
    { path: "/menu-management", label: "Menu Management" },
    { path: "/inventory", label: "Inventory" },
    { path: "/orders", label: "Orders" },
    { path: "/staff", label: "Staff" },
    { path: "/customers", label: "Customers" },
    { path: "/analytics", label: "Analytics" },
    { path: "/marketing", label: "Marketing" },
    { path: "/reports", label: "Reports" },
    { path: "/settings", label: "Settings" }
  ];

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue',
      data: [1200, 1900, 1600, 2100, 1800, 2400, 2200],
      borderColor: '#6200EA',
      backgroundColor: 'rgba(98, 0, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const customerData = {
    labels: ['12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am'],
    datasets: [{
      label: 'Customers',
      data: [45, 59, 80, 81, 156, 155, 140],
      backgroundColor: '#B388FF'
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  const topItems = [
    { rank: 1, name: 'Mojito', orders: 342 },
    { rank: 2, name: 'Craft Beer', orders: 286 },
    { rank: 3, name: 'Margarita', orders: 253 },
    { rank: 4, name: 'Wine (Red)', orders: 198 },
    { rank: 5, name: 'Gin & Tonic', orders: 167 }
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">JointVibe POS</div>
        <nav className="nav-menu">
          {sidebarLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <a 
                href={link.path} 
                className={`nav-link ${window.location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="analytics-header">
          <h1>Analytics Dashboard</h1>
          <div className="date-filter">
            {['Today', 'This Week', 'This Month', 'Custom'].map((filter) => (
              <button
                key={filter}
                className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="stats-grid">
          <StatCard 
            value="$12,458" 
            label="Total Revenue" 
            trend={{ value: 12.5, direction: 'up' }} 
          />
          <StatCard 
            value="847" 
            label="Total Orders" 
            trend={{ value: 8.2, direction: 'up' }} 
          />
          <StatCard 
            value="$28" 
            label="Average Order Value" 
            trend={{ value: 4.3, direction: 'up' }} 
          />
          <StatCard 
            value="234" 
            label="New Customers" 
            trend={{ value: 2.1, direction: 'down' }} 
          />
        </div>

        <div className="analytics-grid">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Revenue Overview</h3>
            </div>
            <Line data={revenueData} options={chartOptions} />
          </div>

          <div className="top-items">
            <div className="chart-header">
              <h3 className="chart-title">Top Selling Items</h3>
            </div>
            <ul className="item-list">
              {topItems.map((item) => (
                <li key={item.rank} className="item">
                  <div className="item-name">
                    <span className="item-rank">{item.rank}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="item-value">{item.orders} orders</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Customer Activity</h3>
          </div>
          <Bar data={customerData} options={chartOptions} />
        </div>
      </main>
    </div>
  );
};

// StatCard Component
const StatCard = ({ value, label, trend }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    <div className={`trend-indicator trend-${trend.direction}`}>
      {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
    </div>
  </div>
);

export default Analytics;