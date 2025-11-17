import React from 'react';
import '../styles/orderCard.css';

const OrderCard = ({ order, onStatusUpdate }) => {
  const statusColors = {
    pending: 'var(--warning)',
    preparing: 'var(--info)',
    ready: 'var(--success)',
    delivered: 'var(--text-secondary)',
    cancelled: 'var(--error)'
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(order.id, newStatus);
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <span className="order-number">#{order.id}</span>
          <span 
            className="order-status"
            style={{ backgroundColor: statusColors[order.status] }}
          >
            {order.status}
          </span>
        </div>
        <span className="order-time">
          {new Date(order.createdAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span className="item-quantity">{item.quantity}x</span>
            <span className="item-name">{item.name}</span>
            <span className="item-price">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <div className="order-total">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        
        <div className="order-actions">
          {order.status === 'pending' && (
            <button 
              className="action-button accept"
              onClick={() => handleStatusChange('preparing')}
            >
              Accept
            </button>
          )}
          {order.status === 'preparing' && (
            <button 
              className="action-button ready"
              onClick={() => handleStatusChange('ready')}
            >
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button 
              className="action-button deliver"
              onClick={() => handleStatusChange('delivered')}
            >
              Deliver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
