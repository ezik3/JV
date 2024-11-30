
import api from '../../api';

class JVPaymentService {
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
