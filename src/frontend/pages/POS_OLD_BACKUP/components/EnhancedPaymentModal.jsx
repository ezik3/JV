import React, { useState } from 'react';
import { 
  CreditCard, Wallet, DollarSign, X, Check,
  Smartphone, Bitcoin, TrendingUp
} from 'lucide-react';
import '../styles/enhancedPaymentModal.css';

// Configuration constants
const VIBE_TO_USD_RATE = 0.85; // Should be fetched from API in production
const DEFAULT_VIBE_BALANCE = 1250; // Should be fetched from user account

const EnhancedPaymentModal = ({ total, items, onClose, onComplete, vibeBalance = DEFAULT_VIBE_BALANCE }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cryptoType, setCryptoType] = useState('XRP');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, theme: 'theme-primary' },
    { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin, theme: 'theme-crypto' },
    { id: 'vibe', name: 'VIBE Token', icon: TrendingUp, theme: 'theme-vibe' },
    { id: 'mobile', name: 'Mobile Wallet', icon: Smartphone, theme: 'theme-mobile' },
  ];

  const cryptoOptions = [
    { value: 'XRP', name: 'XRP (Ripple)', icon: '💎' },
    { value: 'BTC', name: 'Bitcoin', icon: '₿' },
    { value: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="enhanced-payment-modal success-modal" onClick={e => e.stopPropagation()}>
          <div className="success-content">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h2>Payment Successful!</h2>
            <p className="success-amount">${total.toFixed(2)}</p>
            <p className="success-message">Thank you for your payment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="enhanced-payment-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>Payment</h2>
          <div className="order-summary-badge">
            <span className="item-count">{items?.length || 0} items</span>
          </div>
        </div>

        <div className="amount-section">
          <span className="amount-label">Total Amount</span>
          <span className="amount-value">${total.toFixed(2)}</span>
        </div>

        <div className="payment-method-grid">
          {paymentMethods.map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                className={`payment-method-card ${method.theme} ${paymentMethod === method.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="method-icon">
                  <Icon size={24} />
                </div>
                <span className="method-name">{method.name}</span>
                {paymentMethod === method.id && (
                  <div className="active-indicator">
                    <Check size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {paymentMethod === 'crypto' && (
          <div className="crypto-selector">
            <label className="crypto-label">Select Cryptocurrency</label>
            <div className="crypto-options">
              {cryptoOptions.map(crypto => (
                <button
                  key={crypto.value}
                  className={`crypto-option ${cryptoType === crypto.value ? 'active' : ''}`}
                  onClick={() => setCryptoType(crypto.value)}
                >
                  <span className="crypto-icon">{crypto.icon}</span>
                  <span className="crypto-name">{crypto.name}</span>
                  {cryptoType === crypto.value && (
                    <Check size={16} className="crypto-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="card-details-form">
            <div className="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                className="form-input"
                maxLength="19"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="form-input"
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="form-input"
                  maxLength="4"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'vibe' && (
          <div className="vibe-info">
            <div className="vibe-balance">
              <Wallet size={20} />
              <div>
                <span className="balance-label">Available Balance</span>
                <span className="balance-value">{vibeBalance} VIBE</span>
              </div>
            </div>
            <div className="conversion-info">
              <span>≈ ${(vibeBalance * VIBE_TO_USD_RATE).toFixed(2)} USD</span>
            </div>
          </div>
        )}

        <div className="payment-actions">
          <button
            className="pay-button"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <DollarSign size={20} />
                Complete Payment ${total.toFixed(2)}
              </>
            )}
          </button>
          <button className="cancel-button" onClick={onClose} disabled={processing}>
            Cancel
          </button>
        </div>

        <div className="payment-security">
          <div className="security-badge">
            🔒 Secure Payment
          </div>
          <span className="security-text">Your payment information is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPaymentModal;
