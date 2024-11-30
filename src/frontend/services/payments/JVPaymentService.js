  import api from '../../api';

  class JVPaymentService {
    constructor() {
      this.baseURL = 'http://localhost:5001'; // Match your backend port
    }

    async getBalance() {
      return api.get('/api/wallet/balance');
    }

    async purchaseWithFiat(amount) {
      return api.post('/api/jv-coin/purchase/fiat', { amount });
    }

    async purchaseWithCrypto(amount, cryptoType) {
      return api.post('/api/jv-coin/purchase/crypto', { amount, cryptoType });
    }

    async getExchangeRates() {
      return api.get('/api/jv-coin/rates');
    }
  }

  export default new JVPaymentService();
