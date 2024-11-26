import React, { createContext, useContext, useState } from 'react';

const POSContext = createContext();

export function POSProvider({ children }) {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Premium Vodka Cocktail',
      description: 'Signature cocktail made with our premium vodka',
      price: 12.99,
      category: 'Drinks',
      inventoryItem: 'Premium Vodka',
      stockStatus: 'in-stock'
    }
  ]);

  const [inventory, setInventory] = useState({
    1: { quantity: 100 }
  });

  const addMenuItem = (newItem) => {
    setMenuItems(prev => [...prev, {
      id: prev.length + 1,
      ...newItem,
      stockStatus: 'in-stock'
    }]);
  };

  const updateInventory = (menuItemId, quantity) => {
    setInventory(prev => ({
      ...prev,
      [menuItemId]: { quantity }
    }));
  };

  const value = {
    menuItems,
    inventory,
    addMenuItem,
    updateInventory
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
}

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};