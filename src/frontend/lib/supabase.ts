// ============================================================================
// JointVibe POS V2 - Supabase Client
// ============================================================================
// Supabase client configuration with TypeScript types
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
  );
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

/**
 * Supabase client with TypeScript types
 * Configured for real-time subscriptions and auto-refresh
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
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
      'X-Client-Info': 'jointVibe-pos-v2',
    },
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Get the current session
 */
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string, metadata?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
  return data;
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to table changes
 * @param table - Table name
 * @param callback - Callback function to handle changes
 * @param filter - Optional filter
 */
export const subscribeToTable = <T = any>(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      callback
    )
    .subscribe();

  return channel;
};

/**
 * Subscribe to specific row changes
 * @param table - Table name
 * @param id - Row ID
 * @param callback - Callback function
 */
export const subscribeToRow = <T = any>(
  table: string,
  id: string,
  callback: (payload: any) => void
) => {
  return subscribeToTable(table, callback, `id=eq.${id}`);
};

/**
 * Unsubscribe from a channel
 * @param channel - Channel to unsubscribe from
 */
export const unsubscribe = async (channel: ReturnType<typeof subscribeToTable>) => {
  await supabase.removeChannel(channel);
};

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Upload a file to Supabase Storage
 * @param bucket - Bucket name
 * @param path - File path
 * @param file - File to upload
 */
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data;
};

/**
 * Get public URL for a file
 * @param bucket - Bucket name
 * @param path - File path
 */
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Delete a file from storage
 * @param bucket - Bucket name
 * @param path - File path
 */
export const deleteFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return data;
};

// ============================================================================
// QUERY HELPERS
// ============================================================================

/**
 * Generic fetch function with error handling
 * @param query - Supabase query
 */
export const fetchData = async <T = any>(query: any): Promise<T> => {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
};

/**
 * Generic insert function
 * @param table - Table name
 * @param data - Data to insert
 */
export const insertData = async <T = any>(table: string, data: any): Promise<T> => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result as T;
};

/**
 * Generic update function
 * @param table - Table name
 * @param id - Record ID
 * @param data - Data to update
 */
export const updateData = async <T = any>(
  table: string,
  id: string,
  data: any
): Promise<T> => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result as T;
};

/**
 * Generic delete function
 * @param table - Table name
 * @param id - Record ID
 */
export const deleteData = async (table: string, id: string): Promise<void> => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};

/**
 * Fetch single record by ID
 * @param table - Table name
 * @param id - Record ID
 */
export const fetchById = async <T = any>(table: string, id: string): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data as T;
};

/**
 * Fetch all records from a table
 * @param table - Table name
 * @param options - Query options
 */
export const fetchAll = async <T = any>(
  table: string,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<T[]> => {
  let query = supabase.from(table).select(options?.select || '*');

  // Apply filters
  if (options?.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  // Apply ordering
  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }

  // Apply limit
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
};

// ============================================================================
// POS-SPECIFIC HELPERS
// ============================================================================

/**
 * Get venue by owner ID
 * @param ownerId - Owner user ID
 */
export const getVenueByOwnerId = async (ownerId: string) => {
  const { data, error } = await supabase
    .from('pos_venues')
    .select('*')
    .eq('owner_id', ownerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
};

/**
 * Get active shift for employee
 * @param employeeId - Employee ID
 */
export const getActiveShift = async (employeeId: string) => {
  const { data, error } = await supabase
    .from('pos_shifts')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'active')
    .order('clock_in', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
};

/**
 * Get active orders for venue
 * @param venueId - Venue ID
 */
export const getActiveOrders = async (venueId: string) => {
  const { data, error } = await supabase
    .from('pos_orders')
    .select(`
      *,
      pos_order_items(*),
      pos_employees(first_name, last_name),
      pos_tables(table_number)
    `)
    .eq('venue_id', venueId)
    .in('status', ['pending', 'confirmed', 'preparing', 'ready'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get menu items with categories
 * @param venueId - Venue ID
 */
export const getMenuWithCategories = async (venueId: string) => {
  const { data, error } = await supabase
    .from('pos_menu_items')
    .select(`
      *,
      pos_menu_categories(*)
    `)
    .eq('venue_id', venueId)
    .eq('is_active', true)
    .eq('is_available', true)
    .order('name');

  if (error) throw error;
  return data;
};

/**
 * Check inventory levels and get low stock items
 * @param venueId - Venue ID
 */
export const getLowStockItems = async (venueId: string) => {
  const { data, error } = await supabase
    .from('pos_inventory')
    .select('*')
    .eq('venue_id', venueId)
    .eq('is_active', true)
    .lte('current_quantity', supabase.rpc('minimum_quantity'));

  if (error) throw error;
  return data;
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Format Supabase error for display
 * @param error - Supabase error
 */
export const formatError = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (typeof error === 'string') return error;

  return 'An error occurred while processing your request';
};

/**
 * Check if error is a network error
 * @param error - Error object
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Network request failed') ||
    error?.code === 'NETWORK_ERROR'
  );
};

/**
 * Check if error is an authentication error
 * @param error - Error object
 */
export const isAuthError = (error: any): boolean => {
  return (
    error?.status === 401 ||
    error?.code === 'PGRST301' ||
    error?.message?.includes('JWT')
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default supabase;

export type { Database };
