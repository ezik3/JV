import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import feather from 'feather-icons';
import '../styles/POSDashboard.css';

const POSDashboard = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load feather icons
    feather.replace();

    // Initialize Charts
    const salesChart = new ChartJS(document.getElementById('salesChart'), {
      type: 'line',
      data: {
        labels: ['6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM'],
        datasets: [{
          label: 'Revenue ($)',
          data: [500, 800, 1200, 1800, 2200, 2500, 2000, 1500, 1000],
          borderColor: '#B388FF',
          tension: 0.4,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255,255,255,0.1)'
            },
            ticks: {
              color: '#fff'
            }
          },
          x: {
            grid: {
              color: 'rgba(255,255,255,0.1)'
            },
            ticks: {
              color: '#fff'
            }
          }
        }
      }
    });

    const itemsChart = new ChartJS(document.getElementById('itemsChart'), {
      type: 'doughnut',
      data: {
        labels: ['Premium Vodka', 'VIP Booth', 'Cocktails', 'Beer', 'Wine'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#6200EA',
            '#B388FF', 
            '#00E5FF',
            '#00E676',
            '#FFD740'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#fff'
            }
          }
        }
      }
    });

    return () => {
      salesChart.destroy();
      itemsChart.destroy();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">JoinVibe POS</div>
        <nav className="nav-menu">
          <li className="nav-item">
            <a href="/dashboard" className="nav-link active">
              <i data-feather="home"></i>
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/system" className="nav-link">
              <i data-feather="shopping-cart"></i>
              Point of Sale
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/orders" className="nav-link">
              <i data-feather="file-text"></i>
              Orders
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/inventory" className="nav-link">
              <i data-feather="package"></i>
              Inventory
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/menu" className="nav-link">
              <i data-feather="book-open"></i>
              Menu Builder
            </a>
          </li>
          <li className="nav-item">
            <a href="/staff" className="nav-link">
              <i data-feather="users"></i>
              Staff
            </a>
          </li>
          <li className="nav-item">
            <a href="/customers" className="nav-link">
              <i data-feather="user"></i>
              Customers
            </a>
          </li>
          <li className="nav-item">
            <a href="/reports" className="nav-link">
              <i data-feather="bar-chart-2"></i>
              Reports
            </a>
          </li>
          <li className="nav-item">
            <a href="/settings" className="nav-link">
              <i data-feather="settings"></i>
              Settings
            </a>
          </li>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <div className="user-info">
            <div className="avatar">E</div>
            <div className="welcome-text">
              <h1>Welcome back, Esi</h1>
              <div className="real-time-indicator">
                <div className="pulse"></div>
                <span>Live System Status: Operational</span>
              </div>
            </div>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            <i data-feather={theme === 'dark' ? 'moon' : 'sun'}></i>
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Today's Revenue</div>
            <div className="stat-value">$8,459</div>
            <div className="stat-change">+15% from yesterday</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Active Orders</div>
            <div className="stat-value">24</div>
            <div className="stat-change">4 pending delivery</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Customers Today</div>
            <div className="stat-value">156</div>
            <div className="stat-change">+23% from last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Average Order Value</div>
            <div className="stat-value">$54.22</div>
            <div className="stat-change">+5% this week</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Hourly Sales</h3>
            <canvas id="salesChart"></canvas>
          </div>
          <div className="chart-card">
            <h3>Popular Items</h3>
            <canvas id="itemsChart"></canvas>
          </div>
        </div>

        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <div className="order-list">
            <div className="order-item">
              <span>#1234</span>
              <span>VIP Booth + Premium Vodka Package</span>
              <span className="status-badge completed">Completed</span>
              <span>$524.00</span>
            </div>
            <div className="order-item">
              <span>#1235</span>
              <span>Signature Cocktails (x4)</span>
              <span className="status-badge pending">In Progress</span>
              <span>$72.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default POSDashboard;