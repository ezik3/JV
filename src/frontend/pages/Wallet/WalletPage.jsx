  import React, { useState, useEffect } from 'react';
  import WalletConnect from '../../components/WalletConnect';
  import JVPaymentService from '../../services/payments/JVPaymentService';
  import './styles/wallet.css';

  const WalletPage = () => {
    const [balance, setBalance] = useState(0);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const handleConnect = async (wallet) => {
      try {
        setConnected(true);
        const response = await JVPaymentService.getBalance();
        setBalance(response.data.balance);
      } catch (err) {
        setError('Failed to connect wallet');
        console.error('Wallet connection error:', err);
      }
    };

    return (
      <div className="wallet-container">
        <div className="wallet-content">
          <h1>Wallet Dashboard</h1>
          {error && <div className="error-message">{error}</div>}
          {!connected ? (
            <WalletConnect onConnect={handleConnect} />
          ) : (
            <div className="wallet-info">
              <h3>Your Balance: {balance} JV</h3>
              <button 
                className="purchase-button"
                onClick={() => JVPaymentService.purchaseWithFiat(100)}
              >
                Add 100 JV with Card
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default WalletPage;
