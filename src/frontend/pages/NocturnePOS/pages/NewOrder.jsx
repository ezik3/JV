import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { usePOS } from '../contexts/POSContext';

export default function NewOrder() {
  const { menu, cart, addToCart, removeFromCart, updateCartItem, clearCart, createOrder } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const categories = ['All', ...new Set(menu.map(item => item.category))];

  const filteredMenu = selectedCategory === 'All'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    if (!tableNumber) {
      alert('Please enter a table number');
      return;
    }

    await createOrder({
      tableNumber,
      customerName: customerName || 'Guest',
      total: cartTotal,
    });

    setTableNumber('');
    setCustomerName('');
    alert('Order placed successfully!');
  };

  return (
    <div style={{ padding: '2rem', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          New Order
        </h1>
        <p style={{ color: '#64748b' }}>Select items and create a new order</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Menu Section */}
        <div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {filteredMenu.map(item => (
              <Card
                key={item.id}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: item.available ? 1 : 0.5
                }}
                onClick={() => item.available && addToCart(item)}
              >
                <CardContent style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                    {item.category === 'Drinks' ? '🍹' : '🍽️'}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#667eea' }}>
                    ${item.price.toFixed(2)}
                  </p>
                  {!item.available && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      Out of stock
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Current Order</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Order Info */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Table Number *
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g., 5"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Guest"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Items ({cart.length})
                </h3>

                {cart.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', padding: '2rem 0' }}>
                    Cart is empty
                  </p>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cart.map(item => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 0',
                          borderBottom: '1px solid #f1f5f9'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                            {item.menuItem.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ${item.menuItem.price.toFixed(2)} each
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                              background: 'white',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '500' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                              background: 'white',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #fee2e2',
                              background: '#fef2f2',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total and Actions */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>Total</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: cart.length === 0
                        ? '#e2e8f0'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Place Order
                  </button>

                  <button
                    onClick={clearCart}
                    disabled={cart.length === 0}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      color: '#64748b',
                      cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
