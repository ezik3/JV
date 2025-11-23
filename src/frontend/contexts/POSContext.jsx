import React, { createContext, useContext } from 'react';
import { useQuery } from 'wasp/client/operations';
import { useAction } from 'wasp/client/operations';
import { getMenuItems, getInventory } from 'wasp/client/operations';
import { createMenuItem, updateMenuItem, deleteMenuItem, updateInventory as updateInventoryAction } from 'wasp/client/operations';

const POSContext = createContext();

export function POSProvider({ children }) {
  // Use Wasp's useQuery hooks to fetch data
  const { data: menuItems = [], isLoading: menuLoading, error: menuError } = useQuery(getMenuItems);
  const { data: inventory = [], isLoading: inventoryLoading, error: inventoryError } = useQuery(getInventory);
  
  // Use Wasp's useAction hooks for mutations
  const createMenuItemFn = useAction(createMenuItem);
  const updateMenuItemFn = useAction(updateMenuItem);
  const deleteMenuItemFn = useAction(deleteMenuItem);
  const updateInventoryFn = useAction(updateInventoryAction);

  // Wrapper functions to match existing API
  const addMenuItem = async (newItem) => {
    try {
      await createMenuItemFn(newItem);
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateInventory = async (menuItemId, quantity) => {
    try {
      await updateInventoryFn({ menuItemId, quantity });
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  };

  const updateExistingMenuItem = async (id, data) => {
    try {
      await updateMenuItemFn({ id, ...data });
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteExistingMenuItem = async (id) => {
    try {
      await deleteMenuItemFn({ id });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const value = {
    menuItems,
    inventory,
    addMenuItem,
    updateInventory,
    updateMenuItem: updateExistingMenuItem,
    deleteMenuItem: deleteExistingMenuItem,
    isLoading: menuLoading || inventoryLoading,
    error: menuError || inventoryError
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