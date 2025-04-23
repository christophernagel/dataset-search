// src/components/home/SearchHome.js - without React Router
import React from 'react';
import SearchBar from './SearchBar';
import CategoryChips from './CategoryChips';
import FeaturedDatasets from './FeaturedDatasets';

const SearchHome = ({ searchService, onSearch }) => {
  // Use the onSearch prop instead of router navigation
  const handleSearch = (query) => {
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  const categories = [
    { name: "Promoting Healthy Child Development", color: "#FF6B6B" },
    { name: "Youth Development and Civic Engagement", color: "#4ECDC4" },
    { name: "Creating Protective Environments", color: "#45B7D1" },
    { name: "Strengthening Economic Supports for Children and Families", color: "#98D85B" },
    { name: "Access to Safe and Stable Housing", color: "#FFD166" },
    { name: "Demographic Data", color: "#6A0572" },
  ];
  
  const featuredDatasets = searchService.getFeaturedDatasets();
  
  return (
    <div className="search-home">
      <div className="search-home-container">
        <h1 className="search-home-title">Healthcare Dataset Search</h1>
        <p className="search-home-description">
          Find and explore healthcare and community data from various sources
        </p>
        
        <SearchBar onSearch={handleSearch} />
        
        <CategoryChips categories={categories} onSelectCategory={(cat) => handleSearch(cat.name)} />
        
        <div className="search-home-stats">
          <div className="stat-item">
            <div className="stat-number">{searchService.datasets.length}</div>
            <div className="stat-label">Datasets</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">6</div>
            <div className="stat-label">Community Areas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12</div>
            <div className="stat-label">Data Sources</div>
          </div>
        </div>
        
        <div className="featured-datasets-section">
          <h2 className="section-title">Featured Datasets</h2>
          <FeaturedDatasets datasets={featuredDatasets} />
        </div>
      </div>
    </div>
  );
};

export default SearchHome;