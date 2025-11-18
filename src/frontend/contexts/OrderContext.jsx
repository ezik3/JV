import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { getOrders } from 'wasp/client/operations';
import { createOrder, updateOrderStatus } from 'wasp/client/operations';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [activeVenue, setActiveVenue] = useState(null);
  
  // Use Wasp's useQuery to fetch orders
  const { data: orders = [], isLoading, error } = useQuery(getOrders);
  
  // Use Wasp's useAction for mutations
  const createOrderFn = useAction(createOrder);
  const updateOrderStatusFn = useAction(updateOrderStatus);

  const placeOrder = async (orderData) => {
    try {
      const newOrder = await createOrderFn(orderData);
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await updateOrderStatusFn({ id: orderId, status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders,
      isLoading,
      error,
      setActiveVenue,
      activeVenue,
      placeOrder,
      updateOrderStatus: updateStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
