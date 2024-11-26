import React, { useState } from 'react';
import './Messages.css';

const messagesData = [
  {
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'DJ Spark',
    preview: 'Hey, about that collab...',
    messages: [
      { type: 'received', text: 'Hey Sarah! I loved your set at Club Neon last weekend. The energy was insane!' },
      { type: 'sent', text: 'Thanks, Spark! I had a blast spinning there. The crowd was amazing!' },
      { type: 'received', text: 'I was thinking, how about we do a b2b set sometime? Our styles would mesh really well.' },
      { type: 'sent', text: 'That sounds awesome! I\'d be totally down for a collab. When were you thinking?' },
      { type: 'received', text: 'How about next month at the Electro Fest? I heard they\'re looking for unique acts.' },
      { type: 'sent', text: 'Electro Fest would be perfect! Let\'s start working on a demo mix to pitch to them.' },
    ],
    active: true,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Club Neon',
    preview: 'Your set for Friday is confirmed!',
    messages: [],
    active: false,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: 'Mike Beats',
    preview: 'Loved your latest track!',
    messages: [],
    active: false,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
    name: 'Electro Fest',
    preview: 'Can you headline our event?',
    messages: [],
    active: false,
  },
];

const Messages = () => {
  const [chats, setChats] = useState(messagesData);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newChats = [...chats];
      const activeChat = newChats.find(chat => chat.active);
      activeChat.messages.push({ type: 'sent', text: inputMessage });
      setChats(newChats);
      setInputMessage('');
    }
  };

  const handleChatClick = (index) => {
    const newChats = chats.map((chat, i) => ({
      ...chat,
      active: i === index,
    }));
    setChats(newChats);
  };

  return (
    <div className="app-container">
      <div className="messages-sidebar">
        <ul className="chat-list">
          {chats.map((chat, index) => (
            <li
              key={index}
              className={`chat-item ${chat.active ? 'active' : ''}`}
              onClick={() => handleChatClick(index)}
            >
              <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-preview">{chat.preview}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <img
            src={chats.find(chat => chat.active).avatar}
            alt={chats.find(chat => chat.active).name}
            className="chat-header-avatar"
          />
          <div className="chat-header-name">{chats.find(chat => chat.active).name}</div>
        </div>
        <div className="chat-messages">
          {chats
            .find(chat => chat.active)
            .messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.type === 'received' ? 'message-received' : 'message-sent'
                }`}
              >
                {message.text}
              </div>
            ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
