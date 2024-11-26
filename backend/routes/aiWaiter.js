// backend/routes/aiWaiter.js
const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');
const Venue = require('../models/venue'); // Assuming you have a Venue model
const axios = require('axios');
const OpenAI = require("openai");
const Order = require('../models/order');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getChatGPTResponse(message, venueId) {
  try {
    // Fetch venue-specific information
    const venue = await Venue.findById(venueId);
    if (!venue) {
      throw new Error('Venue not found');
    }

    const menu = await Menu.findOne({ venueId: venueId });
    const menuString = menu ? JSON.stringify(menu.items) : 'Menu not available';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are an AI waiter for ${venue.name}. The venue ID is ${venueId}. Assist the customer with their order and questions about the menu. Here's the current menu: ${menuString}` },
        { role: "user", content: message }
      ]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return "I'm sorry, I'm having trouble processing your request right now. How else can I assist you?";
  }
}

// Helper function to process orders
async function processOrder(items, venueId, userId) {
  try {
    const menuItems = await Menu.find({ 
      venueId, 
      name: { $in: items.map(item => item.name) }
    });

    const total = menuItems.reduce((sum, item) => sum + item.price, 0);

    const order = new Order({
      venueId,
      userId,
      items: menuItems.map(item => ({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1 // You can enhance this to handle quantities
      })),
      total,
      status: 'pending'
    });

    await order.save();
    return order;
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

router.post('/conversation', async (req, res) => {
  try {
    const { message, venueId, userId } = req.body;
    const lowerMessage = message.toLowerCase();

    // First, get AI response
    const aiReply = await getChatGPTResponse(message, venueId);

    let response = {
      reply: aiReply,
      action: null,
      data: null
    };

    // Check for order intent
    if (lowerMessage.includes('order') || lowerMessage.includes('want') || lowerMessage.includes('get')) {
      // Extract items from message using AI
      const orderPrompt = `Extract the food/drink items from this message: "${message}"`;
      const orderCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Extract ordered items as a JSON array of item names" },
          { role: "user", content: orderPrompt }
        ]
      });

      const items = JSON.parse(orderCompletion.choices[0].message.content);
      if (items.length > 0) {
        const order = await processOrder(items, venueId, userId);
        response.action = 'orderCreated';
        response.data = order;
      }
    }

    // Check for payment intent
    if (lowerMessage.includes('pay') || lowerMessage.includes('bill')) {
      const activeOrder = await Order.findOne({
        venueId,
        userId,
        status: 'pending'
      }).sort({ createdAt: -1 });

      if (activeOrder) {
        response.action = 'showPayment';
        response.data = {
          orderId: activeOrder._id,
          total: activeOrder.total,
          items: activeOrder.items
        };
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Error in AI Waiter conversation:', error);
    res.status(500).json({ 
      error: 'Error processing request',
      details: error.message 
    });
  }
});

router.post('/upload-menu', async (req, res) => {
  try {
    const { venueId, menuData } = req.body;

    // Process the menuData (could be text from OCR or PDF parsing)
    const prompt = `Given the following menu data, please format it into a structured JSON format with categories, items, descriptions, and prices:\n\n${menuData}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that formats restaurant menus into structured JSON." },
        { role: "user", content: prompt }
      ]
    });

    const formattedMenu = JSON.parse(completion.choices[0].message.content);

    // Save the formatted menu to the database
    await Menu.findOneAndUpdate({ venueId }, { items: formattedMenu }, { upsert: true });

    res.json({ success: true, message: "Menu uploaded and processed successfully" });
  } catch (error) {
    console.error('Error uploading menu:', error);
    res.status(500).json({ error: 'Error uploading menu' });
  }
});

// Add new endpoint for JV Coin payment
router.post('/process-payment', async (req, res) => {
  try {
    const { orderId, userId, amount } = req.body;

    // Verify order exists and amount matches
    const order = await Order.findById(orderId);
    if (!order || order.total !== amount) {
      throw new Error('Invalid order or amount');
    }

    // Process JV Coin payment
    const payment = await processJVCoinPayment(userId, order.venueId, amount);

    // Update order status
    order.status = 'paid';
    order.paymentId = payment.id;
    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      order: order
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;