import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  UtensilsCrossed,
  Monitor,
  MenuSquare,
  Armchair,
  LayoutGrid,
  Package,
  BarChart3,
  Users,
  Settings,
  Home,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const history = useHistory();

  const navItems = [
    { path: '/venue/pos/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/venue/pos/new-order', label: 'New Order', icon: ShoppingCart },
    { path: '/venue/pos/orders', label: 'Orders', icon: ClipboardList },
    { path: '/venue/pos/kitchen-legacy', label: 'Kitchen (Legacy)', icon: UtensilsCrossed },
    { path: '/venue/pos/kitchen-display', label: 'Kitchen Display', icon: Monitor },
    { path: '/venue/pos/menu', label: 'Menu', icon: MenuSquare },
    { path: '/venue/pos/tables', label: 'Tables', icon: Armchair },
    { path: '/venue/pos/floorplan', label: 'Floorplan', icon: LayoutGrid },
    { path: '/venue/pos/inventory', label: 'Inventory', icon: Package },
    { path: '/venue/pos/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/venue/pos/staff', label: 'Staff', icon: Users },
    { path: '/venue/pos/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('venueId');
    history.push('/venue/pos/login');
  };

  return (
    <div
      className="w-64 min-h-screen flex flex-col border-r"
      style={{
        backgroundColor: 'hsl(240, 5.3%, 26.1%)',
        color: 'hsl(0, 0%, 98%)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'hsl(0, 0%, 98%)' }}>
          JV POS
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Night Venue System
        </p>
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
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'font-semibold'
                    : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: isActive ? 'hsl(0, 0%, 98%)' : 'rgba(255, 255, 255, 0.8)'
              })}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={() => history.push('/venue/home')}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full"
          style={{
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Home className="h-5 w-5" />
          <span>Venue Home</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full"
          style={{
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
