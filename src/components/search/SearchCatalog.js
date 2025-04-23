// src/components/search/SearchCatalog.js
import React, { useState, useEffect } from "react";
import DatasetGrid from "../DatasetGrid";
import DatasetFilters from "../filters/DatasetFilters";
import FilterDrawer from "../filters/FilterDrawer";
import UnifiedFilterBar from "../filters/UnifiedFilterBar";
import ViewControls from "../common/ViewControls";
import SearchBar from "../home/SearchBar";
import RelatedSuggestions from "./RelatedSuggestions";

const SearchCatalog = ({ searchService }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query from URL
  const getQueryFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };
  
  // State management
  const [searchQuery, setSearchQuery] = useState(getQueryFromUrl);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchResults, setSearchResults] = useState([]);
  
  // Update query when URL changes
  useEffect(() => {
    setSearchQuery(getQueryFromUrl());
  }, [location.search]);
  
  // Perform search when query or filters change
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchService.search(searchQuery, activeFilters);
      setSearchResults(results);
    } else {
      // If no query, just apply filters to all datasets
      const results = searchService.getFilteredDatasets(activeFilters);
      setSearchResults(results);
    }
  }, [searchQuery, activeFilters, searchService]);
  
  // Handle search submission
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };
  
  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };
  
  const handleRemoveFilter = (category, value) => {
    const newFilters = { ...activeFilters };
    if (newFilters[category]) {
      const newCategoryFilters = { ...newFilters[category] };
      delete newCategoryFilters[value];
      
      if (Object.keys(newCategoryFilters).length === 0) {
        delete newFilters[category];
      } else {
        newFilters[category] = newCategoryFilters;
      }
      
      setActiveFilters(newFilters);
    }
  };
  
  const handleClearFilters = () => {
    setActiveFilters({});
  };
  
  // View controls handlers
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleSortChange = (sort) => {
    setSortBy(sort);
    
    // Apply sorting to search results
    const sortedResults = [...searchResults];
    
    if (sort === "date") {
      sortedResults.sort((a, b) => {
        const dateA = a.dateUpdated ? new Date(a.dateUpdated) : new Date(0);
        const dateB = b.dateUpdated ? new Date(b.dateUpdated) : new Date(0);
        return dateB - dateA; // Most recent first
      });
    } else if (sort === "name") {
      sortedResults.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "relevance" && searchQuery.trim()) {
      // For relevance, rely on the scores from the search service
      // This happens automatically during search
    }
    
    setSearchResults(sortedResults);
  };
  
  return (
    <div className="search-catalog">
      {/* Search Bar Header */}
      <div className="search-catalog-header">
        <SearchBar 
          onSearch={handleSearch} 
          initialQuery={searchQuery}
          compact={true}
        />
        
        {searchQuery && (
          <RelatedSuggestions 
            query={searchQuery}
            onSuggestionClick={handleSearch}
            searchService={searchService}
          />
        )}
      </div>
      
      {/* Unified Filter Bar */}
      <UnifiedFilterBar
        filters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={handleClearFilters}
        resultCount={searchResults.length}
        totalCount={searchService.datasets.length}
      />
      
      <div className="search-catalog-layout">
        {/* Mobile Filters */}
        <div className="mobile-filters">
          <FilterDrawer>
            <DatasetFilters
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />
          </FilterDrawer>
        </div>
        
        {/* Desktop Filters */}
        <div className="desktop-filters">
          <DatasetFilters
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>
        
        <div className="search-catalog-content">
          {/* View Controls Bar */}
          <div className="hdc-controls-bar">
            <div className="hdc-results-info">
              {searchResults.length === 0 ? (
                <span>No results found</span>
              ) : searchQuery ? (
                <span>
                  Found {searchResults.length} results for "{searchQuery}"
                </span>
              ) : (
                <span>
                  Showing {searchResults.length} datasets
                </span>
              )}
            </div>
            
            <ViewControls
              viewMode={viewMode}
              onViewChange={handleViewChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>
          
          <DatasetGrid
            datasets={searchResults}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchCatalog;