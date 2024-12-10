  import React, { useState } from 'react';
  import './NFTPurchaseModal.css';
  import WalletSelectModal from './WalletSelectModal/WalletSelectModal';
  import DepositModal from './DepositModal/DepositModal';

  const NFTPurchaseModal = ({ onClose, onPurchase }) => {
    const [step, setStep] = useState(1);
    const [showWalletSelect, setShowWalletSelect] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [credentials, setCredentials] = useState({
      email: '',
      password: ''
    });

    const handleLogin = (e) => {
      e.preventDefault();
      setStep(2);
    };

    const handleWalletSelect = (walletId) => {
      console.log(`Selected wallet: ${walletId}`);
      setShowWalletSelect(false);
      onPurchase('crypto');
    };

    const handleDeposit = (depositDetails) => {
      console.log('Processing deposit:', depositDetails);
      // Here you would handle the deposit logic
      onPurchase('deposit');
    };

    return (
      <div className="modal-overlay">
        <div className="purchase-modal">
          <button className="close-modal" onClick={onClose}>×</button>
        
          {step === 1 ? (
            <>
              <h2>Enter Login Details</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
                <button type="submit">Continue</button>
              </form>
            </>
          ) : (
            <>
              <h2>Select Payment Method</h2>
              <div className="payment-options">
                <button onClick={() => setShowWalletSelect(true)}>
                  Connect Your Crypto Wallet
                </button>
                <button onClick={() => setShowDepositModal(true)}>
                  Deposit Funds
                </button>
              </div>
            </>
          )}
        </div>

        {showWalletSelect && (
          <WalletSelectModal
            onClose={() => setShowWalletSelect(false)}
            onSelectWallet={handleWalletSelect}
          />
        )}

        {showDepositModal && (
          <DepositModal
            onClose={() => setShowDepositModal(false)}
            onDeposit={handleDeposit}
          />
        )}
      </div>
    );
  };

  export default NFTPurchaseModal;