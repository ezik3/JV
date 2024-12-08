
import api from '../api';

const purchaseService = {
  async purchaseNFT(userId, nftId) {
    const response = await api.post('/api/nft/purchase', { userId, nftId });
    return response.data;
  },

  async purchaseJVCoin(userId, amount) {
    const response = await api.post('/api/jv-coin/purchase', { userId, amount });
    return response.data;
  }
};

export default purchaseService;
