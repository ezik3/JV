import React from 'react';

const navItems = [
  { title: "Dashboard", id: "dashboard", icon: "📊" },
  { title: "New Order", id: "new-order", icon: "🛒" },
  { title: "Orders", id: "orders", icon: "📋" },
  { title: "Menu", id: "menu", icon: "📖" },
];

export default function Sidebar({ onNavigate, activePage }) {
  return (
    <aside className="w-64 min-h-screen glass border-r border-noc p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold neon-text">Nocturne POS</h2>
        <p className="text-sm text-gray-400">Night Venue System</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left
              transition-all
              ${activePage === item.id
                ? 'bg-purple-500/20 text-noc-primary font-semibold neon-glow'
                : 'text-gray-300 hover:bg-gray-800/50'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
