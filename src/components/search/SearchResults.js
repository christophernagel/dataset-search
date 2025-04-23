import React, { useState, useEffect } from "react";
import { SearchService } from "../services/SearchService";
import DatasetGrid from "./DatasetGrid";
import UnifiedFilterBar from "./filters/UnifiedFilterBar";
import ViewControls from "./common/ViewControls";

const SearchResults = ({ initialQuery = "" }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [availableFilters, setAvailableFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [resultsStats, setResultsStats] = useState({
    total: 0,
    filtered: 0
  });

  // Effect to perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      // If no query, show all datasets (or featured ones)
      setSearchResults([]);
      // You might want to fetch all datasets or featured ones here
    }
  }, [searchQuery]);

  // Handle search execution
  const performSearch = async (query) => {
    setLoading(true);
    try {
      // Use the SearchService to get search results
      const results = await SearchService.search(query);
      
      // Process search results
      setSearchResults(results);
      
      // Generate available filters based on results
      const filters = SearchService.generateFiltersFromResults(results);
      setAvailableFilters(filters);
      
      // Update stats
      setResultsStats({
        total: results.length,
        filtered: results.length
      });
    } catch (error) {
      console.error("Search error:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    
    // Apply filters to search results
    const filtered = searchResults.filter(result => 
      SearchService.matchesFilters(result, newFilters)
    );
    
    // Update stats
    setResultsStats({
      ...resultsStats,
      filtered: filtered.length
    });
  };

  // Handle search query updates
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Handle view mode changes
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // Handle sort changes
  const handleSortChange = (sort) => {
    setSortBy(sort);
    
    // Sort the results
    const sorted = [...searchResults].sort((a, b) => {
      if (sort === "relevance") {
        return b.relevanceScore - a.relevanceScore;
      } else if (sort === "date") {
        return new Date(b.dateUpdated || 0) - new Date(a.dateUpdated || 0);
      } else if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    setSearchResults(sorted);
  };

  // Filter search results based on active filters
  const getFilteredResults = () => {
    if (Object.keys(activeFilters).length === 0) {
      return searchResults;
    }
    
    return searchResults.filter(result => 
      SearchService.matchesFilters(result, activeFilters)
    );
  };

  return (
    <div className="hdc-search-results">
      <div className="hdc-search-results-layout">
        {/* Sidebar filters */}
        <div className="hdc-search-filters-sidebar">
          {/* Once you have filter components ready */}
          {/* <SearchFilters 
            availableFilters={availableFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          /> */}
        </div>
        
        <div className="hdc-search-results-content">
          {/* Search bar with query */}
          <div className="hdc-search-header">
            <UnifiedFilterBar 
              filters={activeFilters}
              onRemoveFilter={(category, value) => {
                const newFilters = { ...activeFilters };
                if (newFilters[category]) {
                  delete newFilters[category][value];
                  if (Object.keys(newFilters[category]).length === 0) {
                    delete newFilters[category];
                  }
                }
                setActiveFilters(newFilters);
              }}
              onSearch={handleSearchChange}
              searchQuery={searchQuery}
            />
          </div>
          
          {/* Results info and view controls */}
          <div className="hdc-search-controls-bar">
            <div className="hdc-results-info">
              {loading ? (
                "Searching..."
              ) : (
                `${resultsStats.filtered} ${
                  resultsStats.filtered === 1 ? "dataset" : "datasets"
                } found${
                  searchQuery ? ` for "${searchQuery}"` : ""
                }`
              )}
            </div>
            
            <ViewControls 
              viewMode={viewMode}
              onViewChange={handleViewChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              sortOptions={[
                { value: "relevance", label: "Relevance" },
                { value: "date", label: "Date updated" },
                { value: "name", label: "Name" }
              ]}
            />
          </div>
          
          {/* Show results or loading state */}
          {loading ? (
            <div className="hdc-search-loading">
              <p>Searching for datasets...</p>
              {/* You could add a spinner here */}
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
            </div>
          ) : (
            <DatasetGrid 
              datasets={getFilteredResults()}
              viewMode={viewMode}
              showRelevance={sortBy === "relevance" && searchQuery.trim() !== ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;