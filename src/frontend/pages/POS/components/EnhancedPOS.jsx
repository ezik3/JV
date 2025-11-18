import React, { useState } from 'react';
import { 
  Search, Clock, Settings, User, 
  Plus, Minus, X, ShoppingCart, CreditCard,
  Trash2, Grid, List,
  TrendingUp, DollarSign, Package, Users
} from 'lucide-react';
import '../styles/enhancedPOS.css';
import { usePOS } from '../../../contexts/POSContext';
import EnhancedPaymentModal from './EnhancedPaymentModal';

const EnhancedPOS = ({ mode = 'professional' }) => {
  const { menuItems } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showPayment, setShowPayment] = useState(false);

  // Mock categories - in real app, derive from menu items
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'drinks', name: 'Drinks', icon: '🍹' },
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'vip', name: 'VIP Service', icon: '👑' },
    { id: 'champagne', name: 'Champagne', icon: '🍾' },
    { id: 'bottle-service', name: 'Bottle Service', icon: '🍾' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      item.category.toLowerCase() === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const serviceCharge = subtotal * 0.18;
  const total = subtotal + tax + serviceCharge;

  // Generate a unique order ID (in production, this should come from backend)
  const [orderId] = useState(() => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setCart([]);
  };

  return (
    <>
      {showPayment && (
        <EnhancedPaymentModal
          total={total}
          items={cart}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
      <div className={`enhanced-pos ${mode === 'classic' ? 'classic-mode' : 'professional-mode'}`}>
      {/* Left Panel - Menu */}
      <div className="pos-menu-section">
        {/* Header */}
        <div className="pos-header">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <button className="action-btn" title="Quick Actions">
              <Clock size={20} />
            </button>
            <button className="action-btn" title="Settings">
              <Settings size={20} />
            </button>
            <div className="user-badge">
              <User size={18} />
              <div className="user-details">
                <span className="user-role">Manager</span>
                <span className="user-name">JK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="categories-bar">
          <div className="categories-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className={`menu-items ${viewMode}`}>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="menu-card"
              onClick={() => addToCart(item)}
            >
              <div className="item-image-container">
                <div className="item-image">
                  <span className="item-emoji">🍸</span>
                </div>
                <button className="quick-add">
                  <Plus size={16} />
                </button>
              </div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description || 'Premium quality'}</p>
                <div className="item-footer">
                  <span className="item-price">${item.price.toFixed(2)}</span>
                  <span className={`stock-badge ${item.stockStatus}`}>
                    {item.stockStatus === 'in-stock' ? '✓ Available' : '⚠ Low'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Cart & Checkout */}
      <div className="pos-cart-section">
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingCart size={24} />
            <div>
              <h2>Current Order</h2>
              <span className="order-id">Order {orderId}</span>
            </div>
          </div>
          {cart.length > 0 && (
            <button className="clear-cart-btn" onClick={() => setCart([])}>
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Order Type Selector */}
        <div className="order-types">
          <button className="order-type-btn active">
            <span>🍽️</span>
            Dine In
          </button>
          <button className="order-type-btn">
            <span>📦</span>
            Takeout
          </button>
          <button className="order-type-btn">
            <span>🚚</span>
            Delivery
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} className="empty-icon" />
              <p>No items added yet</p>
              <span>Select items from the menu to start an order</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-header">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-category">{item.category}</span>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn minus"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="qty-btn plus"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Service Charge (18%)</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Payment Actions */}
        <div className="payment-actions">
          <button 
            className="payment-btn primary"
            disabled={cart.length === 0}
            onClick={() => setShowPayment(true)}
          >
            <CreditCard size={20} />
            Process Payment
          </button>
          <div className="secondary-actions">
            <button className="secondary-btn" disabled={cart.length === 0}>
              Split Bill
            </button>
            <button className="secondary-btn" disabled={cart.length === 0}>
              Hold Order
            </button>
          </div>
          <button className="vibe-payment-btn" disabled={cart.length === 0}>
            <DollarSign size={20} />
            Pay with VIBE Token
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EnhancedPOS;
