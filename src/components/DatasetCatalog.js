import React, { useMemo, useState } from "react";
import DatasetGrid from "./DatasetGrid";
import DatasetFilters from "./filters/DatasetFilters";
import FilterDrawer from "./filters/FilterDrawer";
import ActiveFiltersBar from "./ActiveFiltersBar";
import ViewControls from "./common/ViewControls";
import DatasetDetail from "./detail/DatasetDetail";
import { useFilters } from "../context/FilterContext";
import { useView } from "../context/ViewContext";

// Extracted Filter Section Component
const FilterSection = ({ isMobile, isHidden }) => {
  const { activeFilters, setFilters } = useFilters();

  if (isHidden) return null;

  const FilterContent = (
    <DatasetFilters onFilterChange={setFilters} activeFilters={activeFilters} />
  );

  if (isMobile) {
    return (
      <div className="mobile-filters">
        <FilterDrawer>{FilterContent}</FilterDrawer>
      </div>
    );
  }

  return <div className="desktop-filters">{FilterContent}</div>;
};

// Extracted Controls Bar Component
const ControlsBar = ({
  resultCount,
  totalCount,
  searchQuery,
  selectedDataset,
  onBackToCatalog,
  isTransitioning,
}) => {
  const { viewMode, sortBy, setViewMode, setSortBy } = useView();

  return (
    <div className="hdc-controls-bar">
      <ViewControls
        viewMode={viewMode}
        onViewChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={resultCount}
        totalCount={totalCount}
        searchQuery={searchQuery}
        selectedDataset={selectedDataset}
        onBackToCatalog={onBackToCatalog}
        isTransitioning={isTransitioning}
      />
    </div>
  );
};

const DatasetCatalog = ({ searchService }) => {
  const { activeFilters, searchQuery } = useFilters();
  const { viewMode, sortBy } = useView();

  // State for dataset selection and transitions
  // This is now the single source of truth for the selected dataset
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handler for selecting a dataset
  const handleSelectDataset = (dataset) => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(dataset);
      setIsTransitioning(false);
    }, 300);
  };

  // Handler for returning to catalog view
  const handleBackToCatalog = () => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(null);
      setIsTransitioning(false);
    }, 300);
  };

  // Memoize filtered and sorted datasets
  const datasets = useMemo(() => {
    let results = searchQuery
      ? searchService.search(searchQuery, activeFilters)
      : searchService.getFilteredDatasets(activeFilters);

    if (sortBy === "date") {
      results = [...results].sort((a, b) => {
        const dateA = a.dateUpdated ? new Date(a.dateUpdated) : new Date(0);
        const dateB = b.dateUpdated ? new Date(b.dateUpdated) : new Date(0);
        return dateB - dateA;
      });
    } else if (sortBy === "name") {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [searchService, searchQuery, activeFilters, sortBy]);

  return (
    <div
      className={`hdc-dataset-catalog ${selectedDataset ? "detail-mode" : ""}`}
    >
      <div className="hdc-catalog-layout">
        <FilterSection isMobile={false} isHidden={selectedDataset} />
        <FilterSection isMobile={true} isHidden={selectedDataset} />

        <div className="hdc-catalog-content">
          {!selectedDataset && <ActiveFiltersBar />}

          <ControlsBar
            resultCount={datasets.length}
            totalCount={searchService.datasets.length}
            searchQuery={searchQuery}
            selectedDataset={selectedDataset}
            onBackToCatalog={handleBackToCatalog}
            isTransitioning={isTransitioning}
          />

          {selectedDataset ? (
            <div
              className={`hdc-dataset-container detail-mode ${
                isTransitioning ? "transitioning" : ""
              }`}
            >
              <DatasetDetail
                dataset={selectedDataset}
                onBackToCatalog={handleBackToCatalog}
              />
            </div>
          ) : (
            <DatasetGrid
              datasets={datasets}
              viewMode={viewMode}
              onSelectDataset={handleSelectDataset}
              isTransitioning={isTransitioning}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DatasetCatalog);
