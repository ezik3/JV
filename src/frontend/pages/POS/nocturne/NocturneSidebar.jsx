import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  UtensilsCrossed, 
  Menu, 
  Package, 
  BarChart3, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';
import './nocturne-pos.css';

const navItems = [
  { title: "Dashboard", url: "/venue/pos/dashboard", icon: LayoutDashboard },
  { title: "New Order", url: "/venue/pos/system", icon: ShoppingCart },
  { title: "Orders", url: "/venue/pos/orders", icon: UtensilsCrossed },
  { title: "Menu", url: "/venue/pos/menu", icon: Menu },
  { title: "Inventory", url: "/venue/pos/inventory", icon: Package },
  { title: "Analytics", url: "/venue/pos/analytics", icon: BarChart3 },
  { title: "Staff", url: "/venue/pos/staff", icon: Users },
  { title: "Settings", url: "/venue/pos/settings", icon: Settings },
];

export default function NocturneSidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('venueName');
    window.location.href = '/venue/pos';
  };

  return (
    <aside className="nocturne-pos w-64 min-h-screen glass border-r border-border p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">JV POS</h2>
        <p className="text-sm text-muted-foreground">Night Venue System</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary/50 transition-all"
            activeClassName="bg-primary/20 text-primary font-semibold neon-glow"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary/50 transition-all w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
