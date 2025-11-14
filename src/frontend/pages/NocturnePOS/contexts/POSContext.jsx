import React, { createContext, useContext, useState, useEffect } from 'react';

const POSContext = createContext(undefined);

export function POSProvider({ children, venueId = 'default' }) {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [currentStaff, setCurrentStaff] = useState(null);

  // Mock menu data for now
  useEffect(() => {
    setMenu([
      { id: '1', name: 'Espresso', category: 'Coffee', price: 3.50, available: true },
      { id: '2', name: 'Cappuccino', category: 'Coffee', price: 4.50, available: true },
      { id: '3', name: 'Latte', category: 'Coffee', price: 4.75, available: true },
      { id: '4', name: 'Americano', category: 'Coffee', price: 3.75, available: true },
      { id: '5', name: 'Croissant', category: 'Food', price: 3.00, available: true },
      { id: '6', name: 'Muffin', category: 'Food', price: 3.50, available: true },
    ]);
  }, []);

  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.menuItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.menuItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { id: `cart-${Date.now()}`, menuItem: item, quantity }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = async (orderData) => {
    // Mock order creation - will be replaced with real API
    const newOrder = {
      id: `order-${Date.now()}`,
      items: cart,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    console.log('Order created:', newOrder);
  };

  return (
    <POSContext.Provider
      value={{
        orders,
        cart,
        menu,
        currentStaff,
        venueId,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        createOrder,
        setCurrentStaff,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within POSProvider');
  }
  return context;
};
