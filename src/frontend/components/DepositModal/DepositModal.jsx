
import React, { useState } from 'react';
import './DepositModal.css';

const PAYMENT_METHODS = [
  {
    id: 'visa',
    name: '**** 0068',
    expiry: 'Exp 07/26',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png'
  },
  {
    id: 'mastercard1',
    name: '**** 8052',
    expiry: 'Exp 05/25',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png'
  },
  {
    id: 'payid',
    name: 'PayID',
    isNew: true,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    isNew: true,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  }
];

const QUICK_AMOUNTS = [10, 25, 50, 100, 500];

const DepositModal = ({ onClose, onDeposit }) => {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [amount, setAmount] = useState('');
  const [cvv, setCvv] = useState('');

  const handleQuickAmount = (value) => {
    setAmount((prev) => (Number(prev) + value).toString());
  };

  const handleDeposit = () => {
    if (!amount || !cvv) {
      alert('Please fill in all fields');
      return;
    }
    onDeposit({ amount: Number(amount), method: selectedMethod, cvv });
    onClose();
  };

  return (
    <div className="deposit-modal-overlay" onClick={onClose}>
      <div className="deposit-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <h2>Select Deposit Method</h2>
        
        <div className="payment-methods">
          {PAYMENT_METHODS.map((method) => (
            <div 
              key={method.id}
              className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <img src={method.icon} alt={method.name} />
              <div className="method-info">
                <span className="method-name">{method.name}</span>
                {method.expiry && <span className="method-expiry">{method.expiry}</span>}
                {method.isNew && <span className="new-tag">NEW</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="deposit-form">
          <h3>Enter Deposit Amount</h3>
          
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="amount-input"
          />

          <div className="quick-amounts">
            {QUICK_AMOUNTS.map((value) => (
              <button 
                key={value}
                onClick={() => handleQuickAmount(value)}
                className="quick-amount-btn"
              >
                +${value}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
            placeholder="CVV"
            maxLength="3"
            className="cvv-input"
          />

          <button 
            className="deposit-button"
            onClick={handleDeposit}
          >
            Deposit ${amount || '0'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
