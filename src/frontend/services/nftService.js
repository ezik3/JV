
import api from '../api';

export const nftService = {
  async purchaseNFT(cityId, amount) {
    try {
      const response = await api.post('/api/nft/purchase', {
        cityId,
        amount,
        paymentMethod: 'VIBE' // Your stablecoin
      });
      return response.data;
    } catch (error) {
      throw new Error('NFT purchase failed');
    }
  },

  async getCityRevenue(cityId) {
    try {
      const response = await api.get(`/api/nft/revenue/${cityId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch city revenue');
    }
  }
};
