// src/components/home/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, compact = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`search-bar ${compact ? 'search-bar-compact' : 'search-bar-large'}`}
    >
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search healthcare datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search datasets"
        />
        <button type="submit" className="search-button" aria-label="Submit search">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;