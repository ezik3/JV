import React, { useState } from 'react';
import { usePOS } from '../contexts/POSContext';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function NewOrder() {
  const { menu, cart, addToCart, removeFromCart, clearCart, createOrder } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(menu.map(item => item.category))];
  const filteredMenu = selectedCategory === 'All'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    createOrder({
      table: 'Table ' + Math.floor(Math.random() * 20 + 1),
      total: cartTotal,
    });
    alert('Order placed successfully!');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Menu Section */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>New Order</h1>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedCategory === cat
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#e5e7eb',
                color: selectedCategory === cat ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {filteredMenu.map(item => (
            <Card
              key={item.id}
              onClick={() => addToCart(item)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <CardContent style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{item.name}</h3>
                <p style={{ color: '#6b7280', margin: '0 0 0.75rem 0', fontSize: '0.875rem' }}>{item.category}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>${item.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div style={{
        width: '400px',
        background: 'white',
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardHeader style={{ borderBottom: '1px solid #e5e7eb' }}>
          <CardTitle>Current Order</CardTitle>
        </CardHeader>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '2rem' }}>
              No items in cart
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '500' }}>{item.name}</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      marginLeft: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: cart.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              marginBottom: '0.5rem'
            }}
          >
            Place Order
          </button>
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'white',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
