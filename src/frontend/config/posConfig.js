/**
 * POS System Configuration
 *
 * This file defines the available POS systems and which one is currently active.
 * Change ACTIVE_POS_SYSTEM to switch between different POS implementations.
 */

export const POS_SYSTEMS = {
  ENHANCED: 'ENHANCED',
  NOCTURNE: 'NOCTURNE',
};

// ==========================================
// CHANGE THIS TO SWITCH POS SYSTEMS
// ==========================================
export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.NOCTURNE;

/**
 * POS System Configurations
 */
export const POS_CONFIG = {
  [POS_SYSTEMS.ENHANCED]: {
    name: 'Enhanced POS',
    description: 'Original POS system with comprehensive features',
    features: [
      'Order management',
      'Menu builder',
      'Inventory tracking',
      'Analytics dashboard',
    ],
  },
  [POS_SYSTEMS.NOCTURNE]: {
    name: 'Nocturne POS',
    description: 'Modern POS built with clean JavaScript and inline styles',
    features: [
      'Clean JavaScript (no TypeScript)',
      'Inline styles (no external CSS)',
      'Modern UI with gradients',
      'Order management',
      'Menu management',
    ],
  },
};

/**
 * Get the current active POS system configuration
 */
export function getActivePOSConfig() {
  return POS_CONFIG[ACTIVE_POS_SYSTEM];
}
