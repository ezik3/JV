import React, { useState, useEffect } from 'react';
import './AIWaiterCharacter.css';

const AIWaiterCharacter = ({ onClose, onOrder }) => {
  const [messages, setMessages] = useState([
    { text: "👋 Hello! I'm Vibe, your AI waiter. How can I assist you today?", sender: 'ai' }
  ]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = React.useRef(null);

  // Menu data
  const menuItems = {
    beers: [
      { name: 'IPA Craft Beer', price: 8, description: 'Hoppy and refreshing' },
      { name: 'Stout', price: 7, description: 'Dark and rich' },
      { name: 'Lager', price: 6, description: 'Crisp and clean' },
      { name: 'Wheat Beer', price: 7, description: 'Light and smooth' }
    ],
    cocktails: [
      { name: 'Mojito', price: 12, description: 'Rum, mint, and lime' },
      { name: 'Margarita', price: 11, description: 'Tequila based classic' }
    ],
    wines: [
      { name: 'House Red', price: 9, description: 'Medium-bodied red blend' },
      { name: 'White Wine', price: 9, description: 'Crisp Chardonnay' }
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;
    
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }]);
    
    // Simulate AI response with typing indicator
    setMessages(prev => [...prev, { text: "typing...", sender: 'ai', isTyping: true }]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setMessages(prev => [...prev, { 
        text: getAIResponse(userInput.toLowerCase()), 
        sender: 'ai' 
      }]);
    }, 1500);
    
    setUserInput('');
  };

  const getAIResponse = (input) => {
    input = input.toLowerCase();
    
    // Beer-related queries
    if (input.includes('beer')) {
      if (input.includes('craft') || input.includes('what') || input.includes('have')) {
        return `🍺 Here are our craft beers:\n\n${menuItems.beers.map(beer => 
          `• ${beer.name} - $${beer.price}\n  ${beer.description}`
        ).join('\n\n')}\n\nWould you like to order any of these?`;
      }
    }
    
    // Menu queries
    if (input.includes('menu')) {
      return "📋 Here's our full menu:\n\n" +
        "🍺 CRAFT BEERS\n" +
        menuItems.beers.map(b => `• ${b.name} - $${b.price}`).join('\n') +
        "\n\n🍸 COCKTAILS\n" +
        menuItems.cocktails.map(c => `• ${c.name} - $${c.price}`).join('\n') +
        "\n\n🍷 WINES\n" +
        menuItems.wines.map(w => `• ${w.name} - $${w.price}`).join('\n');
    }
    
    // Order queries
    if (input.includes('order')) {
      return "I'd be happy to take your order! What would you like? You can order by saying something like 'I'd like an IPA' or 'Can I get a Mojito?'";
    }

    // Specific drink orders
    const allItems = [...menuItems.beers, ...menuItems.cocktails, ...menuItems.wines];
    const orderedItem = allItems.find(item => 
      input.toLowerCase().includes(item.name.toLowerCase())
    );

    if (orderedItem) {
      return `Great choice! I'll add one ${orderedItem.name} ($${orderedItem.price}) to your order. Would you like anything else?`;
    }

    // Price queries
    if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
      return "I can help you with prices! Which item would you like to know about?";
    }

    // Default responses for unknown queries
    const defaultResponses = [
      "I can help you with our menu, prices, and taking orders. What would you like to know?",
      "Would you like to see our menu or place an order?",
      "I can tell you about our beers, cocktails, or wines. What interests you?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <div className="ai-waiter-wrapper">
      <div className="ai-waiter-container">
        <div className="chat-header">
          <div className="waiter-info">
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=vibe&backgroundColor=b6e3f4"
              alt="AI Waiter" 
              className="waiter-avatar"
            />
            <span>Vibe Assistant</span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender} ${msg.isTyping ? 'typing' : ''}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your request..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWaiterCharacter;