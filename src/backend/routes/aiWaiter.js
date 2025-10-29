export const handleAIChat = async (req, res, context) => {
  try {
    const { message, venueId } = req.body;
    const lowerMessage = message.toLowerCase();

    let reply = '';
    let action = null;

    if (lowerMessage.includes('menu')) {
      reply = "I'll show you our menu right away.";
      action = 'showMenu';
    }
    else if (lowerMessage.includes('order') || lowerMessage.includes('like') || lowerMessage.includes('want')) {
      reply = "I'd love to help you order! What would you like?";
      action = 'addToOrder';
    }
    else if (lowerMessage.includes('pay') || lowerMessage.includes('bill')) {
      reply = "I'll help you with the payment. You can see your current order and total on the right side of the screen.";
      action = 'showPayment';
    }
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
}; 