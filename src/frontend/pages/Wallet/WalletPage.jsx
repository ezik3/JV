  import React, { useState } from 'react';
  import './styles/wallet.css';

  const WalletPage = () => {
    const [balance, setBalance] = useState({
      jvCoin: 0,
      nfts: []
    });

    return (
      <div className="wallet-container">
        <div className="wallet-header">
          <button className="wallet-button">Connect Wallet</button>
          <button className="wallet-button">Deposit</button>
          <button className="wallet-button">Withdraw</button>
        </div>
      
        <div className="wallet-content">
          <div className="balance-card">
            <h2>Your Balance</h2>
            <div className="balance-amount">{balance.jvCoin} JV</div>
          </div>

          <div className="nft-gallery">
            <h2>Your NFTs</h2>
            <div className="nft-grid">
              {balance.nfts.map(nft => (
                <div className="nft-card" key={nft.id}>
                  <img src={nft.image} alt={nft.name} />
                  <h3>{nft.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default WalletPage;