import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import '../styles/posMenuBuilder.css';
import { usePOS } from '../../../contexts/POSContext';

const POSMenuBuilder = () => {
  const { menuItems = [], addMenuItem, isLoading } = usePOS();
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Drinks',
    inventoryItem: '',
    price: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const inventoryItems = [
    { id: 1, name: 'Premium Vodka', stock: 85, unit: 'bottles' },
    { id: 2, name: 'Craft Beer - IPA', stock: 120, unit: 'cans' },
    { id: 3, name: 'Red Wine - Cabernet', stock: 15, unit: 'bottles' },
    { id: 4, name: 'Tonic Water', stock: 200, unit: 'bottles' }
  ];

  useEffect(() => {
    feather.replace();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addMenuItem({
        name: formData.itemName,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inventoryItem: formData.inventoryItem
      });
      
      setFormData({
        itemName: '',
        category: 'Drinks',
        inventoryItem: '',
        price: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item. Please try again.');
    } finally {
      setSubmitting(false);
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
            <a href="/venue/pos/inventory" className="nav-link">
              <i data-feather="package"></i>
              Inventory
            </a>
          </li>
          <li className="nav-item">
            <a href="/venue/pos/menu" className="nav-link active">
              <i data-feather="book-open"></i>
              Menu Builder
            </a>
          </li>
        </nav>
      </aside>

      <main className="main-content">
        <div className="menu-builder">
          <div className="menu-header">
            <h1>Menu Builder</h1>
            <button className="action-button">
              <i data-feather="save"></i>
              Save Menu
            </button>
          </div>

          <div className="menu-form">
            <h2>Create New Menu Item</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label htmlFor="itemName">Menu Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Drinks">Drinks</option>
                  <option value="Food">Food</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="inventoryItem">Inventory Item</label>
                <select
                  id="inventoryItem"
                  name="inventoryItem"
                  value={formData.inventoryItem}
                  onChange={handleInputChange}
                >
                  <option value="">Select Item</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.name}>
                      {item.name} ({item.stock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group span-2">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group span-2">
                <button type="submit" className="action-button" disabled={submitting}>
                  <i data-feather="plus"></i>
                  {submitting ? 'Adding...' : 'Add Menu Item'}
                </button>
              </div>
            </form>
          </div>

          <div className="menu-items">
            <h3>Current Menu Items</h3>
            {isLoading ? (
              <p>Loading menu items...</p>
            ) : (
              <div className="menu-grid">
                {menuItems.length === 0 ? (
                  <p>No menu items yet. Add your first item above!</p>
                ) : (
                  menuItems.map(item => (
                    <div key={item.id} className="menu-card">
                      <div className="menu-item-info">
                        <h4 className="menu-item-title">{item.name}</h4>
                        <p className="menu-item-description">{item.description}</p>
                        <p className="menu-item-price">${item.price.toFixed(2)}</p>
                        <span className={`inventory-status status-${item.inventory?.quantity > 0 ? 'in-stock' : 'low-stock'}`}>
                          {item.inventory?.quantity > 0 ? 'In Stock' : 'Low Stock'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default POSMenuBuilder;
