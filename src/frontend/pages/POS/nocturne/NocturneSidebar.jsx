import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Menu as MenuIcon,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { cn } from './lib/utils';
import './nocturne-pos.css';

const NocturneSidebar = () => {
  const history = useHistory();

  const navItems = [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/venue/pos/system', label: 'New Order', icon: ShoppingCart },
    { path: '/venue/pos/orders', label: 'Orders', icon: UtensilsCrossed },
    { path: '/venue/pos/menu', label: 'Menu', icon: MenuIcon },
    { path: '/venue/pos/inventory', label: 'Inventory', icon: Package },
    { path: '/venue/pos/staff', label: 'Staff', icon: Users },
    { path: '/venue/pos/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/venue/pos/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('venueId');
    history.push('/venue/home');
  };

  return (
    <div className="nocturne-pos w-64 min-h-screen glass-strong border-r border-gray-700/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold text-white neon-text">JV POS</h1>
        <p className="text-sm text-gray-400 mt-1">Night Venue System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "text-gray-300 hover:text-white hover:bg-white/10",
                  isActive && "bg-indigo-600/30 text-white font-semibold neon-glow"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700/50 space-y-2">
        <NavLink
          to="/venue/home"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Home className="h-5 w-5" />
          <span>Venue Home</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-300 hover:text-red-400 hover:bg-red-950/30 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default NocturneSidebar;
