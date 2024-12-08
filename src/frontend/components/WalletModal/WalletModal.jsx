
import React, { useState } from 'react';
import './WalletModal.css';

const WalletModal = ({ onClose, balance, nfts }) => {
  return (
    <div className="wallet-modal-overlay">
      <div className="wallet-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="wallet-content">
          <div className="balance-section">
            <h2>Your Balance</h2>
            <div className="balance-amount">{balance} JV</div>
          </div>

          <div className="nft-section">
            <h2>Your NFTs</h2>
            <div className="nft-grid">
              {nfts.map(nft => (
                <div key={nft.id} className="nft-card">
                  <img src={nft.image} alt={nft.name} />
                  <h3>{nft.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
