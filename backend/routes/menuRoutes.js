// src/backend/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menu');
const { authenticateJWT } = require('../utils/jwtUtils');

// Get menu items
router.get('/items', async (req, res) => {
  try {
    const { venueId } = req.query;
    const menuItems = await MenuItem.find({ venueId });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Add menu item
router.post('/items', async (req, res) => {
  try {
    const { name, description, price, category, venueId, available } = req.body;
    
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      venueId,
      available: available || true
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

module.exports = router;