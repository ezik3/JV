  import React from 'react';
  import './WalletModal.css';

  const WalletModal = ({ onConnect, onClose }) => {
    return (
      <div className="wallet-modal-overlay">
        <div className="wallet-modal">
          <h2>Connect Your Wallet</h2>
          <button onClick={onClose}>Close</button>
          <button onClick={onConnect}>Connect Wallet</button>
        </div>
      </div>
    );
  };

  export default WalletModal;
