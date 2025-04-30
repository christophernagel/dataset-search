import React, { useMemo } from "react";
import DatasetGrid from "./DatasetGrid";
import DatasetFilters from "./filters/DatasetFilters";
import FilterDrawer from "./filters/FilterDrawer";
import ActiveFiltersBar from "./ActiveFiltersBar";
import ViewControls from "./common/ViewControls";
import { useFilters } from "../context/FilterContext";
import { useView } from "../context/ViewContext";

// Extracted Filter Section Component
const FilterSection = ({ isMobile, isHidden, disabled }) => {
  const { activeFilters, setFilters } = useFilters();

  if (isHidden) return null;

  const FilterContent = (
    <DatasetFilters
      onFilterChange={setFilters}
      activeFilters={activeFilters}
      disabled={disabled}
    />
  );

  if (isMobile) {
    return (
      <div className="mobile-filters">
        <FilterDrawer disabled={disabled}>{FilterContent}</FilterDrawer>
      </div>
    );
  }

  return <div className="desktop-filters">{FilterContent}</div>;
};

const DatasetCatalog = ({ searchService }) => {
  const { activeFilters, searchQuery } = useFilters();
  const { viewMode, sortBy, selectedDataset, isTransitioning } = useView();

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
        <FilterSection
          isMobile={false}
          isHidden={false}
          disabled={selectedDataset}
        />
        <FilterSection
          isMobile={true}
          isHidden={false}
          disabled={selectedDataset}
        />

        <div className="hdc-catalog-content">
          {!selectedDataset && <ActiveFiltersBar />}

          <ViewControls
            viewMode={viewMode}
            sortBy={sortBy}
            resultCount={datasets.length}
            totalCount={searchService.datasets.length}
            searchQuery={searchQuery}
            isTransitioning={isTransitioning}
          />

          <DatasetGrid datasets={datasets} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(DatasetCatalog);
