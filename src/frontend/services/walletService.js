  import { Client, Wallet } from 'xrpl';

  class WalletService {
    constructor() {
      this.client = null;
      this.wallet = null;
    }

    async connect() {
      try {
        this.client = new Client('wss://s.altnet.rippletest.net:51233');
        await this.client.connect();
     
        // For testing, generate a new wallet
        this.wallet = Wallet.generate();
        return this.wallet.address;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    }

    async purchaseNFT(cityId, price) {
      if (!this.wallet) {
        throw new Error('Wallet not connected');
      }

      const response = await fetch('/api/nft/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityId,
          amount: price,
          userWalletAddress: this.wallet.address
        })
      });

      return response.json();
    }
  }

  export default new WalletService();
