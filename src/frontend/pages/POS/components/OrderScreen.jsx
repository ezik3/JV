import React, { useState, useEffect } from 'react';
import AIWaiter from '../../../components/shared/AIWaiter';
import MenuGrid from './MenuGrid';
import CategoryBar from './CategoryBar';
import Cart from './Cart';
import OrderCard from './OrderCard';
import '../styles/orderScreen.css';
import { useOrders } from '../../../contexts/OrderContext';

const OrderScreen = ({ venueId }) => {
  const [cart, setCart] = useState([]);
  const [showAIWaiter, setShowAIWaiter] = useState(false);
  const { orders = [], setActiveVenue, updateOrderStatus, isLoading } = useOrders();

  useEffect(() => {
    if (venueId) {
      setActiveVenue(venueId);
    }
  }, [venueId, setActiveVenue]);

  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  return (
    <div className="order-screen">
      <div className="menu-section">
        <div className="menu-header">
          <CategoryBar />
          <button 
            className="ai-toggle"
            onClick={() => setShowAIWaiter(!showAIWaiter)}
          >
            {showAIWaiter ? 'Hide AI Assistant' : 'Show AI Assistant'}
          </button>
        </div>
        
        <MenuGrid 
          onItemClick={(item) => setCart([...cart, item])}
        />
      </div>

      <div className="order-controls">
        {showAIWaiter && (
          <AIWaiter
            venueId={venueId}
            mode="pos"
            onOrderRequest={(items) => {
              // Handle AI-assisted orders
              setCart([...cart, ...items]);
            }}
          />
        )}
        
        <Cart 
          items={cart}
          onRemoveItem={(id) => {
            setCart(cart.filter(item => item.id !== id));
          }}
        />
      </div>

      <div className="orders-section">
        {isLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map(order => (
            <OrderCard 
              key={order.id}
              order={order}
              onStatusUpdate={handleOrderStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderScreen;
