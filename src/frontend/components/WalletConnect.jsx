
import React, { useState } from 'react';
import walletService from '../services/walletService';

const WalletConnect = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async (walletType) => {
    setConnecting(true);
    try {
      let wallet;
      switch (walletType) {
        case 'metamask':
          wallet = await window.ethereum.request({ method: 'eth_requestAccounts' });
          break;
        case 'binance':
          wallet = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
          break;
        default:
          wallet = await walletService.connect();
      }
      onConnect(wallet);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="wallet-connect">
      <button onClick={() => connectWallet('metamask')}>Connect MetaMask</button>
      <button onClick={() => connectWallet('binance')}>Connect Binance Wallet</button>
      <button onClick={() => connectWallet('crypto.com')}>Connect Crypto.com</button>
    </div>
  );
};

export default WalletConnect;
