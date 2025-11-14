// Export the original POSInterface for backward compatibility
export { POSInterface } from './POSInterface';

// Export the new POSAdapter for flexible POS system integration
export { default as POSAdapter } from './POSAdapter';

// Export POS configuration utilities
export { 
  ACTIVE_POS_SYSTEM,
  POS_SYSTEMS,
  POS_FEATURES,
  POS_API_ENDPOINTS,
  POS_ROUTES,
  getActivePOSConfig,
  isPOSFeatureEnabled,
  getActivePOSName
} from './config/posConfig';
