// components/home/SearchHome.js
import React from "react";
import SearchBar from "./SearchBar";
import CategoryChips from "./CategoryChips";
import FeaturedDatasets from "./FeaturedDatasets";
import { useFilters } from "../../context/FilterContext";
import { useApp } from "../../context/AppContext";

const SearchHome = ({ searchService, onSearch }) => {
  const { setSearchQuery } = useFilters();

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  // Handle the "View All Datasets" action
  const handleViewAllDatasets = () => {
    // Clear any search query
    setSearchQuery("");
    // Call the onSearch handler with empty string
    // This signals to navigate to search results without a query
    onSearch("");
  };

  const handleSelectCategory = (category) => {
    // Search by category
    handleSearch(category.name);
  };

  const categories = [
    { name: "Promoting Healthy Child Development", color: "#FF6B6B" },
    { name: "Youth Development and Civic Engagement", color: "#4ECDC4" },
    { name: "Creating Protective Environments", color: "#45B7D1" },
    {
      name: "Strengthening Economic Supports for Children and Families",
      color: "#98D85B",
    },
    { name: "Access to Safe and Stable Housing", color: "#FFD166" },
    { name: "Demographic Data", color: "#6A0572" },
  ];

  return (
    <div className="search-home">
      <div className="search-home-container">
        <h1 className="search-home-title">Healthcare Dataset Search</h1>
        <p className="search-home-description">
          Find and explore healthcare and community data from various sources
        </p>

        <SearchBar onSearch={handleSearch} />

        <CategoryChips
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />

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

        <FeaturedDatasets
          datasets={searchService.getFeaturedDatasets()}
          onViewAll={handleViewAllDatasets}
        />
      </div>
    </div>
  );
};

export default SearchHome;
