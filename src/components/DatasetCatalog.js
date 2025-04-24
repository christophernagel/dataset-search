import React, { useMemo } from "react";
import DatasetGrid from "./DatasetGrid";
import DatasetFilters from "./filters/DatasetFilters";
import FilterDrawer from "./filters/FilterDrawer";
import ActiveFiltersBar from "./ActiveFiltersBar";
import ViewControls from "./common/ViewControls";
import { useFilters } from "../context/FilterContext";
import { useView } from "../context/ViewContext";

// Extracted Filter Section Component
const FilterSection = ({ isMobile }) => {
  const { activeFilters, setFilters } = useFilters();

  const FilterContent = (
    <DatasetFilters
      onFilterChange={setFilters}
      activeFilters={activeFilters}
    />
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
const ControlsBar = ({ resultCount, totalCount }) => {
  const { viewMode, sortBy, setViewMode, setSortBy } = useView();

  return (
    <div className="hdc-controls-bar">
      <div className="hdc-results-info">
        {resultCount} of {totalCount} datasets
      </div>

      <ViewControls
        viewMode={viewMode}
        onViewChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
};

const DatasetCatalog = ({ searchService }) => {
  const { activeFilters, searchQuery } = useFilters();
  const { viewMode, sortBy } = useView();

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
    <div className="hdc-dataset-catalog">
      <div className="hdc-catalog-layout">
        <FilterSection isMobile={false} />
        <FilterSection isMobile={true} />

        <div className="hdc-catalog-content">
          <ActiveFiltersBar />
          
          <ControlsBar
            resultCount={datasets.length}
            totalCount={searchService.datasets.length}
          />

          <DatasetGrid
            datasets={datasets}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(DatasetCatalog);