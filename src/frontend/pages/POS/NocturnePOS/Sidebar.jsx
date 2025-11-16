import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  UtensilsCrossed, 
  Menu, 
  Package, 
  BarChart3, 
  Users, 
  Settings,
  Table2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const navItems = [
  { title: "Dashboard", url: "/venue/pos/nocturne/dashboard", icon: LayoutDashboard },
  { title: "New Order", url: "/venue/pos/nocturne/new-order", icon: ShoppingCart },
  { title: "Orders", url: "/venue/pos/orders", icon: UtensilsCrossed },
  { title: "Menu", url: "/venue/pos/menu", icon: Menu },
  { title: "Inventory", url: "/venue/pos/inventory", icon: Package },
  { title: "Analytics", url: "/venue/pos/nocturne/analytics", icon: BarChart3 },
  { title: "Staff", url: "/venue/pos/nocturne/staff", icon: Users },
  { title: "Settings", url: "/venue/pos/nocturne/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen glass border-r border-border p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">JV POS</h2>
        <p className="text-sm text-muted-foreground">Night Venue System</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.url;
          
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary/50 transition-all",
                isActive && "bg-primary/20 text-primary font-semibold neon-glow"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
