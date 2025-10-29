import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import './VenueOrders.css';

const socket = io('http://localhost:5001');

const getProgressDots = (progress) => {
  let dots = [];
  for (let i = 1; i <= 4; i++) {
    let className = 'progress-dot';
    if (i <= progress) {
      className += progress === 1 ? ' ordered' :
                   progress === 2 ? ' cooking' :
                   progress === 3 ? ' delivering' : ' received';
    }
    dots.push(<div key={i} className={className}></div>);
  }
  return dots;
};

const VenueOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Fetch initial orders
    fetch('http://localhost:5001/api/orders/all')
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching orders:', error));

    // Listen for new orders from the server
    socket.on('newOrder', (order) => {
      setOrders(prevOrders => [order, ...prevOrders]);
    });

    return () => {
      socket.off('newOrder');
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleFilterOrders = (type) => {
    setFilterType(type);
    setDropdownVisible(false);
  };

  const handleSwitchToPOS = () => {
    history.push('/pos');
  };

  return (
    <div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/orders" className="active">Orders</a></li>
          <li><a href="/credits">Credits</a></li>
          <li><a href="/assign">Assign</a></li>
          <li><a href="/notifications">Notifications</a></li>
          <li><a href="/messages">Messages</a></li>
          <li><a href="/account">Account</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>

      <div className="container">
        <h1>Orders Dashboard</h1>
        <div className="action-buttons">
          <button onClick={handleSwitchToPOS} className="btn switch-to-pos">Switch to POS</button>
          <div className="filter-dropdown">
            <button onClick={toggleDropdown} className="dropdown-btn">Filter Orders</button>
            {dropdownVisible && (
              <div className="dropdown-content">
                <a href="#" onClick={() => handleFilterOrders('all')}>All Orders</a>
                <a href="#" onClick={() => handleFilterOrders('paid')}>Paid</a>
                <a href="#" onClick={() => handleFilterOrders('unpaid')}>Unpaid</a>
                <a href="#" onClick={() => handleFilterOrders('refunded')}>Refunded</a>
              </div>
            )}
          </div>
        </div>
        <div className="orders-container">
          {orders.filter(order => {
            if (filterType === 'all') return true;
            if (filterType === 'paid') return order.paid;
            if (filterType === 'unpaid') return !order.paid;
            if (filterType === 'refunded') return false; // Assuming no refunded orders in this example
            return true;
          }).map(order => (
            <OrderItem key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderItem = ({ order }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const sendMessage = () => {
    alert(`Sending message to ${order.customerName} about order #${order._id}`);
  };

  const viewProfile = () => {
    alert(`Viewing profile of ${order.customerName}`);
  };

  return (
    <div className="order-item">
      <div className="order-info">
        <span className="order-number">#{order._id}</span>
        <img src={`https://i.pravatar.cc/40?u=${order._id}`} alt={order.customerName} className="order-profile" onClick={viewProfile} />
        <span className="order-name" onClick={viewProfile}>{order.customerName}</span>
        <span className="order-table">Table {order.table || 'N/A'}</span>
        <span>ordered</span>
        <span className="order-time">{new Date(order.createdAt).toLocaleString()}</span>
        <span className={`order-status ${order.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
          {order.status}
        </span>
        <span className="order-price">${order.totalAmount.toFixed(2)}</span>
        <div className="order-progress">
          {getProgressDots(order.progress || 1)}
          <span className="progress-label">
            {order.status}
          </span>
        </div>
      </div>
      <div className="order-actions">
        <button className="btn view-order" onClick={toggleDetails}>View Order</button>
        <button className="btn send-message" onClick={sendMessage}>Send Message</button>
      </div>
      {detailsVisible && (
        <div className="order-details">
          <p><strong>Items:</strong> {order.items.join(', ')}</p>
          <p className="order-comment"><strong>Comment:</strong> {order.comment || 'No comment'}</p>
        </div>
      )}
    </div>
  );
};

export default VenueOrders;
