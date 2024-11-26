import React, { useState } from 'react';
import { 
  Search, Clock, Settings, Crown, 
  Wine, Plus, Minus, X
} from 'lucide-react';
import '../styles/simplifiedPOS.css';
import { usePOS } from '../../../context/POSContext';

const SimplifiedPOS = () => {
  const { menuItems } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pos-container">
      {/* Left Panel */}
      <div className="left-panel">
        {/* Search Header */}
        <div className="search-header">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search menu..."
                className="search-input"
              />
              <Search className="search-icon" size={20} />
            </div>
            
            <div className="action-buttons">
              <button className="icon-button">
                <Clock size={20} />
              </button>
              <button className="icon-button">
                <Settings size={20} />
              </button>
            </div>

            <div className="user-info">
              <div className="user-details">
                <p className="user-role">Mixologist</p>
                <p className="user-name">JK</p>
              </div>
              <div className="user-avatar">JK</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="categories">
          {[
            'All',
            'VIP Experience',
            'Champagne',
            'Signature',
            'Bottle Service'
          ].map(category => (
            <button
              key={category}
              className={`category-button ${
                selectedCategory === category.toLowerCase() ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-image"></div>
              <h3 className="item-title">{item.name}</h3>
              <div className="item-footer">
                <span className="item-price">${item.price.toFixed(2)}</span>
                <button className="add-button">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {/* Order Header */}
        <div className="order-header">
          <div className="order-title">
            <div className="title-with-icon">
              <Crown className="crown-icon" size={24} />
              <h2>Current Order</h2>
            </div>
            <div className="order-number">
              <span>VIP</span>
              <span className="number">#12</span>
            </div>
          </div>

          <div className="order-types">
            {['Bottle Service', 'VIP Suite', 'Table'].map((type, i) => (
              <button
                key={type}
                className={`type-button ${i === 0 ? 'active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items">
          {[
            { name: 'Ace of Spades Rosé', type: 'Champagne', price: 1200 },
            { name: 'Diamond Suite', type: 'VIP', price: 5000 }
          ].map((item, i) => (
            <div key={i} className="order-item">
              <div className="item-header">
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.type}</p>
                </div>
                <button className="remove-button">
                  <X size={18} />
                </button>
              </div>
              <div className="item-controls">
                <div className="quantity-controls">
                  <button className="quantity-button minus">
                    <Minus size={16} />
                  </button>
                  <span>1</span>
                  <button className="quantity-button plus">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="price">${item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>$6,200.00</span>
            </div>
            <div className="summary-row">
              <span>Service (20%)</span>
              <span>$1,240.00</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>$7,440.00</span>
            </div>
          </div>

          <div className="payment-buttons">
            <button className="payment-button primary">Process Payment</button>
            <button className="payment-button vibe">Pay with VIBE Token</button>
            <div className="secondary-buttons">
              <button className="secondary-button">Split Bill</button>
              <button className="secondary-button">Pre-authorize</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedPOS;
