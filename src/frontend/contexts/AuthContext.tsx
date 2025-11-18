// ============================================================================
// JointVibe POS V2 - Authentication Context
// ============================================================================
// Manages user authentication, session state, and venue ownership
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  getCurrentUser,
  getCurrentSession,
  signInWithEmail,
  signUpWithEmail,
  signOut as supabaseSignOut,
  getVenueByOwnerId,
} from '../lib/supabase';
import type { Database } from '../types/database.types';

// ============================================================================
// TYPES
// ============================================================================

type Venue = Database['public']['Tables']['pos_venues']['Row'];

interface AuthContextType {
  // User state
  user: User | null;
  session: Session | null;
  venue: Venue | null;

  // Loading states
  loading: boolean;
  venueLoading: boolean;

  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;

  // Venue methods
  refreshVenue: () => Promise<void>;

  // Helpers
  isAuthenticated: boolean;
  hasVenue: boolean;
  isOwner: boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [venueLoading, setVenueLoading] = useState(false);

  // ============================================================================
  // INITIALIZE AUTH STATE
  // ============================================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get current session
        const currentSession = await getCurrentSession();

        if (mounted && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Fetch venue if user is authenticated
          await fetchVenue(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchVenue(currentSession.user.id);
        } else {
          setVenue(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================================
  // FETCH VENUE
  // ============================================================================

  const fetchVenue = async (userId: string) => {
    if (!userId) {
      setVenue(null);
      return;
    }

    setVenueLoading(true);
    try {
      const venueData = await getVenueByOwnerId(userId);
      setVenue(venueData);
    } catch (error) {
      console.error('Error fetching venue:', error);
      setVenue(null);
    } finally {
      setVenueLoading(false);
    }
  };

  // ============================================================================
  // SIGN IN
  // ============================================================================

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: authUser, session: authSession } = await signInWithEmail(email, password);

      setUser(authUser);
      setSession(authSession);

      if (authUser) {
        await fetchVenue(authUser.id);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SIGN UP
  // ============================================================================

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    try {
      setLoading(true);
      const { user: authUser, session: authSession } = await signUpWithEmail(
        email,
        password,
        metadata
      );

      setUser(authUser);
      setSession(authSession);

      // Note: Venue will be null for new users until they complete setup
      setVenue(null);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SIGN OUT
  // ============================================================================

  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseSignOut();
      setUser(null);
      setSession(null);
      setVenue(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // REFRESH VENUE
  // ============================================================================

  const refreshVenue = async () => {
    if (user) {
      await fetchVenue(user.id);
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const isAuthenticated = !!user && !!session;
  const hasVenue = !!venue;
  const isOwner = !!user && !!venue && venue.owner_id === user.id;

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AuthContextType = {
    // State
    user,
    session,
    venue,
    loading,
    venueLoading,

    // Methods
    signIn,
    signUp,
    signOut,
    refreshVenue,

    // Helpers
    isAuthenticated,
    hasVenue,
    isOwner,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AuthContext;
