/**
 * Supabase Client Configuration
 * Version: 2.0
 * Last Updated: 2025-11-18
 *
 * This file initializes and exports a singleton Supabase client instance.
 * Use this client throughout the application for all database operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// =============================================
// Environment Variables
// =============================================

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ Missing REACT_APP_SUPABASE_URL environment variable');
  console.error('Please add it to your .env.local file');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing REACT_APP_SUPABASE_ANON_KEY environment variable');
  console.error('Please add it to your .env.local file');
}

// =============================================
// Supabase Client Instance
// =============================================

/**
 * Supabase client instance with typed database schema
 * This is a singleton - use this export throughout the app
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'x-application-name': 'joinvibe-pos',
      },
    },
  }
);

// =============================================
// Helper Functions
// =============================================

/**
 * Test the Supabase connection
 * @returns Promise<boolean> - true if connection successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection test error:', err);
    return false;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }

  return user;
}

/**
 * Get the current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting current session:', error.message);
    return null;
  }

  return session;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    return false;
  }

  return true;
}

// =============================================
// Real-time Subscription Helpers
// =============================================

/**
 * Subscribe to order changes for a specific venue
 * @param venueId - The venue ID to subscribe to
 * @param callback - Function to call when orders change
 * @returns Unsubscribe function
 */
export function subscribeToOrders(
  venueId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`orders:venue:${venueId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `venue_id=eq.${venueId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to order item changes for a specific order
 * @param orderId - The order ID to subscribe to
 * @param callback - Function to call when order items change
 * @returns Unsubscribe function
 */
export function subscribeToOrderItems(
  orderId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`order_items:order:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'order_items',
        filter: `order_id=eq.${orderId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to menu item availability changes
 * @param venueId - The venue ID to subscribe to
 * @param callback - Function to call when menu items change
 * @returns Unsubscribe function
 */
export function subscribeToMenuItems(
  venueId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`menu_items:venue:${venueId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'menu_items',
        filter: `venue_id=eq.${venueId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to employee status changes for a venue
 * @param venueId - The venue ID to subscribe to
 * @param callback - Function to call when employee status changes
 * @returns Unsubscribe function
 */
export function subscribeToEmployees(
  venueId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`employees:venue:${venueId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'employees',
        filter: `venue_id=eq.${venueId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// =============================================
// Query Helpers
// =============================================

/**
 * Get a venue by slug
 */
export async function getVenueBySlug(slug: string) {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching venue:', error.message);
    return null;
  }

  return data;
}

/**
 * Get all active menu items for a venue with categories
 */
export async function getMenuItemsWithCategories(venueId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:menu_categories(*)
    `)
    .eq('venue_id', venueId)
    .eq('is_available', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching menu items:', error.message);
    return [];
  }

  return data;
}

/**
 * Get all orders for a venue with filters
 */
export async function getOrders(
  venueId: string,
  filters?: {
    status?: string[];
    date_from?: string;
    date_to?: string;
  }
) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      employee:employees(*),
      order_items(*)
    `)
    .eq('venue_id', venueId)
    .order('ordered_at', { ascending: false });

  if (filters?.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  if (filters?.date_from) {
    query = query.gte('ordered_at', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('ordered_at', filters.date_to);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error.message);
    return [];
  }

  return data;
}

/**
 * Get active employees for a venue
 */
export async function getActiveEmployees(venueId: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('venue_id', venueId)
    .eq('is_active', true)
    .order('first_name');

  if (error) {
    console.error('Error fetching employees:', error.message);
    return [];
  }

  return data;
}

/**
 * Get current active shift for an employee
 */
export async function getActiveShift(employeeId: string) {
  const { data, error } = await supabase
    .from('employee_shifts')
    .select('*')
    .eq('employee_id', employeeId)
    .is('end_time', null)
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching active shift:', error.message);
    return null;
  }

  return data;
}

// =============================================
// Mutation Helpers
// =============================================

/**
 * Create a new order
 */
export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error.message);
    throw error;
  }

  return data;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  const statusTimestampField = `${status}_at`;
  const updateData: any = { status };

  // Set appropriate timestamp field
  if (['preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
    updateData[statusTimestampField] = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error.message);
    throw error;
  }

  return data;
}

/**
 * Clock in an employee
 */
export async function clockInEmployee(employeeId: string, venueId: string) {
  // First, update employee status
  const { error: employeeError } = await supabase
    .from('employees')
    .update({ is_clocked_in: true })
    .eq('id', employeeId);

  if (employeeError) {
    console.error('Error clocking in employee:', employeeError.message);
    throw employeeError;
  }

  // Create shift record
  const { data, error } = await supabase
    .from('employee_shifts')
    .insert({
      employee_id: employeeId,
      venue_id: venueId,
      start_time: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating shift:', error.message);
    throw error;
  }

  return data;
}

/**
 * Clock out an employee
 */
export async function clockOutEmployee(employeeId: string, shiftId: string) {
  // Update employee status
  const { error: employeeError } = await supabase
    .from('employees')
    .update({ is_clocked_in: false })
    .eq('id', employeeId);

  if (employeeError) {
    console.error('Error clocking out employee:', employeeError.message);
    throw employeeError;
  }

  // End shift record
  const { data, error } = await supabase
    .from('employee_shifts')
    .update({ end_time: new Date().toISOString() })
    .eq('id', shiftId)
    .select()
    .single();

  if (error) {
    console.error('Error ending shift:', error.message);
    throw error;
  }

  return data;
}

// =============================================
// Export default
// =============================================

export default supabase;
