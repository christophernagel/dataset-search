import React from "react";
import DatasetGrid from "../DatasetGrid";
import DatasetFilters from "../filters/DatasetFilters";
import FilterDrawer from "../filters/FilterDrawer";
import UnifiedFilterBar from "../filters/UnifiedFilterBar";
import ViewControls from "../common/ViewControls";
import SearchBar from "../home/SearchBar";
import DatasetDetail from "../detail/DatasetDetail";
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

  const {
    viewMode,
    sortBy,
    setViewMode,
    setSortBy,
    selectedDataset,
    clearSelectedDataset,
    isTransitioning,
  } = useView();

  // Get search results
  const searchResults = React.useMemo(() => {
    if (searchQuery.trim()) {
      return searchService.search(searchQuery, activeFilters);
    }
    return searchService.getFilteredDatasets(activeFilters);
  }, [searchService, searchQuery, activeFilters]);

  // When an attribute is clicked in the detail view, 
  // we need to go back to the catalog view
  const handleDetailAttributeClick = () => {
    clearSelectedDataset();
  };

  return (
    <div className="search-catalog">
      {/* Header with search bar - always visible */}
      <div className="search-catalog-header">
        <SearchBar
          onSearch={setSearchQuery}
          initialQuery={searchQuery}
          compact={true}
          disabled={!!selectedDataset}
        />
      </div>

      {/* Unified filter bar - always visible but disabled in detail view */}
      <UnifiedFilterBar disabled={!!selectedDataset} />

      <div className="search-catalog-layout">
        {/* Left sidebar with filters - always present in structure */}
        <div className="mobile-filters">
          <FilterDrawer disabled={!!selectedDataset}>
            <DatasetFilters
              onFilterChange={setFilters}
              activeFilters={activeFilters}
              disabled={!!selectedDataset}
            />
          </FilterDrawer>
        </div>

        <div className="desktop-filters">
          <DatasetFilters
            onFilterChange={setFilters}
            activeFilters={activeFilters}
            disabled={!!selectedDataset}
          />
        </div>

        {/* Main content area */}
        <div className="search-catalog-content">
          {/* View controls - shows either dataset controls or catalog controls */}
          <ViewControls
            viewMode={viewMode}
            onViewChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={searchResults.length}
            searchQuery={searchQuery}
            isTransitioning={isTransitioning}
            selectedDataset={selectedDataset}
            onBackToCatalog={clearSelectedDataset}
          />

          {/* Content - either the dataset grid or dataset detail */}
          {selectedDataset ? (
            <div
              className={`hdc-dataset-container detail-view ${
                isTransitioning ? "transitioning" : ""
              }`}
              onClick={handleDetailAttributeClick}
            >
              <DatasetDetail dataset={selectedDataset} />
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
              <button className="back-to-home-button" onClick={onNavigateHome}>
                Back to Home
              </button>
            </div>
          ) : (
            <DatasetGrid datasets={searchResults} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;