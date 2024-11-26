import React from 'react';
import '../styles/categoryBar.css';

const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-bar">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
