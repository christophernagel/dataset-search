import React, { useState } from "react";
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
    clearFilters,
  } = useFilters();

  const { viewMode, sortBy, setViewMode, setSortBy } = useView();

  // New state for handling selected dataset and transitions
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle dataset selection
  const handleSelectDataset = (dataset) => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(dataset);
      setIsTransitioning(false);
    }, 300);
  };

  // Handle back to catalog
  const handleBackToCatalog = () => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(null);
      setIsTransitioning(false);
    }, 300);
  };

  // Get search results
  const searchResults = React.useMemo(() => {
    if (searchQuery.trim()) {
      return searchService.search(searchQuery, activeFilters);
    }
    return searchService.getFilteredDatasets(activeFilters);
  }, [searchService, searchQuery, activeFilters]);

  return (
    <div className={`search-catalog ${selectedDataset ? "detail-mode" : ""}`}>
      <div
        className={`search-catalog-header ${selectedDataset ? "hidden" : ""}`}
      >
        <SearchBar
          onSearch={setSearchQuery}
          initialQuery={searchQuery}
          compact={true}
        />
      </div>

      <UnifiedFilterBar
        filters={activeFilters}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
        className={selectedDataset ? "hidden" : ""}
      />

      <div className="search-catalog-layout">
        <div className={`mobile-filters ${selectedDataset ? "hidden" : ""}`}>
          <FilterDrawer>
            <DatasetFilters
              onFilterChange={setFilters}
              activeFilters={activeFilters}
            />
          </FilterDrawer>
        </div>

        <div className={`desktop-filters ${selectedDataset ? "hidden" : ""}`}>
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
            selectedDataset={selectedDataset}
            onBackToCatalog={handleBackToCatalog}
            isTransitioning={isTransitioning}
          />

          {searchResults.length === 0 && !selectedDataset ? (
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
              <button className="back-to-home-button" onClick={onNavigateHome}>
                Back to Home
              </button>
            </div>
          ) : (
            <DatasetGrid
              datasets={searchResults}
              viewMode={viewMode}
              onSelectDataset={handleSelectDataset}
              selectedDataset={selectedDataset}
              onBackToCatalog={handleBackToCatalog}
              isTransitioning={isTransitioning}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
