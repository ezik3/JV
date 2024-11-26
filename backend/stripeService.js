const stripe = require('stripe')('your_stripe_secret_key_here');

async function processPayment(amount, token) {
  try {
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      source: token,
      description: 'JV Coin Purchase'
    });
    return charge;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

module.exports = { processPayment };