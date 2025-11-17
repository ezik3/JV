import React, { useState } from 'react';
import JVPaymentService from '../../../services/payments/JVPaymentService';
import '../styles/paymentModal.css';

const PaymentModal = ({ total, onClose, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cryptoType, setCryptoType] = useState('XRP');

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (paymentMethod === 'card') {
        await JVPaymentService.purchaseWithFiat(total);
      } else if (paymentMethod === 'crypto') {
        await JVPaymentService.purchaseWithCrypto(total, cryptoType);
      }
      onComplete();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <button className="close-modal" onClick={onClose}>×</button>
        
        <h2>Payment</h2>
        <div className="amount-display">
          <span>Total Amount</span>
          <span className="amount">${total.toFixed(2)}</span>
        </div>

        <div className="payment-methods">
          <button 
            className={`method-button ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            💳 Card
          </button>
          <button 
            className={`method-button ${paymentMethod === 'crypto' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('crypto')}
          >
            🪙 Crypto
          </button>
          <button 
            className={`method-button ${paymentMethod === 'jvcoin' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('jvcoin')}
          >
            🪙 JV Coin
          </button>
        </div>

        {paymentMethod === 'crypto' && (
          <select 
            value={cryptoType}
            onChange={(e) => setCryptoType(e.target.value)}
            className="crypto-select"
          >
            <option value="XRP">XRP</option>
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
          </select>
        )}

        <button 
          className="process-payment"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;