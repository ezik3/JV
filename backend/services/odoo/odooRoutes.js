// backend/routes/odoo/odooRoutes.js
const express = require('express');
const router = express.Router();
const odooService = require('../../services/odoo/odooService');

// Test connection
router.get('/test', async (req, res) => {
  try {
    const session = await odooService.authenticate();
    res.json({
      status: 'success',
      message: 'Connected to Odoo successfully',
      sessionId: session.session_id
    });
  } catch (error) {
    console.error('Odoo test connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Odoo',
      error: error.message
    });
  }
});

// Get products
router.get('/products', async (req, res) => {
  try {
    const products = await odooService.getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to fetch products from Odoo'
    });
  }
});

module.exports = router;