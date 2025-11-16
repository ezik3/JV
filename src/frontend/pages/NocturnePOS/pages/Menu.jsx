import React from 'react';
import { usePOS } from '../contexts/POSContext';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Menu() {
  const { menu } = usePOS();

  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Menu Management</h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Manage your venue's menu items</p>
        </div>
        <button style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + Add Item
        </button>
      </div>

      {categories.map(category => {
        const categoryItems = menu.filter(item => item.category === category);
        return (
          <div key={category} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>{category}</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {categoryItems.map(item => (
                <Card key={item.id}>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{item.name}</h3>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        background: item.available ? '#d1fae5' : '#fee2e2',
                        color: item.available ? '#065f46' : '#991b1b',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      Category: {item.category}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{
                          padding: '0.5rem 1rem',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                        <button style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
