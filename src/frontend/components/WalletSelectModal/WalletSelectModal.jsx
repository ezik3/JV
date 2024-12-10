
import React from 'react';
import './WalletSelectModal.css';

const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg'
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: 'https://trustwallet.com/assets/images/media/assets/TWT.svg'
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: 'https://static.okx.com/cdn/assets/imgs/221/C26AD1C8621EAC37.png'
  },
  {
    id: 'binance',
    name: 'Binance Wallet',
    icon: 'https://www.binance.com/static/logo-BNB.svg'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'https://www.coinbase.com/img/coinbase-logo.svg'
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'https://walletconnect.com/images/logo.svg'
  }
];

const WalletSelectModal = ({ onClose, onSelectWallet }) => {
  return (
    <div className="wallet-select-overlay" onClick={onClose}>
      <div className="wallet-select-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Connect Your Wallet</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <p className="modal-description">
          Choose your preferred wallet to connect with our platform
        </p>

        <div className="wallet-grid">
          {WALLET_OPTIONS.map(wallet => (
            <div 
              key={wallet.id}
              className="wallet-option"
              onClick={() => onSelectWallet(wallet.id)}
            >
              <div className="wallet-icon-container">
                <img src={wallet.icon} alt={`${wallet.name} icon`} className="wallet-icon" />
              </div>
              <span className="wallet-name">{wallet.name}</span>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <p className="security-note">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletSelectModal;
