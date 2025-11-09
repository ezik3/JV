import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto';
import { 
  TrendingUp, DollarSign, ShoppingCart, Users, 
  Package, Clock, AlertCircle, CheckCircle,
  ArrowUp, ArrowDown, Activity, Calendar,
  BookOpen, BarChart3, Settings, ChefHat
} from 'lucide-react';
import '../styles/enhancedDashboard.css';

const EnhancedDashboard = () => {
  const history = useHistory();
  const [theme, setTheme] = useState('dark');
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    // Initialize Charts with better styling
    let chart1 = null;
    let chart2 = null;

    const ctx1 = document.getElementById('salesChart');
    if (ctx1) {
      chart1 = new ChartJS(ctx1, {
        type: 'line',
        data: {
          labels: ['6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM'],
          datasets: [
            {
              label: 'Revenue',
              data: [500, 800, 1200, 1800, 2200, 2500, 2000, 1500, 1000],
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 3
            },
            {
              label: 'Orders',
              data: [25, 35, 50, 65, 75, 80, 70, 55, 40],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#F8FAFC',
                padding: 20,
                font: {
                  size: 12,
                  weight: '600'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#F8FAFC',
              bodyColor: '#CBD5E1',
              borderColor: '#334155',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.datasetIndex === 0 
                      ? '$' + context.parsed.y.toLocaleString()
                      : context.parsed.y + ' orders';
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: '#94A3B8',
                font: {
                  size: 11
                },
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: '#94A3B8',
                font: {
                  size: 11
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    }

    const ctx2 = document.getElementById('categoryChart');
    if (ctx2) {
      chart2 = new ChartJS(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Premium Vodka', 'VIP Booth', 'Cocktails', 'Beer', 'Wine', 'Food'],
          datasets: [{
            data: [30, 25, 20, 12, 8, 5],
            backgroundColor: [
              '#6366F1',
              '#8B5CF6', 
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#3B82F6'
            ],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#F8FAFC',
                padding: 15,
                font: {
                  size: 12
                },
                generateLabels: function(chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const value = data.datasets[0].data[i];
                      return {
                        text: `${label} (${value}%)`,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        hidden: false,
                        index: i
                      };
                    });
                  }
                  return [];
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#F8FAFC',
              bodyColor: '#CBD5E1',
              borderColor: '#334155',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chart1) chart1.destroy();
      if (chart2) chart2.destroy();
    };
  }, []);

  const stats = [
    {
      title: "Today's Revenue",
      value: "$8,459",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "#6366F1",
      bgColor: "rgba(99, 102, 241, 0.1)"
    },
    {
      title: "Active Orders",
      value: "24",
      change: "4 pending",
      trend: "neutral",
      icon: ShoppingCart,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
      title: "Customers Today",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: Users,
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)"
    },
    {
      title: "Avg Order Value",
      value: "$54.22",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)"
    }
  ];

  const recentOrders = [
    { id: '#1234', items: 'VIP Booth + Premium Vodka Package', status: 'completed', amount: 524.00, time: '2m ago' },
    { id: '#1235', items: 'Signature Cocktails (x4)', status: 'in-progress', amount: 72.00, time: '5m ago' },
    { id: '#1236', items: 'Champagne Bottle Service', status: 'in-progress', amount: 850.00, time: '8m ago' },
    { id: '#1237', items: 'Food Platter + Drinks', status: 'completed', amount: 145.00, time: '12m ago' },
    { id: '#1238', items: 'Premium Beer (x6)', status: 'pending', amount: 48.00, time: '15m ago' }
  ];

  const quickActions = [
    { label: 'New Order', icon: ShoppingCart, color: '#6366F1', route: '/venue/pos/system' },
    { label: 'Menu Builder', icon: BookOpen, color: '#10B981', route: '/venue/pos/menu' },
    { label: 'View Orders', icon: ChefHat, color: '#8B5CF6', route: '/venue/pos/orders' },
    { label: 'Inventory', icon: Package, color: '#F59E0B', route: '/venue/pos/inventory' }
  ];

  return (
    <div className="enhanced-dashboard">
      {/* Top Navigation */}
      <div className="pos-top-nav">
        <div className="nav-brand">
          <h2>🔥 JointVibe POS</h2>
        </div>
        <div className="nav-links">
          <button 
            className="nav-link active"
            onClick={() => history.push('/venue/pos/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="nav-link"
            onClick={() => history.push('/venue/pos/system')}
          >
            POS System
          </button>
          <button 
            className="nav-link"
            onClick={() => history.push('/venue/pos/orders')}
          >
            Orders
          </button>
          <button 
            className="nav-link"
            onClick={() => history.push('/venue/pos/menu')}
          >
            Menu Builder
          </button>
          <button 
            className="nav-link"
            onClick={() => history.push('/venue/pos/inventory')}
          >
            Inventory
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Dashboard Overview</h1>
            <p className="header-subtitle">
              <Activity size={16} />
              Live System Status: All Systems Operational
            </p>
          </div>
          <div className="header-actions">
            <div className="time-range-selector">
              {['today', 'week', 'month'].map(range => (
                <button
                  key={range}
                  className={`range-btn ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <button className="refresh-btn">
              <Activity size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
              <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{stat.title}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{stat.value}</span>
                  <span className={`stat-change ${stat.trend}`}>
                    {stat.trend === 'up' && <ArrowUp size={14} />}
                    {stat.trend === 'down' && <ArrowDown size={14} />}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">Quick Actions</h3>
        <div className="action-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index} 
                className="action-card" 
                style={{ '--action-color': action.color }}
                onClick={() => action.route && history.push(action.route)}
              >
                <Icon size={20} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue & Orders</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: '#6366F1' }}></span>
                Revenue
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: '#10B981' }}></span>
                Orders
              </span>
            </div>
          </div>
          <div className="chart-container">
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Categories</h3>
            <span className="chart-subtitle">By sales volume</span>
          </div>
          <div className="chart-container">
            <canvas id="categoryChart"></canvas>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="orders-section">
        <div className="section-header">
          <h3 className="section-title">Recent Orders</h3>
          <button className="view-all-btn">
            View All
            <ArrowUp size={16} style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Items</span>
            <span>Status</span>
            <span>Amount</span>
            <span>Time</span>
          </div>
          {recentOrders.map((order, index) => (
            <div key={index} className="table-row">
              <span className="order-id">{order.id}</span>
              <span className="order-items">{order.items}</span>
              <span className={`order-status ${order.status}`}>
                {order.status === 'completed' && <CheckCircle size={14} />}
                {order.status === 'in-progress' && <Clock size={14} />}
                {order.status === 'pending' && <AlertCircle size={14} />}
                {order.status.replace('-', ' ')}
              </span>
              <span className="order-amount">${order.amount.toFixed(2)}</span>
              <span className="order-time">{order.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
