import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { usePOS } from "../contexts/POSContext";

export default function Menu() {
  const { menu } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(menu.map(item => item.category))];

  const filteredMenu = selectedCategory === 'All'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div style={{ padding: '2rem', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Menu Management
          </h1>
          <p style={{ color: '#64748b' }}>Manage your venue's menu items</p>
        </div>
        <button
          onClick={() => alert('Add new menu item functionality')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
          }}
        >
          ➕ Add Item
        </button>
      </div>

      {/* Category Filters */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: selectedCategory === category
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#e2e8f0',
              color: selectedCategory === category ? 'white' : '#475569',
              cursor: 'pointer',
              fontWeight: selectedCategory === category ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredMenu.map(item => (
          <Card key={item.id} style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{
                aspectRatio: '1',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '3rem' }}>
                  {item.category === 'Drinks' ? '🍹' : '🍽️'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                {item.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>
                {item.category}
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#667eea',
                marginBottom: '1rem'
              }}>
                ${item.price.toFixed(2)}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {item.available ? '✅ Available' : '❌ Out of Stock'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => alert(`Edit ${item.name}`)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#475569',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => confirm(`Delete ${item.name}?`)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          color: '#64748b'
        }}>
          <p style={{ fontSize: '1.125rem' }}>No menu items in this category</p>
        </div>
      )}
    </div>
  );
}
