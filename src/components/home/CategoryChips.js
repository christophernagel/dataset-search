// components/home/CategoryChips.js
import React from 'react';

const CategoryChips = ({ categories, onSelectCategory }) => {
  return (
    <div className="category-chips">
      <div className="category-chips-label">Popular categories:</div>
      <div className="category-chips-container">
        {categories.map((category) => (
          <button
            key={category.name}
            className="category-chip"
            onClick={() => onSelectCategory(category)}
            style={{ 
              backgroundColor: `${category.color}20`,
              borderColor: category.color 
            }}
          >
            <span 
              className="category-chip-dot" 
              style={{ backgroundColor: category.color }}
            ></span>
            <span className="category-chip-label">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;