import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/odoo';

const odooApi = {
  async getProducts() {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      const response = await axios.post(`${BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

export default odooApi;