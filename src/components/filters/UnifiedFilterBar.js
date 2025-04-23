// src/components/filters/UnifiedFilterBar.js
import React from "react";

const UnifiedFilterBar = ({ 
  filters, 
  onRemoveFilter, 
  onClearFilters,
  resultCount,
  totalCount
}) => {
  const getActiveFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([category, values]) => {
      Object.entries(values).forEach(([value, isActive]) => {
        if (isActive) {
          active.push({ category, value });
        }
      });
    });
    return active;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

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
          
          {hasActiveFilters ? (
            <div 
              className="unified-active-filters"
              role="group"
              aria-labelledby="active-filters-label"
            >
              {activeFilters.map(({ category, value }, index) => (
                <button
                  key={`${category}-${value}`}
                  className="unified-filter-tag"
                  onClick={() => onRemoveFilter(category, value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRemoveFilter(category, value);
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
          ) : (
            <span className="unified-no-filters" aria-live="polite">
              None
            </span>
          )}
        </div>
        
        <div className="unified-filter-right">
          {hasActiveFilters && (
            <button 
              className="unified-clear-filters"
              onClick={onClearFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
          
          <div className="unified-result-count">
            {resultCount} of {totalCount} datasets
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedFilterBar;