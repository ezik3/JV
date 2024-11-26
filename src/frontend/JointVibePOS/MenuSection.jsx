// src/frontend/pages/JointVibePOS/MenuSection.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuSection = ({ onAddItem }) => {
    const [categories, setCategories] = useState([
        'All Items', 'Drinks', 'Cocktails', 'Spirits', 
        'Beer', 'Wine', 'Food', 'VIP Packages'
    ]);
    const [selectedCategory, setSelectedCategory] = useState('All Items');
    const [menuItems, setMenuItems] = useState([]);
    
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders/menu');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    return (
        <div className="menu-section">
            <div className="categories">
                {categories.map(category => (
                    <button 
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="items-grid">
                {menuItems.map(item => (
                    <div 
                        key={item._id} 
                        className="item-card"
                        onClick={() => onAddItem(item)}
                    >
                        <div className="item-image"></div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">{item.price} JV</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuSection;