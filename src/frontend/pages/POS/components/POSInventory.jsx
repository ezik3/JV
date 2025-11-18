import React, { useState, useEffect } from 'react';
import { usePOS } from '../../../contexts/POSContext';
import feather from 'feather-icons';

const POSInventory = () => {
  const { menuItems = [], inventory = [], isLoading, updateInventory } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    feather.replace();
  }, []);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateInventory = async (menuItemId) => {
    if (!newQuantity || isNaN(newQuantity)) {
      alert('Please enter a valid quantity');
      return;
    }

    try {
      await updateInventory(menuItemId, parseInt(newQuantity));
      setEditingItem(null);
      setNewQuantity('');
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Failed to update inventory. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">JoinVibe POS</div>
        <nav className="nav-menu">
          <li className="nav-item">
            <a href="/venue/pos/dashboard" className="nav-link">
              <i data-feather="home"></i>
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/system" className="nav-link">
              <i data-feather="shopping-cart"></i>
              Point of Sale
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/inventory" className="nav-link active">
              <i data-feather="package"></i>
              Inventory
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/menu" className="nav-link">
              <i data-feather="book-open"></i>
              Menu Builder
            </a>
          </li>
        </nav>
      </aside>

      <main className="main-content">
        <div className="inventory-header">
          <h1>Inventory Management</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="inventory-table">
            <div className="table-header">
              <div>Status</div>
              <div>Item Name</div>
              <div>Category</div>
              <div>Stock Level</div>
              <div>Unit Price</div>
              <div>Actions</div>
            </div>

            {filteredItems.map(item => {
              const itemInventory = item.inventory || { quantity: 0, lowStockThreshold: 10 };
              const isLowStock = itemInventory.quantity <= itemInventory.lowStockThreshold;
              const stockStatus = itemInventory.quantity === 0 ? 'out' : isLowStock ? 'low' : 'good';

              return (
                <div key={item.id} className="table-row">
                  <div className="stock-status">
                    <span className={`stock-indicator stock-${stockStatus}`}></span>
                  </div>
                  <div>{item.name}</div>
                  <div>{item.category}</div>
                  <div>
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        placeholder={itemInventory.quantity}
                        style={{ width: '60px' }}
                      />
                    ) : (
                      itemInventory.quantity
                    )}
                  </div>
                  <div>${item.price.toFixed(2)}</div>
                  <div className="item-actions">
                    {editingItem === item.id ? (
                      <>
                        <button 
                          className="item-button" 
                          onClick={() => handleUpdateInventory(item.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="item-button" 
                          onClick={() => {
                            setEditingItem(null);
                            setNewQuantity('');
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        className="item-button" 
                        onClick={() => {
                          setEditingItem(item.id);
                          setNewQuantity(itemInventory.quantity.toString());
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default POSInventory;