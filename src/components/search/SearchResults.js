// src/components/search/SearchResults.js
import React, { useState, useEffect } from "react";
import DatasetGrid from "../DatasetGrid";
import DatasetFilters from "../filters/DatasetFilters";
import FilterDrawer from "../filters/FilterDrawer";
import UnifiedFilterBar from "../filters/UnifiedFilterBar";
import ViewControls from "../common/ViewControls";
import SearchBar from "../home/SearchBar";
import RelatedSuggestions from "./RelatedSuggestions";

const SearchResults = ({ searchService, initialQuery = "", onNavigateHome }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");

  // Perform search when query or filters change
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, activeFilters);
    } else {
      // If no query, show all datasets
      const datasets = searchService.getFilteredDatasets(activeFilters);
      setSearchResults(datasets);
    }
  }, [searchQuery, activeFilters, searchService]);

  // Handle search execution
  const performSearch = (query, filters) => {
    setLoading(true);
    try {
      // Use the SearchService to get search results
      const results = searchService.search(query, filters);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  // Handle new search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleRemoveFilter = (category, value) => {
    const newFilters = { ...activeFilters };
    if (newFilters[category]) {
      delete newFilters[category][value];
      if (Object.keys(newFilters[category]).length === 0) {
        delete newFilters[category];
      }
    }
    setActiveFilters(newFilters);
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
      // For relevance, results are already sorted by the search service
      // But make sure items with relevanceScore come first
      sortedResults.sort((a, b) => {
        if (a.relevanceScore !== undefined && b.relevanceScore !== undefined) {
          return b.relevanceScore - a.relevanceScore;
        }
        return a.relevanceScore !== undefined ? -1 : 1;
      });
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
        totalCount={searchService.datasets ? searchService.datasets.length : 0}
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
              {loading ? (
                <span>Searching...</span>
              ) : searchResults.length === 0 ? (
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
          
          {/* Show results or loading state */}
          {loading ? (
            <div className="hdc-search-loading">
              <p>Searching for datasets...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="hdc-search-no-results">
              <h2>No datasets found</h2>
              <p>
                {searchQuery
                  ? `Your search for "${searchQuery}" did not match any datasets.`
                  : "Please enter a search term to find datasets."}
              </p>
              <div className="hdc-search-suggestions">
                <h3>Suggestions:</h3>
                <ul>
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try different keywords</li>
                  <li>Browse all datasets by category</li>
                </ul>
              </div>
              <button 
                className="back-to-home-button"
                onClick={onNavigateHome}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <DatasetGrid 
              datasets={searchResults}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;