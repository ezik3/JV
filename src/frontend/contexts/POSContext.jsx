// src/frontend/contexts/POSProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import {
  getMenuItems,
  getInventory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateInventory as updateInventoryAction
} from 'wasp/client/operations';

// Unified POS provider that exposes both legacy and nocturne APIs
const POSContext = createContext(null);

export function POSProvider({ children }) {
  // ---------- Backend (WASP) data ----------
  const { data: menuItemsFromApi = [], isLoading: menuLoading, error: menuError } = useQuery(getMenuItems);
  const { data: inventoryFromApi = [], isLoading: inventoryLoading, error: inventoryError } = useQuery(getInventory);

  const createMenuItemFn = useAction(createMenuItem);
  const updateMenuItemFn = useAction(updateMenuItem);
  const deleteMenuItemFn = useAction(deleteMenuItem);
  const updateInventoryFn = useAction(updateInventoryAction);

  // ---------- Local POS state (Nocturne style) ----------
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentStaff, setCurrentStaff] = useState(null);

  // role management (fallbacked to localStorage for now)
  const [role, setRole] = useState(() => localStorage.getItem('venueRole') || 'staff');

  // Keep legacy menuItems in sync for older components
  useEffect(() => {
    // convert menuItemsFromApi into Nocturne `menu` shape if API returns data
    if (menuItemsFromApi && menuItemsFromApi.length > 0) {
      const normalized = menuItemsFromApi.map(mi => ({
        id: String(mi.id),
        name: mi.name,
        description: mi.description,
        category: mi.category || 'General',
        price: mi.price || 0,
        available: mi.stockStatus !== 'out-of-stock'
      }));
      setMenu(normalized);
    }
  }, [menuItemsFromApi]);

  // ---------- Nocturne-style cart/order helpers ----------
  const addToCart = (menuItem, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { id: `cart-${Date.now()}`, menuItem, quantity: qty }];
    });
  };

  const updateCartItem = (cartId, quantity) => {
    setCart(prev => prev.map(i => (i.id === cartId ? { ...i, quantity } : i)));
  };

  const removeFromCart = cartId => setCart(prev => prev.filter(i => i.id !== cartId));
  const clearCart = () => setCart([]);

  const createOrder = async (orderMeta = {}) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      items: cart,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...orderMeta
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    // optionally hook to backend here
    return newOrder;
  };

  // ---------- Legacy actions that call Wasp actions ----------
  const addMenuItem = async (newItem) => {
    try {
      return await createMenuItemFn(newItem);
    } catch (err) {
      console.error('createMenuItem error', err);
      throw err;
    }
  };

  const updateInventory = async (menuItemId, qty) => {
    try {
      return await updateInventoryFn({ menuItemId, quantity: qty });
    } catch (err) {
      console.error('updateInventory error', err);
      throw err;
    }
  };

  const updateMenuItem = async (id, data) => {
    try {
      return await updateMenuItemFn({ id, ...data });
    } catch (err) {
      console.error('updateMenuItem error', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      return await deleteMenuItemFn({ id });
    } catch (err) {
      console.error('deleteMenuItem error', err);
      throw err;
    }
  };

  // ---------- Derived / helper values ----------
  const isLoading = menuLoading || inventoryLoading;
  const error = menuError || inventoryError;

  const value = useMemo(() => ({
    // nocturne APIs
    menu, cart, orders, currentStaff, role,
    addToCart, updateCartItem, removeFromCart, clearCart, createOrder,
    setCurrentStaff, setRole,

    // legacy APIs (for older pages like POSMenuBuilder/POSInventory)
    menuItems: menuItemsFromApi,
    inventory: inventoryFromApi,
    addMenuItem, updateInventory, updateMenuItem, deleteMenuItem,

    isLoading, error
  }), [
    menu, cart, orders, currentStaff, role,
    menuItemsFromApi, inventoryFromApi, isLoading, error
  ]);

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export const usePOS = () => {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOS must be used inside POSProvider');
  return ctx;
};

export default POSProvider;
