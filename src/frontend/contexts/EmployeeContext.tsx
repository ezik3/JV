// ============================================================================
// JointVibe POS V2 - Employee Context
// ============================================================================
// Manages employee shifts, clock in/out, permissions, and breaks
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { calculateHoursWorked } from '../lib/utils';
import { useAuth } from './AuthContext';
import type {
  PosEmployee,
  PosShift,
  PosShiftInsert,
  PosShiftUpdate,
  EmployeeRole,
  ShiftStatus,
  PosShiftBreak,
  PosShiftBreakInsert,
} from '../types/database.types';

// ============================================================================
// TYPES
// ============================================================================

interface EmployeePermissions {
  canCreateOrders: boolean;
  canModifyOrders: boolean;
  canCancelOrders: boolean;
  canAccessKitchen: boolean;
  canManageInventory: boolean;
  canManageMenu: boolean;
  canManageStaff: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canProcessRefunds: boolean;
  canOpenCashDrawer: boolean;
}

interface EmployeeContextType {
  // Employee state
  employee: PosEmployee | null;
  currentShift: PosShift | null;
  isOnShift: boolean;
  permissions: EmployeePermissions;

  // Loading states
  loading: boolean;
  shiftLoading: boolean;

  // Authentication
  loginWithPin: (pin: string) => Promise<PosEmployee>;
  logout: () => void;

  // Shift management
  clockIn: (employeeId: string, cashDrawerAmount?: number) => Promise<PosShift>;
  clockOut: (notes?: string) => Promise<PosShift>;

  // Break management
  startBreak: (breakType: 'regular' | 'meal' | 'smoke') => Promise<PosShiftBreak>;
  endBreak: (breakId: string) => Promise<PosShiftBreak>;
  currentBreak: PosShiftBreak | null;
  isOnBreak: boolean;

  // Shift data
  shiftDuration: number; // in minutes
  shiftEarnings: number;

