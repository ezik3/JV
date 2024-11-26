import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [activeVenue, setActiveVenue] = useState(null);

  const placeOrder = async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, venueId: activeVenue })
      });
      
      const newOrder = await response.json();
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      setActiveVenue,
      placeOrder 
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
