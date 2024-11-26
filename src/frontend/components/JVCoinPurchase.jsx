import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CreditCardForm from './CreditCardForm';
import api from '../api';

const stripePromise = loadStripe('pk_live_51Q8xTUD3X1DsmKWLZRtyR2aJNSPfCn93QCxbKctKrHimvi8nXlN32b6tmILXX62R4OBqdbx74Ws46smQrwiBWuiJ000fNuXryt');

function JVCoinPurchase({ userId, onPurchase }) {
  const [amount, setAmount] = useState(0);

  const handlePurchase = async (token) => {
    try {
      const response = await api.post('/api/jv-coin/purchase', { userId, amount, token });
      if (response.data.success) {
        alert(`Successfully purchased ${amount} JV Coins!`);
        onPurchase(response.data.newBalance);
      }
    } catch (error) {
      alert('Failed to purchase JV Coins. Please try again.');
    }
  };

  return (
    <div>
      <h2>Purchase JV Coins</h2>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(Number(e.target.value))} 
        min="0"
      />
      <Elements stripe={stripePromise}>
        <CreditCardForm amount={amount} onSuccess={handlePurchase} />
      </Elements>
    </div>
  );
}

export default JVCoinPurchase;