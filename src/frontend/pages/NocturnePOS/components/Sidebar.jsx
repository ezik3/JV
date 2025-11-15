import React from 'react';

const navItems = [
  { title: "Dashboard", id: "dashboard", icon: "📊" },
  { title: "New Order", id: "new-order", icon: "🛒" },
  { title: "Orders", id: "orders", icon: "📋" },
  { title: "Menu", id: "menu", icon: "📖" },
];

export default function Sidebar({ onNavigate, activePage }) {
  return (
    <aside style={{
      width: '256px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      padding: '1rem',
      color: 'white'
    }}>
      <div style={{ marginBottom: '2rem', padding: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          Nocturne POS
        </h2>
        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
          Modern Venue System
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.9)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s',
                textAlign: 'left',
                width: '100%',
                boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
