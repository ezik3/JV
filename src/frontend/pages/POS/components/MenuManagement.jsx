import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/menuManagement.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  });

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const venueId = localStorage.getItem('venueId');
      
      if (!venueId) {
        setError('Venue ID not found. Please log in again.');
        return;
      }

      const response = await axios.post('/api/menu/items', {
        ...newItem,
        venueId,
        price: parseFloat(newItem.price)
      });

      setMenuItems([...menuItems, response.data]);
      setSuccess('Menu item added successfully!');
      
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        available: true
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      setError(error.response?.data?.error || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`/api/menu/items?venueId=${venueId}`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    if (venueId) {
      fetchMenuItems();
    }
  }, [venueId]);

  return (
    <div className="menu-management">
      <h2>Menu Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
          required
        />
        
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({...newItem, price: e.target.value})}
          required
        />
        
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
          required
        >
          <option value="">Select Category</option>
          <option value="drinks">Drinks</option>
          <option value="food">Food</option>
          <option value="snacks">Snacks</option>
        </select>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      {/* Display Menu Items */}
      <div className="menu-items-list">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <p>Category: {item.category}</p>
            <p>Status: {item.available ? 'Available' : 'Unavailable'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;