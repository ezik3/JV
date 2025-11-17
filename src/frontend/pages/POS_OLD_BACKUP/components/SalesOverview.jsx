import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/SalesOverview.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const SalesOverview = () => {
  const [dateFilter, setDateFilter] = useState('Today');
  const [transactionFilter, setTransactionFilter] = useState('All');
  
  const chartData = {
    labels: ['Credit Card', 'Crypto', 'Stablecoin', 'Cash'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: [
        '#6200EA',
        '#B388FF',
        '#00E5FF',
        '#00E676'
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff'
        }
      }
    }
  };

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
        <div className="sales-header">
          <h1>Sales Overview</h1>
          <div className="date-filter">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>

        <div className="sales-grid">
          <div className="transactions-list">
            <div className="transaction-filters">
              {['All', 'Completed', 'Pending', 'Refunded'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${transactionFilter === filter ? 'active' : ''}`}
                  onClick={() => setTransactionFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <TransactionItem
              paymentMethod="Crypto"
              description="VIP Package - Table 12"
              time="9:45 PM"
              amount="1,200.00"
            />

            <TransactionItem
              paymentMethod="Card"
              description="Bottle Service - Table 8"
              time="9:30 PM"
              amount="450.00"
            />

            <TransactionItem
              paymentMethod="Stablecoin"
              description="Cocktail Package - Bar"
              time="9:15 PM"
              amount="85.00"
            />
          </div>

          <div className="sales-summary">
            <h2>Today's Summary</h2>
            
            <SummaryItem label="Gross Sales" value="$12,450.00" />
            <SummaryItem label="Net Sales" value="$10,582.50" />
            <SummaryItem label="Total Orders" value="45" />

            <div className="payment-breakdown">
              <h3>Payment Methods</h3>
              <div className="breakdown-chart">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn primary-btn">Export Report</button>
              <button className="action-btn secondary-btn">Print Summary</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Subcomponents
const TransactionItem = ({ paymentMethod, description, time, amount }) => (
  <div className="transaction-item">
    <div className="payment-method">
      <div className="payment-icon"></div>
      <span>{paymentMethod}</span>
    </div>
    <span>{description}</span>
    <span>{time}</span>
    <span>${amount}</span>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="summary-item">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default SalesOverview;