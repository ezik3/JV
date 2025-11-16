import React, { createContext, useContext, useState, useEffect } from 'react';

const POSContext = createContext(undefined);

export function POSProvider({ children, venueId = 'default' }) {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);

  // Mock menu data
  useEffect(() => {
    setMenu([
      { id: '1', name: 'Signature Cocktail', category: 'Drinks', price: 12.00, available: true },
      { id: '2', name: 'House Wine', category: 'Drinks', price: 8.00, available: true },
      { id: '3', name: 'Premium Beer', category: 'Drinks', price: 6.00, available: true },
      { id: '4', name: 'Appetizer Platter', category: 'Food', price: 15.00, available: true },
      { id: '5', name: 'Dessert Special', category: 'Food', price: 8.00, available: true },
    ]);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      items: [...cart],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const value = {
    orders,
    cart,
    menu,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    createOrder,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
