const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const xrpService = require('./xrpService');

class StripeService {
  async processPayment(amount, token, userId) {
    try {
      // Process payment through Stripe
      const charge = await stripe.charges.create({
        amount: amount * 100,
        currency: 'usd',
        source: token,
        description: 'JV Coin Purchase'
      });

      if (charge.status === 'succeeded') {
        // Mint equivalent JV Coins through XRP
        return await xrpService.createJVCoin(userId, amount);
      }
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }
}

module.exports = new StripeService();