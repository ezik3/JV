import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CreditCardForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const {error, token} = await stripe.createToken(cardElement);

    if (error) {
      console.log('[error]', error);
    } else {
      onSuccess(token.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
}

export default CreditCardForm;