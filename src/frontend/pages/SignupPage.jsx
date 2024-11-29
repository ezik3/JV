import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { xrpService } from '../services/xrpService';
import './SignupPage.css';
import WalletModal from '../components/WalletModal';
import walletService from '../services/walletService';

const SignupPage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    // Sample data - replace with your API call
    const fetchCities = async () => {
      const citiesData = [
        {
          id: 1,
          name: 'New York',
          price: '5000 JVC',
          image: 'https://source.unsplash.com/random/800x600/?newyork',
          currentBid: '4500 JVC',
          timeLeft: '2d 5h',
          description: 'Own a piece of the Big Apple\'s advertising revenue',
          revenueLastMonth: '500 JVC'
        },
        // Add more cities
      ];
      setCities(citiesData);
      setLoading(false);
    };

    fetchCities();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const address = await walletService.connect();
      setWalletAddress(address);
      setWalletConnected(true);
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleNFTPurchase = async (city) => {
    if (!walletConnected) {
      setShowWalletModal(true);
      return;
    }

    try {
      const result = await walletService.purchaseNFT(city.id, city.price);
      if (result.success) {
        // Show success notification
        alert('NFT purchased successfully!');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to purchase NFT. Please try again.');
    }
  };

  return (
    <div className="nft-marketplace-container">
      <div className="marketplace-header">
        <div className="header-content">
          <h1>City NFT Marketplace</h1>
          <p>Own the Future of Urban Advertising</p>
          <div className="auth-buttons">
            <Link to="/registration-choice" className="signup-btn">Sign Up</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      </div>

      <div className="marketplace-grid">
        {cities.map(city => (
          <div key={city.id} className="nft-card">
            <div className="nft-image-container">
              <img src={city.image} alt={city.name} />
              <div className="time-left">{city.timeLeft}</div>
            </div>
            <div className="nft-info">
              <h3>{city.name}</h3>
              <div className="price-info">
                <div className="current-price">
                  <span>Price</span>
                  <h4>{city.price}</h4>
                </div>
                <div className="current-bid">
                  <span>Current Bid</span>
                  <h4>{city.currentBid}</h4>
                </div>
              </div>
              <div className="revenue-info">
                <span>Revenue Last Month</span>
                <h4>{city.revenueLastMonth}</h4>
              </div>
              <p className="description">{city.description}</p>
              <button 
                className="purchase-btn"
                onClick={() => handleNFTPurchase(city)}
              >
                Purchase NFT
              </button>
            </div>
          </div>
        ))}
      </div>
      {showWalletModal && (
        <WalletModal 
          onConnect={handleConnectWallet}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
};

export default SignupPage;