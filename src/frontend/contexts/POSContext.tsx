// ============================================================================
// JointVibe POS V2 - POS Context
// ============================================================================
// Manages POS state, cart, orders, and real-time subscriptions
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, subscribeToTable, unsubscribe } from '../lib/supabase';
import {
  calculateCartItemTotal,
  calculateCartSubtotal,
  getCartItemId,
  generateOrderNumber,
} from '../lib/utils';
import { useAuth } from './AuthContext';
import type {
  CartItem,
  SelectedModifier,
  OrderType,
  OrderWithItems,
  PosMenuItem,
  PosTable,
  PosOrder,
  PosOrderInsert,
} from '../types/database.types';

// ============================================================================
// TYPES
// ============================================================================

interface POSContextType {
  // Cart state
  cart: CartItem[];
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;

  // Order state
  currentOrderType: OrderType;
  currentTable: PosTable | null;
  customerName: string;
  customerPhone: string;
  notes: string;

  // Active orders (real-time)
  activeOrders: OrderWithItems[];
  ordersLoading: boolean;

  // Menu items cache
  menuItems: PosMenuItem[];
  menuItemsLoading: boolean;

  // Tables cache
  tables: PosTable[];
  tablesLoading: boolean;

  // Cart methods
  addToCart: (item: PosMenuItem, quantity: number, modifiers: SelectedModifier[]) => void;
  updateCartItem: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Order methods
  setOrderType: (type: OrderType) => void;
  setTable: (table: PosTable | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setNotes: (notes: string) => void;
  createOrder: () => Promise<PosOrder>;

  // Data fetching
  refreshMenuItems: () => Promise<void>;
  refreshTables: () => Promise<void>;
  refreshActiveOrders: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const POSContext = createContext<POSContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface POSProviderProps {
  children: React.ReactNode;
}

export const POSProvider: React.FC<POSProviderProps> = ({ children }) => {
  const { venue, isAuthenticated } = useAuth();

  // ============================================================================
  // CART STATE
  // ============================================================================

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrderType, setCurrentOrderType] = useState<OrderType>('dine_in');
  const [currentTable, setCurrentTable] = useState<PosTable | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // ============================================================================
  // DATA STATE
  // ============================================================================

  const [activeOrders, setActiveOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [menuItems, setMenuItems] = useState<PosMenuItem[]>([]);
  const [menuItemsLoading, setMenuItemsLoading] = useState(false);

  const [tables, setTables] = useState<PosTable[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================

  useEffect(() => {
    if (!venue || !isAuthenticated) {
      return;
    }

    let ordersChannel: RealtimeChannel | null = null;

    // Subscribe to order changes
    const setupSubscriptions = async () => {
      ordersChannel = subscribeToTable(
        'pos_orders',
        (payload) => {
          console.log('Order change:', payload);
          refreshActiveOrders();
        },
        `venue_id=eq.${venue.id}`
      );
    };

    setupSubscriptions();

    return () => {
      if (ordersChannel) {
        unsubscribe(ordersChannel);
      }
    };
  }, [venue, isAuthenticated]);

  // ============================================================================
  // FETCH INITIAL DATA
  // ============================================================================

  useEffect(() => {
    if (venue) {
      refreshMenuItems();
      refreshTables();
      refreshActiveOrders();
    }
  }, [venue]);

  // ============================================================================
  // CART CALCULATIONS
  // ============================================================================

  const cartSubtotal = calculateCartSubtotal(cart);
  const taxRate = venue?.tax_rate || 0;
  const cartTax = cartSubtotal * taxRate;
  const cartTotal = cartSubtotal + cartTax;

  // ============================================================================
  // CART METHODS
  // ============================================================================

  const addToCart = useCallback((
    item: PosMenuItem,
    quantity: number,
    modifiers: SelectedModifier[]
  ) => {
    const cartItem: CartItem = {
      menu_item_id: item.id,
      name: item.name,
      quantity,
      unit_price: item.price,
      modifiers,
    };

    setCart((prev) => {
      // Check if same item with same modifiers exists
      const existingItemIndex = prev.findIndex(
        (ci) => getCartItemId(ci) === getCartItemId(cartItem)
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...prev, cartItem];
      }
    });
  }, []);

  const updateCartItem = useCallback((cartItemId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return prev.filter((item) => getCartItemId(item) !== cartItemId);
      }

      return prev.map((item) =>
        getCartItemId(item) === cartItemId
          ? { ...item, quantity }
          : item
      );
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => getCartItemId(item) !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCurrentTable(null);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  }, []);

  // ============================================================================
  // ORDER METHODS
  // ============================================================================

  const setOrderType = useCallback((type: OrderType) => {
    setCurrentOrderType(type);
    // Clear table if not dine-in
    if (type !== 'dine_in') {
      setCurrentTable(null);
    }
  }, []);

  const setTable = useCallback((table: PosTable | null) => {
    setCurrentTable(table);
    if (table && currentOrderType !== 'dine_in') {
      setCurrentOrderType('dine_in');
    }
  }, [currentOrderType]);

  const createOrder = useCallback(async (): Promise<PosOrder> => {
    if (!venue) {
      throw new Error('No venue selected');
    }

    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      // Get current user/employee
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Calculate totals
      const subtotal = cartSubtotal;
      const tax = cartTax;
      const total = cartTotal;

      // Create order
      const orderData: PosOrderInsert = {
        venue_id: venue.id,
        order_number: generateOrderNumber(),
        order_type: currentOrderType,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        tax_amount: tax,
        total_amount: total,
        table_id: currentTable?.id || null,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        notes: notes || null,
      };

      const { data: order, error: orderError } = await supabase
        .from('pos_orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        modifiers: item.modifiers || [],
        status: 'pending' as const,
        subtotal: calculateCartItemTotal(item),
      }));

      const { error: itemsError } = await supabase
        .from('pos_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      clearCart();

      // Refresh active orders
      await refreshActiveOrders();

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [venue, cart, cartSubtotal, cartTax, cartTotal, currentOrderType, currentTable, customerName, customerPhone, notes, clearCart]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const refreshMenuItems = useCallback(async () => {
    if (!venue) return;

    setMenuItemsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pos_menu_items')
        .select('*')
        .eq('venue_id', venue.id)
        .eq('is_active', true)
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    } finally {
      setMenuItemsLoading(false);
    }
  }, [venue]);

  const refreshTables = useCallback(async () => {
    if (!venue) return;

    setTablesLoading(true);
    try {
      const { data, error } = await supabase
        .from('pos_tables')
        .select('*')
        .eq('venue_id', venue.id)
        .eq('is_active', true)
        .order('table_number');

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setTables([]);
    } finally {
      setTablesLoading(false);
    }
  }, [venue]);

  const refreshActiveOrders = useCallback(async () => {
    if (!venue) return;

    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('pos_orders')
        .select(`
          *,
          pos_order_items(*),
          pos_employees(first_name, last_name),
          pos_tables(table_number)
        `)
        .eq('venue_id', venue.id)
        .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveOrders((data as any) || []);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      setActiveOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [venue]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: POSContextType = {
    // Cart state
    cart,
    cartSubtotal,
    cartTax,
    cartTotal,

    // Order state
    currentOrderType,
    currentTable,
    customerName,
    customerPhone,
    notes,

    // Active orders
    activeOrders,
    ordersLoading,

    // Menu items
    menuItems,
    menuItemsLoading,

    // Tables
    tables,
    tablesLoading,

    // Cart methods
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,

    // Order methods
    setOrderType,
    setTable,
    setCustomerName,
    setCustomerPhone,
    setNotes,
    createOrder,

    // Data fetching
    refreshMenuItems,
    refreshTables,
    refreshActiveOrders,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);

  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }

  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default POSContext;
