import React, { useState } from 'react';
import '../styles/paymentModal.css';

const PaymentModal = ({ total, onClose, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
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
            className={`method-button ${paymentMethod === 'jvcoin' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('jvcoin')}
          >
            🪙 JV Coin
          </button>
          <button 
            className={`method-button ${paymentMethod === 'cash' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            💵 Cash
          </button>
        </div>

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
