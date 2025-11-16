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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Nocturne POS</h2>
        <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>Modern Point of Sale</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activePage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (activePage !== item.id) {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== item.id) {
                e.target.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
