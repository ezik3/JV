import React, { useState, useEffect } from 'react';

const MenuSection = ({ onAddItem }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Demo menu items - we'll replace this with your backend data later
    const demoItems = [
        { id: 1, name: 'Burger', price: 15.99, category: 'food' },
        { id: 2, name: 'French Fries', price: 5.99, category: 'food' },
        { id: 3, name: 'Beer', price: 8.99, category: 'drinks' },
        { id: 4, name: 'Cocktail', price: 12.99, category: 'drinks' },
    ];

    useEffect(() => {
        // For now, using demo items
        setMenuItems(demoItems);
    }, []);

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="menu-section">
            <div className="menu-header">
                <input 
                    type="text"
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="menu-search"
                />
                <div className="category-filters">
                    <button 
                        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`category-btn ${selectedCategory === 'food' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('food')}
                    >
                        Food
                    </button>
                    <button 
                        className={`category-btn ${selectedCategory === 'drinks' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('drinks')}
                    >
                        Drinks
                    </button>
                </div>
            </div>
            <div className="menu-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className="menu-item" onClick={() => onAddItem(item)}>
                        <h3>{item.name}</h3>
                        <p className="price">{item.price} JV</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuSection;