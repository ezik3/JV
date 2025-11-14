/**
 * POS System Adapter
 * 
 * This component acts as an adapter layer between the venue system and different POS implementations.
 * It allows seamless switching between Enhanced POS, Nocturne POS, or Classic POS by simply
 * changing the configuration.
 * 
 * Usage:
 *   <POSAdapter />
 * 
 * The active POS system is determined by the ACTIVE_POS_SYSTEM in posConfig.js
 */

import React, { lazy, Suspense } from 'react';
import { 
  ACTIVE_POS_SYSTEM, 
  POS_SYSTEMS, 
  getActivePOSConfig,
  getActivePOSName 
} from '../config/posConfig';

// Lazy load POS components for better performance
const EnhancedPOS = lazy(() => import('../components/POSSystemWrapper'));
const ClassicPOS = lazy(() => import('../components/SimplifiedPOS'));

// Nocturne POS will be loaded when available
// const NocturnePOS = lazy(() => import('../../NocturnePOS/Main'));

/**
 * Loading component displayed while POS system loads
 */
const POSLoading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '64px',
        height: '64px',
        border: '4px solid #334155',
        borderTop: '4px solid #6366F1',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
        Loading {getActivePOSName()}...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

/**
 * Error Fallback Component
 */
const POSError = ({ error, resetError }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    fontFamily: 'Inter, sans-serif',
    padding: '2rem'
  }}>
    <div style={{ 
      textAlign: 'center', 
      maxWidth: '600px',
      backgroundColor: '#1E293B',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 10px 15px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        backgroundColor: '#EF4444',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem'
      }}>⚠️</div>
      <h2 style={{ marginBottom: '1rem', color: '#EF4444' }}>POS System Error</h2>
      <p style={{ marginBottom: '1rem', color: '#94A3B8' }}>
        Failed to load {getActivePOSName()}
      </p>
      <details style={{ 
        textAlign: 'left', 
        backgroundColor: '#0F172A',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.875rem',
        fontFamily: 'monospace'
      }}>
        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem', color: '#F59E0B' }}>
          Error Details
        </summary>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          color: '#EF4444'
        }}>
          {error?.toString() || 'Unknown error'}
        </pre>
      </details>
      <button
        onClick={() => window.location.href = '/venue/home'}
        style={{
          backgroundColor: '#6366F1',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#4F46E5'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#6366F1'}
      >
        Return to Venue Home
      </button>
    </div>
  </div>
);

/**
 * Error Boundary for POS System
 */
class POSErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('POS System Error:', error, errorInfo);
    // You can log this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <POSError error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Main POS Adapter Component
 */
const POSAdapter = () => {
  const config = getActivePOSConfig();
  
  // Log active POS system for debugging
  console.log('Active POS System:', config.system);
  console.log('POS Configuration:', config);

  /**
   * Render the appropriate POS system based on configuration
   */
  const renderPOSSystem = () => {
    switch (ACTIVE_POS_SYSTEM) {
      case POS_SYSTEMS.ENHANCED:
        return <EnhancedPOS />;
      
      case POS_SYSTEMS.CLASSIC:
        return <ClassicPOS />;
      
      case POS_SYSTEMS.NOCTURNE:
        // Nocturne POS integration - will be implemented when repository is available
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            fontFamily: 'Inter, sans-serif',
            padding: '2rem'
          }}>
            <div style={{ 
              textAlign: 'center', 
              maxWidth: '600px',
              backgroundColor: '#1E293B',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 10px 15px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#F59E0B',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>🚧</div>
              <h2 style={{ marginBottom: '1rem' }}>Nocturne POS Coming Soon</h2>
              <p style={{ marginBottom: '1.5rem', color: '#94A3B8', lineHeight: 1.6 }}>
                The Nocturne POS system is not yet integrated. Please switch to Enhanced POS 
                or Classic POS in the configuration, or integrate the nocturne-pos repository 
                following the INTEGRATION_GUIDE.md instructions.
              </p>
              <div style={{ 
                backgroundColor: '#0F172A',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}>
                <p style={{ color: '#10B981', marginBottom: '0.5rem' }}>
                  <strong>To integrate Nocturne POS:</strong>
                </p>
                <ol style={{ color: '#94A3B8', paddingLeft: '1.5rem', margin: 0 }}>
                  <li>Clone the nocturne-pos repository</li>
                  <li>Copy files to src/frontend/pages/NocturnePOS/</li>
                  <li>Update imports in this adapter</li>
                  <li>Test and deploy</li>
                </ol>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => window.location.href = '/venue/home'}
                  style={{
                    backgroundColor: '#6366F1',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Return Home
                </button>
                <button
                  onClick={() => {
                    alert('Please update ACTIVE_POS_SYSTEM in src/frontend/pages/POS/config/posConfig.js to POS_SYSTEMS.ENHANCED');
                  }}
                  style={{
                    backgroundColor: '#334155',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Configuration Help
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <POSError 
            error={new Error(`Unknown POS system: ${ACTIVE_POS_SYSTEM}`)} 
          />
        );
    }
  };

  return (
    <POSErrorBoundary>
      <Suspense fallback={<POSLoading />}>
        {renderPOSSystem()}
      </Suspense>
    </POSErrorBoundary>
  );
};

export default POSAdapter;
