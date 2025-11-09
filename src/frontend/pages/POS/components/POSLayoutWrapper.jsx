import React from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3,
  ChefHat,
  LogOut
} from 'lucide-react';
import POSDashboard from './POSDashboard';
import SimplifiedPOS from './SimplifiedPOS';
import POSInventory from './POSInventory';
import POSMenuBuilder from './POSMenuBuilder';
import POSOrders from './POSOrders';
import './POSLayout.css';

const POSLayoutWrapper = () => {
  const history = useHistory();
  const location = useLocation();

  const navItems = [
    { path: '/venue/pos/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/venue/pos/system', icon: ShoppingCart, label: 'POS System' },
    { path: '/venue/pos/orders', icon: ChefHat, label: 'Orders' },
    { path: '/venue/pos/menu', icon: BookOpen, label: 'Menu Builder' },
    { path: '/venue/pos/inventory', icon: Package, label: 'Inventory' },
    { path: '/venue/pos/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/venue/pos/staff', icon: Users, label: 'Staff' },
    { path: '/venue/pos/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Clear session and redirect to login
    history.push('/venue/pos/auth/manager');
  };

  return (
    <div className="pos-layout-wrapper">
      {/* Sidebar Navigation */}
      <aside className="pos-sidebar-nav">
        <div className="sidebar-header">
          <h2>🔥 JointVibe POS</h2>
          <p>Venue Management</p>
        </div>

        <nav className="sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => history.push(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pos-main-content">
        <Switch>
          <Route path="/venue/pos/dashboard" component={POSDashboard} />
          <Route path="/venue/pos/system" component={SimplifiedPOS} />
          <Route path="/venue/pos/orders" component={POSOrders} />
          <Route path="/venue/pos/menu" component={POSMenuBuilder} />
          <Route path="/venue/pos/inventory" component={POSInventory} />
          <Route path="/venue/pos/analytics" render={() => <div className="coming-soon">Analytics Coming Soon</div>} />
          <Route path="/venue/pos/staff" render={() => <div className="coming-soon">Staff Management Coming Soon</div>} />
          <Route path="/venue/pos/settings" render={() => <div className="coming-soon">Settings Coming Soon</div>} />
        </Switch>
      </main>
    </div>
  );
};

export default POSLayoutWrapper;
