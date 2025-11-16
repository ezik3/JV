import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { useQuery, useAction } from 'wasp/client/operations';
import {
  getMenuItems,
  getInventory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateInventory as updateInventoryAction
} from 'wasp/client/operations';

const POSContext = createContext();

export function POSProvider({ children }) {
  //
  // -----------------------------
  // 1. WASP DATA (REAL BACKEND)
  // -----------------------------
  //
  const {
    data: menuItems = [],
    isLoading: menuLoading,
    error: menuError
  } = useQuery(getMenuItems);

  const {
    data: inventory = [],
    isLoading: inventoryLoading,
    error: inventoryError
  } = useQuery(getInventory);

  const createMenuItemFn = useAction(createMenuItem);
  const updateMenuItemFn = useAction(updateMenuItem);
  const deleteMenuItemFn = useAction(deleteMenuItem);
  const updateInventoryFn = useAction(updateInventoryAction);

  //
  // -----------------------------
  // 2. NOCTURNE POS UI STATE
  // (cart, orders, staff, etc.)
  // -----------------------------
  //
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [currentStaff, setCurrentStaff] = useState(null);
  const venueId = 'default';

  //
  // TEMP DEV MENU (Fallback for now)
  //
  useEffect(() => {
    setMenu([
      { id: '1', name: 'Vodka Cocktail', description: 'Premium vodka cocktail', category: 'Drinks', price: 12.99, available: true },
      { id: '2', name: 'Whiskey Sour', description: 'Classic whiskey sour', category: 'Drinks', price: 14.99, available: true },
      { id: '3', name: 'Mojito', description: 'Fresh mint mojito', category: 'Drinks', price: 11.99, available: true },
      { id: '4', name: 'Margarita', description: 'Classic margarita', category: 'Drinks', price: 13.99, available: true },
      { id: '5', name: 'Champagne Bottle', description: 'Dom Perignon', category: 'Champagne', price: 299.99, available: true },
      { id: '6', name: 'VIP Bottle Service', description: 'Premium bottle service', category: 'VIP Service', price: 599.99, available: true },
      { id: '7', name: 'Nachos', description: 'Loaded nachos', category: 'Food', price: 12.99, available: true },
      { id: '8', name: 'Wings', description: 'Buffalo wings', category: 'Food', price: 15.99, available: true }
    ]);
  }, []);

  //
  // -----------------------------
  //  CART / ORDER ACTIONS
  // -----------------------------
  //
  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id);
      if (existing) {
        return prev.map(c =>
          c.menuItem.id === item.id
            ? { ...c, quantity: c.quantity + quantity }
            : c
        );
      }
      return [...prev, { id: `cart-${Date.now()}`, menuItem: item, quantity }];
    });
  };

  const removeFromCart = itemId => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity <= 0) return removeFromCart(itemId);
    setCart(prev => prev.map(i => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart([]);

  const createOrder = async orderData => {
    const newOrder = {
      id: `order-${Date.now()}`,
      items: cart,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  //
  // -----------------------------
  //  LEGACY API COMPATIBILITY
  //  (Keep older POS components working)
  // -----------------------------
  //
  const addMenuItem = async newItem => {
    try {
      await createMenuItemFn(newItem);
    } catch (err) {
      console.error('Error adding menu item:', err);
      throw err;
    }
  };

  const updateInventory = async (menuItemId, quantity) => {
    try {
      await updateInventoryFn({ menuItemId, quantity });
    } catch (err) {
      console.error('Error updating inventory:', err);
      throw err;
    }
  };

  const updateExistingMenuItem = async (id, data) => {
    try {
      await updateMenuItemFn({ id, ...data });
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteExistingMenuItem = async id => {
    try {
      await deleteMenuItemFn({ id });
    } catch (err) {
      console.error('Error deleting menu item:', err);
      throw err;
    }
  };

  //
  // -----------------------------
  //  PROVIDER VALUE
  // -----------------------------
  //
  const value = {
    // NEW POS API
    orders,
    cart,
    menu,
    currentStaff,
    venueId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    setCurrentStaff,

    // LEGACY
    menuItems,
    inventory,
    addMenuItem,
    updateInventory,
    updateMenuItem: updateExistingMenuItem,
    deleteMenuItem: deleteExistingMenuItem,

    // loading / error
    isLoading: menuLoading || inventoryLoading,
    error: menuError || inventoryError
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
}

export const usePOS = () => {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOS must be used within POSProvider');
  return ctx;
};
