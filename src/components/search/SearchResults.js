// Inside SearchResults.js
import React from "react";
import DatasetGrid from "../DatasetGrid";
import DatasetFilters from "../filters/DatasetFilters";
import FilterDrawer from "../filters/FilterDrawer";
import UnifiedFilterBar from "../filters/UnifiedFilterBar";
import ViewControls from "../common/ViewControls";
import SearchBar from "../home/SearchBar";
import RelatedSuggestions from "./RelatedSuggestions";
import { useFilters } from "../../context/FilterContext";
import { useView } from "../../context/ViewContext";

const SearchResults = ({ searchService, onNavigateHome }) => {
  const {
    activeFilters,
    searchQuery,
    setSearchQuery,
    setFilters,
    removeFilter,
    clearFilters
  } = useFilters();
  
  const { viewMode, sortBy, setViewMode, setSortBy } = useView();

  // Get search results
  const searchResults = React.useMemo(() => {
    if (searchQuery.trim()) {
      return searchService.search(searchQuery, activeFilters);
    }
    return searchService.getFilteredDatasets(activeFilters);
  }, [searchService, searchQuery, activeFilters]);

  return (
    <div className="search-catalog">
      <div className="search-catalog-header">
        <SearchBar 
          onSearch={setSearchQuery} 
          initialQuery={searchQuery}
          compact={true}
        />
        
        {searchQuery && (
          <RelatedSuggestions 
            query={searchQuery}
            onSuggestionClick={setSearchQuery}
            searchService={searchService}
          />
        )}
      </div>
      
      <UnifiedFilterBar
        filters={activeFilters}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
      />
      
      <div className="search-catalog-layout">
        <div className="mobile-filters">
          <FilterDrawer>
            <DatasetFilters
              onFilterChange={setFilters}
              activeFilters={activeFilters}
            />
          </FilterDrawer>
        </div>
        
        <div className="desktop-filters">
          <DatasetFilters
            onFilterChange={setFilters}
            activeFilters={activeFilters}
          />
        </div>
        
        <div className="search-catalog-content">
          <ViewControls
            viewMode={viewMode}
            onViewChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={searchResults.length}
            searchQuery={searchQuery}
          />
          
          {searchResults.length === 0 ? (
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