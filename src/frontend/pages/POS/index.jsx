import { POSProvider } from './contexts/POSContext'

// This file serves as the entry point wrapper for the POS system
// It ensures all POS pages have access to the POSContext

export { POSProvider }

// Re-export all POS pages
export { default as Dashboard } from './Dashboard'
export { default as OrderEntry } from './OrderEntry'
export { default as Kitchen } from './Kitchen'
