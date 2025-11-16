import React, { createContext, useContext, useState, useEffect } from 'react';

const POSContext = createContext();

export function POSProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [currentStaff, setCurrentStaff] = useState(null);
  const venueId = 'default';

  // Initialize with sample menu items
  useEffect(() => {
    setMenu([
      { id: '1', name: 'Vodka Cocktail', description: 'Premium vodka cocktail', category: 'Drinks', price: 12.99, available: true },
      { id: '2', name: 'Whiskey Sour', description: 'Classic whiskey sour', category: 'Drinks', price: 14.99, available: true },
      { id: '3', name: 'Mojito', description: 'Fresh mint mojito', category: 'Drinks', price: 11.99, available: true },
      { id: '4', name: 'Margarita', description: 'Classic margarita', category: 'Drinks', price: 13.99, available: true },
      { id: '5', name: 'Champagne Bottle', description: 'Dom Perignon', category: 'Champagne', price: 299.99, available: true },
      { id: '6', name: 'VIP Bottle Service', description: 'Premium bottle service', category: 'VIP Service', price: 599.99, available: true },
      { id: '7', name: 'Nachos', description: 'Loaded nachos', category: 'Food', price: 12.99, available: true },
      { id: '8', name: 'Wings', description: 'Buffalo wings', category: 'Food', price: 15.99, available: true },
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

  // Legacy support for existing POS components
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    // Sync menu to menuItems for backwards compatibility
    setMenuItems(menu.map(item => ({
      id: parseInt(item.id),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      inventoryItem: item.name,
      stockStatus: item.available ? 'in-stock' : 'out-of-stock'
    })));
  }, [menu]);

  const addMenuItem = (newItem) => {
    setMenuItems(prev => [...prev, {
      id: prev.length + 1,
      ...newItem,
      stockStatus: 'in-stock'
    }]);
  };

  const updateInventory = (menuItemId, quantity) => {
    setInventory(prev => ({
      ...prev,
      [menuItemId]: { quantity }
    }));
  };

  const value = {
    // New nocturne-pos style API
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
    // Legacy API for backwards compatibility
    menuItems,
    inventory,
    addMenuItem,
    updateInventory,
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
}

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};