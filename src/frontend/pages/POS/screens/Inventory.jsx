import React, { useState } from 'react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryStats] = useState({
    totalItems: 287,
    lowStockItems: 24,
    stockValue: 45892,
    pendingOrders: 12
  });
  
  const [inventoryItems] = useState([
    {
      id: 1,
      status: 'high',
      name: 'Premium Vodka',
      category: 'Spirits',
      stock: '85 bottles',
      price: 29.99
    },
    {
      id: 2,
      status: 'medium',
      name: 'Craft Beer - IPA',
      category: 'Beer',
      stock: '120 cans',
      price: 4.99
    },
    {
      id: 3,
      status: 'low',
      name: 'Red Wine - Cabernet',
      category: 'Wine',
      stock: '15 bottles',
      price: 24.99
    },
    {
      id: 4,
      status: 'high',
      name: 'Tonic Water',
      category: 'Mixers',
      stock: '200 bottles',
      price: 1.99
    }
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddItem = () => {
    alert('Add new item clicked');
  };

  const handleGenerateReport = () => {
    alert('Generate report clicked');
  };

  const handleEditItem = (itemId) => {
    alert(`Edit item ${itemId} clicked`);
  };

  const handleOrderItem = (itemId) => {
    alert(`Order item ${itemId} clicked`);
  };

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="action-button" onClick={handleAddItem}>+ Add New Item</button>
          <button className="action-button" onClick={handleGenerateReport}>Generate Report</button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-title">Total Items</div>
          <div className="stat-value">{inventoryStats.totalItems}</div>
          <div className="stat-trend trend-up">+12 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Low Stock Items</div>
          <div className="stat-value">{inventoryStats.lowStockItems}</div>
          <div className="stat-trend trend-down">-3 from last week</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Stock Value</div>
          <div className="stat-value">${inventoryStats.stockValue}</div>
          <div className="stat-trend trend-up">+$2,451 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Pending Orders</div>
          <div className="stat-value">{inventoryStats.pendingOrders}</div>
          <div className="stat-trend">Due this week</div>
        </div>
      </div>

      <div className="inventory-table">
        <div className="table-header">
          <div>Status</div>
          <div>Item Name</div>
          <div>Category</div>
          <div>Stock Level</div>
          <div>Unit Price</div>
          <div>Actions</div>
        </div>

        {inventoryItems.map((item) => (
          <div key={item.id} className="table-row">
            <div className="stock-status">
              <span className={`stock-indicator stock-${item.status}`}></span>
            </div>
            <div>{item.name}</div>
            <div>{item.category}</div>
            <div>{item.stock}</div>
            <div>${item.price}</div>
            <div className="item-actions">
              <button className="item-button" onClick={() => handleEditItem(item.id)}>Edit</button>
              <button className="item-button" onClick={() => handleOrderItem(item.id)}>Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;