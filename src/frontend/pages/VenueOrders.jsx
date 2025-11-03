import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import './VenueOrders.css';

const socket = io('http://localhost:5000');

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
    // Fetch initial orders from backend
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/orders/pos/venue', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setOrders([]);
      });

    // Listen for new orders from the server
    socket.on('newOrder', (order) => {
      setOrders(prevOrders => [order, ...prevOrders]);
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('newOrder');
      socket.off('orderStatusUpdated');
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
    history.push('/venue/pos');
  };

  return (
    <div>
      <nav>
        <ul>
          <li><a href="/venue/home">Home</a></li>
          <li><a href="/venue/menu">Menu</a></li>
          <li><a href="/venue/orders" className="active">Orders</a></li>
          <li><a href="/venue/credits">Credits</a></li>
          <li><a href="/venue/assign">Assign</a></li>
          <li><a href="/venue/notifications">Notifications</a></li>
          <li><a href="/venue/messages">Messages</a></li>
          <li><a href="/venue/accounts">Account</a></li>
          <li><a href="/venue/settings">Settings</a></li>
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
                <a href="#" onClick={() => handleFilterOrders('pending')}>Pending</a>
                <a href="#" onClick={() => handleFilterOrders('cancelled')}>Cancelled</a>
              </div>
            )}
          </div>
        </div>
        <div className="orders-container">
          {orders.filter(order => {
            if (filterType === 'all') return true;
            if (filterType === 'paid') return order.paymentStatus === 'completed';
            if (filterType === 'pending') return order.status === 'pending';
            if (filterType === 'cancelled') return order.status === 'cancelled';
            return true;
          }).map(order => (
            <OrderItem key={order._id} order={order} />
          ))}
          {orders.length === 0 && (
            <div className="no-orders">
              <p>No orders yet. Orders will appear here when customers place them.</p>
            </div>
          )}
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

  const getStatusProgress = (status) => {
    const statusMap = {
      'pending': 1,
      'confirmed': 2,
      'preparing': 2,
      'ready': 3,
      'delivered': 4,
      'paid': 4,
      'cancelled': 0
    };
    return statusMap[status] || 1;
  };

  return (
    <div className="order-item">
      <div className="order-info">
        <span className="order-number">#{order._id.substring(0, 8)}</span>
        <img src={`https://i.pravatar.cc/40?u=${order._id}`} alt={order.customerName} className="order-profile" onClick={viewProfile} />
        <span className="order-name" onClick={viewProfile}>{order.customerName}</span>
        <span className="order-table">Table {order.tableNumber || 'N/A'}</span>
        <span>ordered</span>
        <span className="order-time">{new Date(order.createdAt).toLocaleString()}</span>
        <span className={`order-status ${order.paymentStatus === 'completed' ? 'status-paid' : 'status-unpaid'}`}>
          {order.status}
        </span>
        <span className="order-price">${order.totalAmount?.toFixed(2) || '0.00'}</span>
        <div className="order-progress">
          {getProgressDots(getStatusProgress(order.status))}
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
          <p><strong>Items:</strong></p>
          <ul>
            {order.items?.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p><strong>Order Type:</strong> {order.orderType || 'customer'}</p>
        </div>
      )}
    </div>
  );
};

export default VenueOrders;
