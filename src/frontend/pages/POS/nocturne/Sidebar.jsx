import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  UtensilsCrossed,
  Menu as MenuIcon,
  Armchair,
  Map,
  Package,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Home
} from 'lucide-react';
import { cn } from './lib/utils';
import './nocturne.css';

const Sidebar = () => {
  const history = useHistory();

  const navItems = [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/venue/pos/new-order', label: 'New Order', icon: ShoppingCart },
    { path: '/venue/pos/orders', label: 'Orders', icon: ClipboardList },
    { path: '/venue/pos/kitchen', label: 'Kitchen', icon: UtensilsCrossed },
    { path: '/venue/pos/menu', label: 'Menu', icon: MenuIcon },
    { path: '/venue/pos/tables', label: 'Tables', icon: Armchair },
    { path: '/venue/pos/floorplan', label: 'Floorplan', icon: Map },
    { path: '/venue/pos/inventory', label: 'Inventory', icon: Package },
    { path: '/venue/pos/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/venue/pos/staff', label: 'Staff', icon: Users },
    { path: '/venue/pos/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('venueId');
    history.push('/venue/home');
  };

  return (
    <div className="w-64 min-h-screen bg-sidebar-background text-sidebar-foreground flex flex-col border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">JV POS</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Night Venue System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-white/10",
                  isActive && "bg-white/20 text-sidebar-foreground font-semibold"
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
      <div className="p-4 border-t border-white/10 space-y-2">
        <NavLink
          to="/venue/home"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-white/10 w-full"
        >
          <Home className="h-5 w-5" />
          <span>Venue Home</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sidebar-foreground/80 hover:text-red-400 hover:bg-red-950/30 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
