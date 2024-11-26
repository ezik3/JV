import React from 'react';
import '../styles/menuGrid.css';

const MenuGrid = ({ category, onItemClick }) => {
  // This would normally come from your backend
  const menuItems = [
    {
      id: 1,
      name: "Classic Burger",
      price: 15.99,
      category: "Food",
      image: "/images/burger.jpg",
      description: "Beef patty with lettuce, tomato, and cheese"
    },
    {
      id: 2,
      name: "Mojito",
      price: 12.99,
      category: "Drinks",
      image: "/images/mojito.jpg",
      description: "Rum, mint, lime, soda"
    },
    // Add more items as needed
  ];

  const filteredItems = category === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === category);

  return (
    <div className="menu-grid">
      {filteredItems.map((item) => (
        <div 
          key={item.id} 
          className="menu-item"
          onClick={() => onItemClick(item)}
        >
          <div className="item-image">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="item-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="item-price">${item.price.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
