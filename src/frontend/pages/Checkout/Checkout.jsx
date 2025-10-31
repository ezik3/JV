import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CreditCard, Wallet, MapPin, Clock, MessageSquare, ChevronLeft, Check } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const history = useHistory();
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in');
  const [venueId, setVenueId] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('jv-coin');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAIWaiter, setShowAIWaiter] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    const savedOrderType = localStorage.getItem('orderType');
    const savedVenueId = localStorage.getItem('venueId');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrderType) setOrderType(savedOrderType);
    if (savedVenueId) setVenueId(savedVenueId);

    // Fetch available tables if dine-in
    if (savedOrderType === 'dine-in' && savedVenueId) {
      fetchTables(savedVenueId);
    }
  }, []);

  const fetchTables = async (vId) => {
    try {
      // Mock tables for now - replace with actual API call
      setTables([
        { id: 1, tableNumber: 'T1', capacity: 2, isAvailable: true },
        { id: 2, tableNumber: 'T2', capacity: 4, isAvailable: true },
        { id: 3, tableNumber: 'T3', capacity: 6, isAvailable: false },
        { id: 4, tableNumber: 'T4', capacity: 4, isAvailable: true },
        { id: 5, tableNumber: 'T5', capacity: 2, isAvailable: true },
      ]);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'dine-in' && !selectedTable) {
      alert('Please select a table');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        venueId,
        orderType,
        tableId: selectedTable,
        specialInstructions,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          customizations: item.customizations || null
        }))
      };

      const response = await fetch('/api/orders/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to place order');

      const result = await response.json();

      // Clear cart
      localStorage.removeItem('cart');
      localStorage.removeItem('orderType');
      localStorage.removeItem('venueId');

      // Redirect to order confirmation or success page
      alert(`Order placed successfully! Order #${result.order.orderNumber}`);
      history.push('/home');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => history.goBack()}>
          <ChevronLeft size={24} />
        </button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {/* Order Type Info */}
          <div className="checkout-section">
            <h2>Order Details</h2>
            <div className="order-type-display">
              <span className="order-type-icon">
                {orderType === 'dine-in' && '🍽️'}
                {orderType === 'takeout' && '🥡'}
                {orderType === 'pre-order' && '⏰'}
              </span>
              <span className="order-type-text">
                {orderType === 'dine-in' && 'Dine In'}
                {orderType === 'takeout' && 'Takeout'}
                {orderType === 'pre-order' && 'Pre-Order'}
              </span>
            </div>
          </div>

          {/* Table Selection (for dine-in) */}
          {orderType === 'dine-in' && (
            <div className="checkout-section">
              <h2>
                <MapPin size={20} />
                Select Table
              </h2>
              <div className="tables-grid">
                {tables.map(table => (
                  <button
                    key={table.id}
                    className={`table-btn ${selectedTable === table.id ? 'selected' : ''} ${!table.isAvailable ? 'unavailable' : ''}`}
                    onClick={() => table.isAvailable && setSelectedTable(table.id)}
                    disabled={!table.isAvailable}
                  >
                    <div className="table-number">{table.tableNumber}</div>
                    <div className="table-capacity">
                      {table.capacity} {table.capacity === 1 ? 'seat' : 'seats'}
                    </div>
                    {selectedTable === table.id && (
                      <div className="table-selected-icon">
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Waiter Option */}
          <div className="checkout-section">
            <div className="ai-waiter-banner">
              <div className="ai-waiter-info">
                <h3>🤖 Need help with your order?</h3>
                <p>Chat with our AI waiter for recommendations or assistance</p>
              </div>
              <button
                className="ai-waiter-btn"
                onClick={() => setShowAIWaiter(true)}
              >
                Open AI Waiter
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="checkout-section">
            <h2>
              <MessageSquare size={20} />
              Special Instructions
            </h2>
            <textarea
              className="special-instructions"
              placeholder="Add any special requests (e.g., allergies, preferences, etc.)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={4}
            />
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>
              <Wallet size={20} />
              Payment Method
            </h2>
            <div className="payment-methods">
              <button
                className={`payment-method ${paymentMethod === 'jv-coin' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('jv-coin')}
              >
                <Wallet size={24} />
                <div className="payment-method-info">
                  <span className="payment-method-name">JV Coin</span>
                  <span className="payment-method-desc">Pay with your JV Coin wallet</span>
                </div>
                {paymentMethod === 'jv-coin' && (
                  <Check size={20} className="payment-selected" />
                )}
              </button>
              <button
                className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={24} />
                <div className="payment-method-info">
                  <span className="payment-method-name">Credit/Debit Card</span>
                  <span className="payment-method-desc">Pay with your card</span>
                </div>
                {paymentMethod === 'card' && (
                  <Check size={20} className="payment-selected" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-quantity">x{item.quantity}</span>
                </div>
                <span className="summary-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Service Fee</span>
              <span>${(getCartTotal() * 0.05).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(getCartTotal() * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading || (orderType === 'dine-in' && !selectedTable)}
          >
            {loading ? 'Placing Order...' : `Place Order • $${(getCartTotal() * 1.05).toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* AI Waiter Modal */}
      {showAIWaiter && (
        <div className="ai-waiter-modal-overlay" onClick={() => setShowAIWaiter(false)}>
          <div className="ai-waiter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ai-waiter-modal-header">
              <h2>AI Waiter Assistant</h2>
              <button onClick={() => setShowAIWaiter(false)}>×</button>
            </div>
            <div className="ai-waiter-modal-content">
              <p>AI Waiter integration coming soon! This will allow you to:</p>
              <ul>
                <li>Get personalized recommendations</li>
                <li>Ask about menu items and ingredients</li>
                <li>Modify your order via voice or chat</li>
                <li>Request a human waiter if needed</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
