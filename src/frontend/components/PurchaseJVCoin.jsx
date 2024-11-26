import React, { useState } from 'react';
import api from '../api';

const PurchaseJVCoin = ({ userId, onPurchase }) => {
  const [amount, setAmount] = useState(0);

  const handlePurchase = async () => {
    if (amount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      const response = await api.post('/api/jv-coin/purchase', { userId, amount });
      if (response.data.success) {
        alert(`Successfully purchased ${amount} JV Coins!`);
        onPurchase(response.data.newBalance);
        setAmount(0); // Reset the input after successful purchase
      }
    } catch (error) {
      console.error('Error purchasing JV Coins:', error);
      alert('Failed to purchase JV Coins. Please try again.');
    }
  };

  return (
    <div className="purchase-jv-coin">
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(Number(e.target.value))} 
        min="0"
        placeholder="Enter amount"
      />
      <button onClick={handlePurchase} disabled={amount <= 0}>
        Purchase JV Coins
      </button>
    </div>
  );
};

export default PurchaseJVCoin;