// backend/routes/pos.js
const express = require('express');
const router = express.Router();
const odooService = require('../services/odooService');

// Test connection
router.get('/test', async (req, res) => {
    try {
        await odooService.connect();
        res.json({ 
            status: 'success', 
            message: 'Connected to Odoo successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// Get products
router.get('/products', async (req, res) => {
    try {
        const products = await odooService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// Create order
router.post('/orders', async (req, res) => {
    try {
        const order = await odooService.createOrder(req.body);
        res.json(order);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

module.exports = router;