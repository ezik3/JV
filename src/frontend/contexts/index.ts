// ============================================================================
// JointVibe POS V2 - Contexts Barrel Export
// ============================================================================
// Centralized export for all context providers and hooks
// Version: 2.0
// Last Updated: 2025-11-18
// ============================================================================

export { AuthProvider, useAuth } from './AuthContext';
export { POSProvider, usePOS } from './POSContext';
export { EmployeeProvider, useEmployee } from './EmployeeContext';

export type { default as AuthContext } from './AuthContext';
export type { default as POSContext } from './POSContext';
export type { default as EmployeeContext } from './EmployeeContext';