  // Helpers
  refreshEmployee: () => Promise<void>;
  refreshShift: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface EmployeeProviderProps {
  children: React.ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const { venue } = useAuth();

  const [employee, setEmployee] = useState<PosEmployee | null>(null);
  const [currentShift, setCurrentShift] = useState<PosShift | null>(null);
  const [currentBreak, setCurrentBreak] = useState<PosShiftBreak | null>(null);
  const [loading, setLoading] = useState(false);
  const [shiftLoading, setShiftLoading] = useState(false);

  // ============================================================================
  // EMPLOYEE PERMISSIONS
  // ============================================================================

  const getPermissions = (role: EmployeeRole | null): EmployeePermissions => {
    if (!role) {
      return {
        canCreateOrders: false,
        canModifyOrders: false,
        canCancelOrders: false,
        canAccessKitchen: false,
        canManageInventory: false,
        canManageMenu: false,
        canManageStaff: false,
        canViewAnalytics: false,
        canManageSettings: false,
        canProcessRefunds: false,
        canOpenCashDrawer: false,
      };
    }

    const basePermissions = {
      canCreateOrders: true,
      canModifyOrders: true,
      canCancelOrders: false,
      canAccessKitchen: false,
      canManageInventory: false,
      canManageMenu: false,
      canManageStaff: false,
      canViewAnalytics: false,
      canManageSettings: false,
      canProcessRefunds: false,
      canOpenCashDrawer: false,
    };

    switch (role) {
      case 'manager':
        return {
          canCreateOrders: true,
          canModifyOrders: true,
          canCancelOrders: true,
          canAccessKitchen: true,
          canManageInventory: true,
          canManageMenu: true,
          canManageStaff: true,
          canViewAnalytics: true,
          canManageSettings: true,
          canProcessRefunds: true,
          canOpenCashDrawer: true,
        };

      case 'kitchen':
        return {
          ...basePermissions,
          canCreateOrders: false,
          canModifyOrders: false,
          canAccessKitchen: true,
        };

      case 'bartender':
        return {
          ...basePermissions,
          canOpenCashDrawer: true,
        };

      case 'waiter':
        return {
          ...basePermissions,
        };

      case 'host':
        return {
          ...basePermissions,
          canModifyOrders: false,
        };

      default:
        return basePermissions;
    }
  };

  const permissions = getPermissions(employee?.role || null);

  // ============================================================================
  // CHECK FOR ACTIVE SHIFT ON MOUNT
  // ============================================================================

  useEffect(() => {
    const checkActiveShift = async () => {
      const storedEmployeeId = localStorage.getItem('pos_employee_id');
      if (storedEmployeeId && venue) {
        await refreshEmployee();
        await refreshShift();
      }
    };

    checkActiveShift();
  }, [venue]);

  // ============================================================================
  // LOGIN WITH PIN
  // ============================================================================

  const loginWithPin = useCallback(async (pin: string): Promise<PosEmployee> => {
    if (!venue) {
      throw new Error('No venue selected');
    }

    setLoading(true);
    try {
      // Find employee by PIN
      const { data, error } = await supabase
        .from('pos_employees')
        .select('*')
        .eq('venue_id', venue.id)
        .eq('pin', pin)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Invalid PIN');
        }
        throw error;
      }

      if (!data) {
        throw new Error('Invalid PIN');
      }

      setEmployee(data);
      localStorage.setItem('pos_employee_id', data.id);

      // Check for active shift
      await refreshShift();

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [venue]);

  // ============================================================================
  // LOGOUT
  // ============================================================================

  const logout = useCallback(() => {
    setEmployee(null);
    setCurrentShift(null);
    setCurrentBreak(null);
    localStorage.removeItem('pos_employee_id');
  }, []);

  // ============================================================================
  // CLOCK IN
  // ============================================================================

  const clockIn = useCallback(async (
    employeeId: string,
    cashDrawerAmount?: number
  ): Promise<PosShift> => {
    if (!venue) {
      throw new Error('No venue selected');
    }

    setShiftLoading(true);
    try {
      // Check for existing active shift
      const { data: existingShift } = await supabase
        .from('pos_shifts')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('status', 'active')
        .single();

      if (existingShift) {
        setCurrentShift(existingShift);
        return existingShift;
      }

      // Create new shift
      const shiftData: PosShiftInsert = {
        venue_id: venue.id,
        employee_id: employeeId,
        clock_in: new Date().toISOString(),
        status: 'active',
        opening_cash_drawer: cashDrawerAmount || 0,
      };

      const { data: newShift, error } = await supabase
        .from('pos_shifts')
        .insert(shiftData)
        .select()
        .single();

      if (error) throw error;
      if (!newShift) throw new Error('Failed to create shift');

      setCurrentShift(newShift);
      return newShift;
    } catch (error) {
      console.error('Clock in error:', error);
      throw error;
    } finally {
      setShiftLoading(false);
    }
  }, [venue]);

  // ============================================================================
  // CLOCK OUT
  // ============================================================================

  const clockOut = useCallback(async (notes?: string): Promise<PosShift> => {
    if (!currentShift) {
      throw new Error('No active shift');
    }

    setShiftLoading(true);
    try {
      // End any active break
      if (currentBreak && !currentBreak.end_time) {
        await endBreak(currentBreak.id);
      }

      // Update shift
      const updateData: PosShiftUpdate = {
        clock_out: new Date().toISOString(),
        status: 'completed',
        notes: notes || currentShift.notes,
      };

      const { data, error } = await supabase
        .from('pos_shifts')
        .update(updateData)
        .eq('id', currentShift.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update shift');

      setCurrentShift(null);
      return data;
    } catch (error) {
      console.error('Clock out error:', error);
      throw error;
    } finally {
      setShiftLoading(false);
    }
  }, [currentShift, currentBreak]);

  // ============================================================================
  // BREAK MANAGEMENT
  // ============================================================================

  const startBreak = useCallback(async (
    breakType: 'regular' | 'meal' | 'smoke'
  ): Promise<PosShiftBreak> => {
    if (!currentShift) {
      throw new Error('No active shift');
    }

    if (currentBreak && !currentBreak.end_time) {
      throw new Error('Already on break');
    }

    try {
      const breakData: PosShiftBreakInsert = {
        shift_id: currentShift.id,
        break_type: breakType,
        start_time: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('pos_shift_breaks')
        .insert(breakData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to start break');

      setCurrentBreak(data);
      return data;
    } catch (error) {
      console.error('Start break error:', error);
      throw error;
    }
  }, [currentShift, currentBreak]);

  const endBreak = useCallback(async (breakId: string): Promise<PosShiftBreak> => {
    try {
      const { data, error } = await supabase
        .from('pos_shift_breaks')
        .update({ end_time: new Date().toISOString() })
        .eq('id', breakId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to end break');

      setCurrentBreak(null);
      return data;
    } catch (error) {
      console.error('End break error:', error);
      throw error;
    }
  }, []);

  // ============================================================================
  // REFRESH EMPLOYEE
  // ============================================================================

  const refreshEmployee = useCallback(async () => {
    const employeeId = localStorage.getItem('pos_employee_id');
    if (!employeeId || !venue) {
      setEmployee(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pos_employees')
        .select('*')
        .eq('id', employeeId)
        .eq('venue_id', venue.id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Employee not found, clear local storage
          localStorage.removeItem('pos_employee_id');
          setEmployee(null);
          return;
        }
        throw error;
      }

      setEmployee(data);
    } catch (error) {
      console.error('Error refreshing employee:', error);
      setEmployee(null);
    }
  }, [venue]);

  // ============================================================================
  // REFRESH SHIFT
  // ============================================================================

  const refreshShift = useCallback(async () => {
    if (!employee) {
      setCurrentShift(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pos_shifts')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('status', 'active')
        .order('clock_in', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setCurrentShift(null);
          return;
        }
        throw error;
      }

      setCurrentShift(data);

      // Check for active break
      if (data) {
        const { data: breakData } = await supabase
          .from('pos_shift_breaks')
          .select('*')
          .eq('shift_id', data.id)
          .is('end_time', null)
          .single();

        setCurrentBreak(breakData || null);
      }
    } catch (error) {
      console.error('Error refreshing shift:', error);
      setCurrentShift(null);
    }
  }, [employee]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const isOnShift = !!currentShift && currentShift.status === 'active';
  const isOnBreak = !!currentBreak && !currentBreak.end_time;

  const shiftDuration = currentShift
    ? calculateHoursWorked(currentShift.clock_in, currentShift.clock_out || new Date().toISOString()) * 60
    : 0;

  const shiftEarnings = currentShift?.total_sales || 0;

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: EmployeeContextType = {
    // Employee state
    employee,
    currentShift,
    isOnShift,
    permissions,

    // Loading states
    loading,
    shiftLoading,

    // Authentication
    loginWithPin,
    logout,

    // Shift management
    clockIn,
    clockOut,

    // Break management
    startBreak,
    endBreak,
    currentBreak,
    isOnBreak,

    // Shift data
    shiftDuration,
    shiftEarnings,

    // Helpers
    refreshEmployee,
    refreshShift,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useEmployee = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);

  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }

  return context;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default EmployeeContext;
