// src/frontend/pages/POS/screens/Kitchen.jsx
import React, { useState } from 'react';
import '../styles/kitchen-list.css';

const KitchenListView = ({ onToggleView }) => {
  const [orders, setOrders] = React.useState([]);
  const [filterType, setFilterType] = useState('all');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleFilterOrders = (type) => {
    setFilterType(type);
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const OrderItem = ({ order }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);
    
    return (
      <div className="order-item">
        <div className="order-info">
          <span className="order-number">#{order.number}</span>
          <img 
            src={`https://i.pravatar.cc/40?u=${order.id}`} 
            alt={order.customerName} 
            className="order-profile"
          />
          <span className="order-name">{order.customerName}</span>
          <span className="order-table">Table {order.table}</span>
          <span className="order-time">
            {new Date(order.createdAt).toLocaleTimeString()}
          </span>
          <div className="order-progress">
            {[1,2,3,4].map((step) => (
              <div 
                key={step}
                className={`progress-dot ${
                  step <= order.progress ? 
                    step === 1 ? 'ordered' :
                    step === 2 ? 'cooking' :
                    step === 3 ? 'delivering' : 'received'
                  : ''
                }`}
              />
            ))}
          </div>
        </div>
        <div className="order-actions">
          <button 
            className="btn view-order"
            onClick={() => setDetailsVisible(!detailsVisible)}
          >
            View Order
          </button>
        </div>
        {detailsVisible && (
          <div className="order-details">
            <p><strong>Items:</strong> {order.items.join(', ')}</p>
            <p className="order-comment">
              <strong>Notes:</strong> {order.notes || 'No notes'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="kitchen-list-container">
      <div className="kitchen-header">
        <h1>Kitchen Orders</h1>
        <button onClick={onToggleView} className="view-toggle-btn">
          Switch to Grid View
        </button>
        <div className="filter-dropdown">
          <button onClick={toggleDropdown} className="dropdown-btn">
            Filter Orders
          </button>
          {dropdownVisible && (
            <div className="dropdown-content">
              <a href="#" onClick={() => handleFilterOrders('all')}>
                All Orders
              </a>
              <a href="#" onClick={() => handleFilterOrders('active')}>
                Active
              </a>
              <a href="#" onClick={() => handleFilterOrders('completed')}>
                Completed
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="orders-container">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default KitchenListView;