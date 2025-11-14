/**
 * POS Adapter Component
 * Intelligent adapter that switches between different POS systems with automatic fallback
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  ACTIVE_POS_SYSTEM,
  POS_SYSTEMS,
  POS_CONFIG,
  FEATURES,
  getNextFallback
} from '../config/posConfig';

// Loading component
const POSLoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{ marginBottom: '20px', fontSize: '48px' }}>
      <div style={{
        border: '4px solid rgba(255,255,255,0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
    <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Loading POS System...</h2>
    <p style={{ opacity: 0.8, marginTop: '10px' }}>Initializing your venue's point of sale</p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Error boundary component
class POSErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    if (FEATURES.logSystemErrors) {
      console.error(`[POS Adapter] Error in ${this.props.systemName}:`, error, errorInfo);
    }

    // Trigger fallback if enabled
    if (FEATURES.enableFallback && this.props.onError) {
      this.props.onError(this.props.systemKey);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          maxWidth: '600px',
          margin: '100px auto',
          background: '#fee',
          border: '2px solid #fcc',
          borderRadius: '8px',
          fontFamily: 'system-ui'
        }}>
          <h2 style={{ color: '#c33', marginBottom: '16px' }}>
            ⚠️ POS System Error
          </h2>
          <p style={{ marginBottom: '12px' }}>
            The <strong>{this.props.systemName}</strong> failed to load.
          </p>
          {this.props.fallbackSystem && (
            <p style={{ marginBottom: '16px', color: '#666' }}>
              Attempting to switch to <strong>{POS_CONFIG[this.props.fallbackSystem]?.name}</strong>...
            </p>
          )}
          <details style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Technical Details</summary>
            <pre style={{
              marginTop: '12px',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          {!this.props.fallbackSystem && (
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Reload Page
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load POS components
const LazyEnhancedPOS = lazy(() => import('../pages/POS/POSInterface'));
const LazyNocturnePOS = lazy(() => import('../pages/NocturnePOS/NocturneInterface'));
const LazyClassicPOS = lazy(() => import('../pages/JointVibePOS/POSMain'));

const POSAdapter = ({ venueId, userId, ...otherProps }) => {
  const [currentSystem, setCurrentSystem] = useState(ACTIVE_POS_SYSTEM);
  const [failedSystems, setFailedSystems] = useState([]);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  // Handle POS system errors and trigger fallback
  const handlePOSError = (failedSystem) => {
    if (!FEATURES.enableFallback) {
      console.error(`[POS Adapter] ${failedSystem} failed but fallback is disabled`);
      return;
    }

    // Mark system as failed
    setFailedSystems(prev => [...prev, failedSystem]);

    // Get next fallback
    const nextSystem = getNextFallback(failedSystem);

    if (nextSystem && !failedSystems.includes(nextSystem)) {
      console.warn(`[POS Adapter] Switching from ${failedSystem} to ${nextSystem}`);
      setCurrentSystem(nextSystem);
      setAttemptedFallback(true);
    } else {
      console.error('[POS Adapter] No more fallback systems available');
    }
  };

  // Get the appropriate component based on current system
  const getPOSComponent = () => {
    const config = POS_CONFIG[currentSystem];

    if (!config || !config.enabled) {
      console.error(`[POS Adapter] Invalid or disabled POS system: ${currentSystem}`);
      return null;
    }

    switch (currentSystem) {
      case POS_SYSTEMS.ENHANCED:
        return <LazyEnhancedPOS venueId={venueId} userId={userId} {...otherProps} />;

      case POS_SYSTEMS.NOCTURNE:
        return <LazyNocturnePOS venueId={venueId} userId={userId} {...otherProps} />;

      case POS_SYSTEMS.CLASSIC:
        return <LazyClassicPOS venueId={venueId} userId={userId} {...otherProps} />;

      default:
        return null;
    }
  };

  const POSComponent = getPOSComponent();
  const config = POS_CONFIG[currentSystem];
  const nextFallback = getNextFallback(currentSystem);

  // Log system info
  useEffect(() => {
    console.log(`[POS Adapter] Active System: ${config?.name || currentSystem}`);
    console.log(`[POS Adapter] Fallback Enabled: ${FEATURES.enableFallback}`);
    if (attemptedFallback) {
      console.log(`[POS Adapter] Fallback activated to: ${config?.name}`);
    }
  }, [currentSystem, config, attemptedFallback]);

  if (!POSComponent) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>POS System Configuration Error</h2>
        <p>The selected POS system ({currentSystem}) is not available.</p>
      </div>
    );
  }

  return (
    <div className="pos-adapter-wrapper">
      {/* Optional: Show which system is active (for debugging) */}
      {FEATURES.showSystemSelector && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#333',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          🖥️ <strong>{config?.name}</strong>
          {attemptedFallback && <span style={{ color: '#ff6b6b' }}> (Fallback)</span>}
        </div>
      )}

      {/* POS Component with Error Boundary */}
      <POSErrorBoundary
        systemName={config?.name}
        systemKey={currentSystem}
        fallbackSystem={nextFallback}
        onError={handlePOSError}
      >
        <Suspense fallback={<POSLoadingScreen />}>
          {POSComponent}
        </Suspense>
      </POSErrorBoundary>
    </div>
  );
};

export default POSAdapter;
