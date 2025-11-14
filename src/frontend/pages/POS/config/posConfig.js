/**
 * POS System Configuration
 * 
 * This configuration file allows easy switching between different POS implementations:
 * - 'enhanced': Current enhanced POS system (default)
 * - 'nocturne': Nocturne POS (when available)
 * - 'classic': Classic simplified POS
 * 
 * To switch POS systems, simply change the ACTIVE_POS_SYSTEM constant.
 */

export const POS_SYSTEMS = {
  ENHANCED: 'enhanced',
  NOCTURNE: 'nocturne',
  CLASSIC: 'classic'
};

/**
 * Active POS System
 * Change this to switch between POS implementations
 */
export const ACTIVE_POS_SYSTEM = POS_SYSTEMS.ENHANCED;

/**
 * POS System Features Configuration
 */
export const POS_FEATURES = {
  [POS_SYSTEMS.ENHANCED]: {
    name: 'Enhanced POS',
    description: 'World-class POS with advanced features',
    features: {
      dualMode: true,              // Classic and Professional modes
      analytics: true,             // Advanced analytics dashboard
      multiPayment: true,          // Multiple payment methods
      inventory: true,             // Inventory management
      staffManagement: true,       // Staff permissions
      kitchenDisplay: true,        // Kitchen display integration
      aiWaiter: true,             // AI waiter integration
      cryptoPayments: true,       // Cryptocurrency payments
      mobileWallets: true,        // Mobile wallet support
      qrOrdering: true,           // QR code ordering
    },
    version: '2.0.0',
    lastUpdated: '2025-11-14'
  },
  
  [POS_SYSTEMS.NOCTURNE]: {
    name: 'Nocturne POS',
    description: 'Modern POS built with Lovable.dev',
    features: {
      // Will be updated when nocturne-pos is integrated
      dualMode: false,
      analytics: true,
      multiPayment: true,
      inventory: true,
      staffManagement: false,
      kitchenDisplay: false,
      aiWaiter: false,
      cryptoPayments: false,
      mobileWallets: true,
      qrOrdering: true,
    },
    version: '1.0.0',
    lastUpdated: 'TBD'
  },
  
  [POS_SYSTEMS.CLASSIC]: {
    name: 'Classic POS',
    description: 'Simple and streamlined interface',
    features: {
      dualMode: false,
      analytics: false,
      multiPayment: false,
      inventory: false,
      staffManagement: false,
      kitchenDisplay: false,
      aiWaiter: false,
      cryptoPayments: false,
      mobileWallets: false,
      qrOrdering: false,
    },
    version: '1.0.0',
    lastUpdated: '2025-11-14'
  }
};

/**
 * Get active POS system configuration
 */
export const getActivePOSConfig = () => {
  return {
    system: ACTIVE_POS_SYSTEM,
    ...POS_FEATURES[ACTIVE_POS_SYSTEM]
  };
};

/**
 * Check if a feature is available in the active POS system
 */
export const isPOSFeatureEnabled = (feature) => {
  const config = POS_FEATURES[ACTIVE_POS_SYSTEM];
  return config?.features?.[feature] || false;
};

/**
 * Get POS system display name
 */
export const getActivePOSName = () => {
  return POS_FEATURES[ACTIVE_POS_SYSTEM]?.name || 'Unknown POS';
};

/**
 * Backend API Configuration
 * Maps POS operations to backend endpoints
 */
export const POS_API_ENDPOINTS = {
  // Menu Management
  getMenu: '/api/menu/items',
  createMenuItem: '/api/menu/create',
  updateMenuItem: '/api/menu/update',
  deleteMenuItem: '/api/menu/delete',
  
  // Order Management
  getOrders: '/api/orders/list',
  placeOrder: '/api/orders/place-order',
  updateOrderStatus: '/api/orders/update-status',
  
  // POS Setup
  setupPOS: '/api/venue/setup-pos',
  checkPOSSetup: '/api/venue/check-pos-setup',
  
  // Inventory
  getInventory: '/api/inventory/list',
  updateInventory: '/api/inventory/update',
  
  // Payment
  processPayment: '/api/payment/process',
  
  // AI Waiter (if enabled)
  aiChat: '/api/ai/chat',
};

/**
 * POS Route Configuration
 */
export const POS_ROUTES = {
  main: '/venue/pos',
  dashboard: '/venue/pos/dashboard',
  system: '/venue/pos/system',
  orders: '/venue/pos/orders',
  menu: '/venue/pos/menu',
  inventory: '/venue/pos/inventory',
  auth: {
    manager: '/venue/pos/auth/manager',
    setup: '/venue/pos/auth/setup',
  }
};

export default {
  ACTIVE_POS_SYSTEM,
  POS_SYSTEMS,
  POS_FEATURES,
  POS_API_ENDPOINTS,
  POS_ROUTES,
  getActivePOSConfig,
  isPOSFeatureEnabled,
  getActivePOSName
};
