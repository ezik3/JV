// =====================================================
// SUPABASE CLIENT CONFIGURATION
// =====================================================
// AGENT INSTRUCTIONS:
// 1. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in .env
// 2. Do NOT commit .env to git
// 3. This client is used throughout the entire POS system
// =====================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.generated';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper Functions

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Get user's profile
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get user's roles
 */
export const getUserRoles = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(r => r.role);
};

/**
 * Check if user has a specific role
 */
export const hasRole = async (userId: string, role: string) => {
  const roles = await getUserRoles(userId);
  return roles.includes(role);
};

/**
 * Get venues owned by user
 */
export const getUserVenues = async (userId: string) => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('owner_id', userId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
};

/**
 * Get venues where user is an employee
 */
export const getEmployeeVenues = async (userId: string) => {
  const { data, error } = await supabase
    .from('employee_venue_links')
    .select(`
      *,
      venues (*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
};

/**
 * Upload file to Supabase Storage
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
};

/**
 * Get public URL for uploaded file
 */
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Subscribe to realtime changes
 */
export const subscribeToTable = (
  table: string,
  filter: Record<string, any>,
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: Object.entries(filter)
          .map(([key, val]) => `${key}=eq.${val}`)
          .join(',')
      },
      callback
    )
    .subscribe();

  return channel;
};

/**
 * Unsubscribe from realtime changes
 */
export const unsubscribeFromChannel = (channel: any) => {
  return supabase.removeChannel(channel);
};

export default supabase;
