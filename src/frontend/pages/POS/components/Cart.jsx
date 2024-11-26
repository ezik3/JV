import React from 'react';
import '../styles/cart.css';

const Cart = ({ items, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const groupedItems = items.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += 1;
      existing.totalPrice += item.price;
    } else {
      acc.push({
        ...item,
        quantity: 1,
        totalPrice: item.price
      });
    }
    return acc;
  }, []);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Current Order</h2>
        {items.length > 0 && (
          <button 
            className="clear-cart"
            onClick={() => onCheckout([])}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="cart-items">
        {groupedItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <span className="item-quantity">{item.quantity}x</span>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button 
              className="remove-item"
              onClick={() => onRemoveItem(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          className="checkout-button"
          onClick={() => onCheckout(items)}
          disabled={items.length === 0}
        >
          Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default Cart;
