const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const MenuItem = require('../models/menu');
const { authenticateJWT } = require('../utils/jwtUtils');

// Create POS order
router.post('/pos/create', authenticateJWT, async (req, res) => {
  try {
    const { customerName, items } = req.body;
    const venueId = req.user.venueId; // Get venueId from authenticated user

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      customerName,
      items,
      totalAmount,
      venueId,
      status: 'pending'
    });

    await order.save();
    req.io?.to(`venue_${venueId}`).emit('newOrder', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating POS order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get venue's orders
router.get('/pos/venue', authenticateJWT, async (req, res) => {
  try {
    const venueId = req.user.venueId;
    const orders = await Order.find({ venueId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/pos/:orderId/status', authenticateJWT, async (req, res) => {
  try {
    const { status } = req.body;
    const venueId = req.user.venueId;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, venueId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    req.io?.to(`venue_${venueId}`).emit('orderStatusUpdated', order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;