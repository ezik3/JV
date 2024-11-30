  import { Client, Wallet } from 'xrpl';
  import api from '../api';

  class WalletService {
    constructor() {
      this.client = null;
      this.wallet = null;
      this.virtualWallet = null;
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

    async initializeVirtualWallet() {
      const response = await api.post('/api/wallet/initialize');
      this.virtualWallet = response.data;
      return this.virtualWallet;
    }

    async getBalance() {
      return api.get('/api/wallet/balance');
    }

    async purchaseNFT(cityId, price) {
      if (!this.virtualWallet) {
        await this.initializeVirtualWallet();
      }

      const response = await api.post('/api/nft/purchase', {
        cityId,
        amount: price,
        walletId: this.virtualWallet.id
      });

      return response.data;
    }
  }

  export default new WalletService();