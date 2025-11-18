import React, { createContext, useContext } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getMenuItems, getMenuCategories, getInventory } from 'wasp/client/operations';

const POSContext = createContext();

export function POSProvider({ children }) {
  // Fetch data using Wasp queries
  const {
    data: menuItems = [],
    isLoading: menuItemsLoading,
    error: menuItemsError
  } = useQuery(getMenuItems);

  const {
    data: menuCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery(getMenuCategories);

  const {
    data: inventory = [],
    isLoading: inventoryLoading,
    error: inventoryError
  } = useQuery(getInventory);

  const value = {
    // Data
    menuItems,
    menuCategories,
    inventory,

    // Loading states
    isLoading: menuItemsLoading || categoriesLoading || inventoryLoading,
    menuItemsLoading,
    categoriesLoading,
    inventoryLoading,

    // Errors
    error: menuItemsError || categoriesError || inventoryError,
    menuItemsError,
    categoriesError,
    inventoryError,
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