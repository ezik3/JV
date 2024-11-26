const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu'); // Make sure this path matches your project structure

router.post('/conversation', async (req, res) => {
  try {
    const { message, venueId } = req.body;
    const lowerMessage = message.toLowerCase();

    // Basic response logic
    let reply = '';
    let action = null;

    if (lowerMessage.includes('menu')) {
      reply = "I'll show you our menu right away.";
      action = 'showMenu';
    }
    // Handle order-related queries
    else if (lowerMessage.includes('order') || lowerMessage.includes('like') || lowerMessage.includes('want')) {
      // Extract menu items from message and check availability
      const menuItems = await Menu.find({ venueId });
      const availableItems = menuItems.filter(item => 
        lowerMessage.includes(item.name.toLowerCase())
      );

      if (availableItems.length > 0) {
        reply = `I've added ${availableItems.map(item => item.name).join(', ')} to your order. Would you like anything else?`;
        action = 'addToOrder';
      } else {
        reply = "I'm not sure what you'd like to order. Would you like to see our menu?";
      }
    }
    // Handle payment queries
    else if (lowerMessage.includes('pay') || lowerMessage.includes('bill')) {
      reply = "I'll help you with the payment. You can see your current order and total on the right side of the screen. Click 'Pay Now' when you're ready to proceed.";
      action = 'showPayment';
    }
    // Default response
    else {
      reply = "How can I help you? You can ask to see our menu, place an order, or request the bill.";
    }

    res.json({ reply, action });

  } catch (error) {
    console.error('AI Waiter Error:', error);
    res.status(500).json({
      reply: "I'm having trouble processing your request. Please try again."
    });
  }
});

module.exports = router; 