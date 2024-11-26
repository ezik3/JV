import React, { useState, useEffect } from 'react';
import { usePOS } from '../../../context/POSContext';
import feather from 'feather-icons';

const POSInventory = () => {
  const { menuItems, inventory } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    feather.replace();
  }, []);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="inventory-table">
          <div className="table-header">
            <div>Status</div>
            <div>Item Name</div>
            <div>Category</div>
            <div>Stock Level</div>
            <div>Unit Price</div>
            <div>Actions</div>
          </div>

          {filteredItems.map(item => (
            <div key={item.id} className="table-row">
              <div className="stock-status">
                <span className={`stock-indicator stock-${item.stockStatus}`}></span>
              </div>
              <div>{item.name}</div>
              <div>{item.category}</div>
              <div>{inventory[item.id]?.quantity || 0}</div>
              <div>${item.price.toFixed(2)}</div>
              <div className="item-actions">
                <button className="item-button">Edit</button>
                <button className="item-button">Order</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default POSInventory;