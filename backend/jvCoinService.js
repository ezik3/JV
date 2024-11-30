const xrpService = require('./xrpService');
const User = require('./models/user');
const stripeService = require('./stripeService');

class JVCoinService {
  async purchaseWithFiat(userId, amount, token) {
    try {
      // Process fiat payment through Stripe
      await stripeService.processPayment(amount, token);
      return this.mintJVCoins(userId, amount);
    } catch (error) {
      throw new Error('Fiat purchase failed: ' + error.message);
    }
  }

  async purchaseWithCrypto(userId, amount, cryptoType) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Get user's XRP address or create virtual wallet
      const userXRPAddress = user.xrpAddress || await this.getUserXRPAddress(userId);
      
      // Create JV Coins and send them to user
      const result = await xrpService.createJVCoin(userXRPAddress, amount);
      
      // Update user's JV Coin balance
      user.jvCoinBalance += amount;
      await user.save();

      return { success: true, transaction: result, newBalance: user.jvCoinBalance };
    } catch (error) {
      throw new Error('Crypto purchase failed: ' + error.message);
    }
  }

  async mintJVCoins(userId, amount) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const userXRPAddress = user.xrpAddress || await this.getUserXRPAddress(userId);
    const result = await xrpService.createJVCoin(userXRPAddress, amount);
    
    user.jvCoinBalance += amount;
    await user.save();

    return { success: true, transaction: result, newBalance: user.jvCoinBalance };
  }

  async getUserXRPAddress(userId) {
    // Implement virtual wallet creation logic here
    return 'rUserXRPAddressHere';
  }
}

module.exports = new JVCoinService();