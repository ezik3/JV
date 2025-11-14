/**
 * POS Configuration
 * Central configuration for switching between POS systems
 */

// Available POS Systems
export const POS_SYSTEMS = {
  ENHANCED: 'enhanced',           // Original Enhanced POS (src/frontend/pages/POS)
  NOCTURNE: 'nocturne',           // New Nocturne POS (src/frontend/pages/NocturnePOS)
  CLASSIC: 'classic',             // Classic JointVibe POS (src/frontend/pages/JointVibePOS)
};

// ⚠️ CHANGE THIS TO SWITCH POS SYSTEMS ⚠️
// Options: POS_SYSTEMS.ENHANCED | POS_SYSTEMS.NOCTURNE | POS_SYSTEMS.CLASSIC
export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.ENHANCED;

// Fallback order if active system fails to load
export const FALLBACK_ORDER = [
  POS_SYSTEMS.ENHANCED,   // Try Enhanced first
  POS_SYSTEMS.NOCTURNE,   // Then Nocturne
  POS_SYSTEMS.CLASSIC,    // Finally Classic
];

// POS System Configurations
export const POS_CONFIG = {
  [POS_SYSTEMS.ENHANCED]: {
    name: 'Enhanced POS',
    description: 'Full-featured POS with modern UI comparable to Square/Odoo',
    path: '../pages/POS',
    mainComponent: 'POSInterface',
    features: [
      'Dual modes (Classic & Professional)',
      'Multiple payment methods',
      'Enhanced dashboard',
      'Analytics & Reports',
      'Inventory management',
    ],
    enabled: true,
  },

  [POS_SYSTEMS.NOCTURNE]: {
    name: 'Nocturne POS',
    description: 'Modern POS built with Lovable.dev featuring beautiful UI/UX',
    path: '../pages/NocturnePOS',
    mainComponent: 'NocturneInterface',
    features: [
      'Modern shadcn/ui components',
      'Tailwind CSS styling',
      'Floorplan editor',
      'Kitchen Display System',
      'Advanced analytics',
      'Staff management',
    ],
    enabled: true,
  },

  [POS_SYSTEMS.CLASSIC]: {
    name: 'Classic JointVibe POS',
    description: 'Original JointVibe POS system',
    path: '../pages/JointVibePOS',
    mainComponent: 'POSMain',
    features: [
      'Simple interface',
      'Basic order management',
      'Payment processing',
    ],
    enabled: true,
  },
};

// Feature flags
export const FEATURES = {
  enableSystemSwitching: true,      // Allow runtime POS system switching
  enableFallback: true,             // Enable automatic fallback on errors
  showSystemSelector: false,        // Show UI to switch systems (for testing)
  logSystemErrors: true,            // Log errors to console
};

// Get active POS configuration
export const getActivePOSConfig = () => {
  return POS_CONFIG[ACTIVE_POS_SYSTEM];
};

// Get all enabled POS systems
export const getEnabledPOSSystems = () => {
  return Object.entries(POS_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));
};

// Validate POS system
export const isValidPOSSystem = (system) => {
  return Object.values(POS_SYSTEMS).includes(system);
};

// Get next fallback system
export const getNextFallback = (failedSystem) => {
  const currentIndex = FALLBACK_ORDER.indexOf(failedSystem);
  if (currentIndex === -1 || currentIndex >= FALLBACK_ORDER.length - 1) {
    return null;
  }
  return FALLBACK_ORDER[currentIndex + 1];
};
