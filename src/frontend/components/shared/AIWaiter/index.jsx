// src/frontend/components/shared/AIWaiter/index.jsx
import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const AIWaiter = ({ 
  venueId,
  venueName,
  mode = 'customer',
  onOrderRequest 
}) => {
  // State for managing different waiter types
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentOrder, setCurrentOrder] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef(null);

  // Waiter types
  const waiterTypes = [
    { id: 'ai', name: 'AI Assistant', icon: '🤖' },
    { id: 'human', name: 'Call Waiter', icon: '👤' },
    { id: 'order', name: 'Start Ordering', icon: '🍽️' }
  ];

  // Initial welcome message when waiter is selected
  useEffect(() => {
    if (selectedWaiter) {
      setMessages([{
        text: `Hello! I'm your ${selectedWaiter.name} at ${venueName}. How can I help you today?`,
        sender: 'ai'
      }]);
    }
  }, [selectedWaiter, venueName]);

  const handleMenuItemDetection = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Example menu items (replace with your actual menu items)
    const menuItems = [
      { name: 'pizza', price: 15.99 },
      { name: 'coke', price: 3.99 },
      // Add more menu items
    ];

    menuItems.forEach(item => {
      if (lowerMessage.includes(item.name.toLowerCase())) {
        // Check if item already exists in order
        const existingItemIndex = currentOrder.findIndex(
          orderItem => orderItem.name.toLowerCase() === item.name.toLowerCase()
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updateQuantity(existingItemIndex, 1);
        } else {
          // Add new item to order
          setCurrentOrder(prev => [...prev, { ...item, quantity: 1 }]);
        }
      }
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      // First, try to get the venue's menu
      if (inputText.toLowerCase().includes('menu')) {
        const menuResponse = await fetch(`/api/menu/items?venueId=${venueId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!menuResponse.ok) throw new Error('Failed to fetch menu');
        
        const menuData = await menuResponse.json();
        
        // Extract items from response (API returns { items: [...] })
        const items = menuData.items || menuData;
        
        // Format menu items for display
        const menuText = formatMenuResponse(items);
        setMessages(prev => [...prev, {
          text: menuText,
          sender: 'ai'
        }]);
        
        // Update the order section with available menu items
        setCurrentOrder(items.map(item => ({
          ...item,
          quantity: 0
        })));
      } else {
        // Handle other types of messages through AI waiter endpoint
        const response = await fetch('/api/ai-waiter/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            message: inputText,
            venueId: venueId
          }),
        });

        if (!response.ok) throw new Error('Failed to get AI response');
        
        const data = await response.json();
        setMessages(prev => [...prev, {
          text: data.reply,
          sender: 'ai'
        }]);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, {
        text: "I'm having trouble connecting. Please try again.",
        sender: 'ai'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to format menu response
  const formatMenuResponse = (menuData) => {
    if (!menuData || menuData.length === 0) {
      return "I'm sorry, but I couldn't find any menu items for this venue.";
    }

    // Group items by category
    const categorizedMenu = menuData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    // Format the menu text
    let menuText = "Here's our current menu:\n\n";
    
    Object.entries(categorizedMenu).forEach(([category, items]) => {
      menuText += `${category}:\n`;
      items.forEach(item => {
        menuText += `• ${item.name} - $${item.price.toFixed(2)}\n`;
        if (item.description) menuText += `  ${item.description}\n`;
      });
      menuText += '\n';
    });

    menuText += "\nYou can order any item by telling me what you'd like!";
    return menuText;
  };

  const callHumanWaiter = async () => {
    try {
      await fetch('/api/call-waiter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId }),
      });
      
      setMessages(prev => [...prev, { 
        text: 'A waiter has been notified and will be with you shortly!',
        sender: 'ai'
      }]);
    } catch (error) {
      console.error('Error calling waiter:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I could not reach the waiter. Please try again.',
        sender: 'ai'
      }]);
    }
  };

  const submitOrder = () => {
    if (currentOrder.length > 0) {
      onOrderRequest(currentOrder);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/orders/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          venueId,
          items: currentOrder,
          totalAmount: currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          orderType: 'ai_waiter'
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          text: "Order placed successfully! A waiter will bring your items shortly.",
          sender: 'ai'
        }]);
        setCurrentOrder([]);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error placing your order. Please try again.",
        sender: 'ai'
      }]);
    }
  };

  const handleMenuRequest = async () => {
    try {
      const response = await fetch(`/api/menu/items?venueId=${venueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch menu');
      
      const menuData = await response.json();
      const items = menuData.items || menuData;
      const menuText = formatMenuResponse(items);
      setMessages(prev => [...prev, {
        text: menuText,
        sender: 'ai'
      }]);
      
      // Update available items for ordering
      setCurrentOrder(items.map(item => ({
        ...item,
        quantity: 0
      })));
    } catch (error) {
      console.error('Menu fetch error:', error);
      setMessages(prev => [...prev, {
        text: "I'm having trouble accessing the menu right now.",
        sender: 'ai'
      }]);
    }
  };

  // Add this function to handle JV Coin payments
  const handlePayment = async (total) => {
    try {
      const response = await fetch('/api/jv-coin/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: total,
          venueId: venueId,
          items: currentOrder
        })
      });

      if (!response.ok) throw new Error('Payment failed');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  return (
    <div className="ai-waiter-container">
      {!selectedWaiter ? (
        // Waiter selection screen
        <div className="waiter-selection">
          <h2>Select Your Waiter</h2>
          <div className="waiter-options">
            {waiterTypes.map(waiter => (
              <button
                key={waiter.id}
                className="waiter-option"
                onClick={() => setSelectedWaiter(waiter)}
              >
                <span className="waiter-icon">{waiter.icon}</span>
                <span className="waiter-name">{waiter.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Main interaction screen
        <div className="interaction-layout">
          {/* Left side - Chat interface */}
          <div className="chat-section">
            <div className="chat-header">
              <span className="waiter-icon">{selectedWaiter.icon}</span>
              <span>{selectedWaiter.name}</span>
              <button 
                className="change-waiter"
                onClick={() => setSelectedWaiter(null)}
              >
                Change Waiter
              </button>
            </div>

            <div className="chat-messages" ref={chatRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isProcessing}
              />
              <button type="submit" disabled={isProcessing}>
                Send
              </button>
            </form>
          </div>

          {/* Right side - Live Order Updates */}
          <div className="order-section">
            <h3>Current Order</h3>
            <div className="order-items-container">
              {currentOrder.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(idx, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(idx, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            
            {currentOrder.length > 0 && (
              <div className="order-summary">
                <div className="order-total">
                  <span>Total:</span>
                  <span>
                    ${currentOrder.reduce((sum, item) => 
                      sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <button 
                  className="checkout-button"
                  onClick={handleCheckout}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWaiter;