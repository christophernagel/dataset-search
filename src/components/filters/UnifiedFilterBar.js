// components/filters/UnifiedFilterBar.js
import React, { useRef, useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";

const UnifiedFilterBar = () => {
  const {
    activeFilters,
    removeFilter,
    clearFilters,
    searchQuery,
    setSearchQuery,
  } = useFilters();

  const [isScrollable, setIsScrollable] = useState(false);
  const filtersContainerRef = useRef(null);

  const getActiveFilters = () => {
    const active = [];
    Object.entries(activeFilters).forEach(([category, values]) => {
      Object.entries(values).forEach(([value, isActive]) => {
        if (isActive) {
          active.push({ category, value });
        }
      });
    });
    return active;
  };

  // Check if filters are scrollable
  const checkScrollable = () => {
    if (filtersContainerRef.current) {
      const { scrollWidth, clientWidth } = filtersContainerRef.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  };

  // Check on mount and when active filters change
  useEffect(() => {
    checkScrollable();
    // Set up resize observer
    const observer = new ResizeObserver(() => {
      checkScrollable();
    });

    if (filtersContainerRef.current) {
      observer.observe(filtersContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeFilters, searchQuery]);

  const activeFiltersList = getActiveFilters();
  const hasActiveFilters = activeFiltersList.length > 0 || searchQuery;

  return (
    <div
      className="unified-filter-bar"
      role="region"
      aria-label="Active filters"
    >
      <div className="unified-filter-content">
        <div className="unified-filter-left">
          <span className="unified-filter-label" id="active-filters-label">
            Filters:
          </span>

          <div
            ref={filtersContainerRef}
            className={`unified-active-filters ${
              isScrollable ? "scrollable" : ""
            }`}
            role="group"
            aria-labelledby="active-filters-label"
            onScroll={checkScrollable}
          >
            {!hasActiveFilters && (
              <span className="unified-no-filters" aria-live="polite">
                None
              </span>
            )}

            {searchQuery && (
              <button
                className="unified-filter-tag unified-search-tag"
                onClick={() => setSearchQuery("")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSearchQuery("");
                  }
                }}
                aria-label={`Clear search: ${searchQuery}`}
                tabIndex="0"
              >
                <span className="unified-filter-text">
                  Search: {searchQuery}
                </span>
                <span className="unified-filter-remove" aria-hidden="true">
                  ×
                </span>
              </button>
            )}

            {activeFiltersList.map(({ category, value }, index) => (
              <button
                key={`${category}-${value}`}
                className="unified-filter-tag"
                onClick={() => removeFilter(category, value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removeFilter(category, value);
                  }
                }}
                aria-label={`Remove filter ${category}: ${value}`}
                tabIndex="0"
              >
                <span className="unified-filter-text">
                  {category}: {value}
                </span>
                <span className="unified-filter-remove" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="unified-filter-right">
          {hasActiveFilters && (
            <button
              className="unified-clear-button"
              onClick={clearFilters}
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UnifiedFilterBar);
