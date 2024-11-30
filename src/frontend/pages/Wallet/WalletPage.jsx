
import React, { useState, useEffect } from 'react';
import WalletConnect from '../../components/WalletConnect';
import JVPaymentService from '../../services/payments/JVPaymentService';
import './styles/wallet.css';

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [connected, setConnected] = useState(false);

  const handleConnect = async (wallet) => {
    setConnected(true);
    // Fetch balance
    const response = await JVPaymentService.getBalance();
    setBalance(response.data.balance);
  };

  return (
    <div className="wallet-page">
      <h2>Your Wallet</h2>
      {!connected ? (
        <WalletConnect onConnect={handleConnect} />
      ) : (
        <div className="wallet-info">
          <h3>Balance: {balance} JV</h3>
          <button onClick={() => JVPaymentService.purchaseWithFiat(100)}>
            Add 100 JV with Card
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
