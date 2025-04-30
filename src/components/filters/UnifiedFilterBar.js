// components/filters/UnifiedFilterBar.js
import React, { useRef, useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";

const UnifiedFilterBar = ({ disabled = false }) => {
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

  // Apply disabled state class if needed
  const disabledClass = disabled ? "unified-filter-bar-disabled" : "";

  return (
    <div
      className={`unified-filter-bar ${disabledClass}`}
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
                onClick={() => !disabled && setSearchQuery("")}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setSearchQuery("");
                  }
                }}
                aria-label={`${
                  disabled ? "Search" : "Clear search"
                }: ${searchQuery}`}
                tabIndex={disabled ? "-1" : "0"}
                disabled={disabled}
                aria-disabled={disabled}
              >
                <span className="unified-filter-text">
                  Search: {searchQuery}
                </span>
                {!disabled && (
                  <span className="unified-filter-remove" aria-hidden="true">
                    ×
                  </span>
                )}
              </button>
            )}

            {activeFiltersList.map(({ category, value }, index) => (
              <button
                key={`${category}-${value}`}
                className="unified-filter-tag"
                onClick={() => !disabled && removeFilter(category, value)}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    removeFilter(category, value);
                  }
                }}
                aria-label={`${
                  disabled ? "" : "Remove filter "
                }${category}: ${value}`}
                tabIndex={disabled ? "-1" : "0"}
                disabled={disabled}
                aria-disabled={disabled}
              >
                <span className="unified-filter-text">
                  {category}: {value}
                </span>
                {!disabled && (
                  <span className="unified-filter-remove" aria-hidden="true">
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="unified-filter-right">
          {hasActiveFilters && !disabled && (
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
