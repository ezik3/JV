import React, { useState, useEffect } from 'react';
import './VenueMenu.css';
import { motion } from 'framer-motion';
import axios from 'axios';

const VenueMenu = ({ venueId }) => {
  const [foodMenu, setFoodMenu] = useState([]);
  const [drinksMenu, setDrinksMenu] = useState([]);
  const [categories, setCategories] = useState(['Food', 'Drinks']);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inventory: 0,
    isAvailable: true,
    allowAiOrdering: true,
    preOrderAvailable: false
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [venueId]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/orders/menu/${venueId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const menuItems = response.data;
      setFoodMenu(menuItems.filter(item => item.category === 'Food'));
      setDrinksMenu(menuItems.filter(item => item.category === 'Drinks'));
      setError(null);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to fetch menu items. Please try again.');
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized access. Redirecting to login...');
        // Implement your redirect logic here
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/categories/${venueId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    }
  };

  const addNewItem = async () => {
    try {
      await axios.post('http://localhost:5001/api/orders/menu',
        { ...newItem, venueId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchMenuItems();
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        inventory: 0,
        isAvailable: true,
        allowAiOrdering: true,
        preOrderAvailable: false
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      setError('Failed to add menu item. Please try again.');
    }
  };

  const updateMenuItem = async (id, updatedItem) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/menu/${id}`,
        updatedItem,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError('Failed to update menu item. Please try again.');
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/orders/menu/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError('Failed to delete menu item. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem(prevItem => ({
      ...prevItem,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <nav>
        {/* ... (navigation remains the same) */}
      </nav>

      <div className="container">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Menu Management
        </motion.h1>

        <motion.div
          className="add-item-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Add New Item</h2>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Item Name"
          />
          <input
            type="text"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <input
            type="number"
            name="inventory"
            value={newItem.inventory}
            onChange={handleInputChange}
            placeholder="Inventory"
          />
          <select name="category" value={newItem.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={newItem.isAvailable}
              onChange={handleInputChange}
            />
            Available
          </label>
          <label>
            <input
              type="checkbox"
              name="allowAiOrdering"
              checked={newItem.allowAiOrdering}
              onChange={handleInputChange}
            />
            Allow AI Ordering
          </label>
          <label>
            <input
              type="checkbox"
              name="preOrderAvailable"
              checked={newItem.preOrderAvailable}
              onChange={handleInputChange}
            />
            Available for Pre-order
          </label>
          <motion.button 
            onClick={addNewItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add New Menu Item
          </motion.button>
        </motion.div>

        {error && <p className="error-message">{error}</p>}

        <motion.div 
          className="menu-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Food Menu</h2>
          <div className="menu-grid" id="foodMenu">
            {foodMenu.map((item) => (
              <motion.div 
                key={item._id}
                className="menu-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
                <p>Inventory: {item.inventory}</p>
                <p>Available: {item.isAvailable ? 'Yes' : 'No'}</p>
                <p>AI Ordering: {item.allowAiOrdering ? 'Enabled' : 'Disabled'}</p>
                <p>Pre-order: {item.preOrderAvailable ? 'Available' : 'Not Available'}</p>
                <button onClick={() => updateMenuItem(item._id, { ...item, inventory: item.inventory + 1 })}>Increase Inventory</button>
                <button onClick={() => updateMenuItem(item._id, { ...item, name: 'Updated Name' })}>Edit</button>
                <button onClick={() => deleteMenuItem(item._id)}>Delete</button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="menu-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2>Drinks Menu</h2>
          <div className="menu-grid" id="drinksMenu">
            {drinksMenu.map((item) => (
              <motion.div 
                key={item._id}
                className="menu-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
                <p>Inventory: {item.inventory}</p>
                <p>Available: {item.isAvailable ? 'Yes' : 'No'}</p>
                <p>AI Ordering: {item.allowAiOrdering ? 'Enabled' : 'Disabled'}</p>
                <p>Pre-order: {item.preOrderAvailable ? 'Available' : 'Not Available'}</p>
                <button onClick={() => updateMenuItem(item._id, { ...item, inventory: item.inventory + 1 })}>Increase Inventory</button>
                <button onClick={() => updateMenuItem(item._id, { ...item, name: 'Updated Name' })}>Edit</button>
                <button onClick={() => deleteMenuItem(item._id)}>Delete</button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ... (modals remain the same) */}
    </div>
  );
};

export default VenueMenu;
