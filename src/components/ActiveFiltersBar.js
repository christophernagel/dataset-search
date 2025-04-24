import React, { useState, useRef, useEffect } from "react";
import { useFilters } from "../context/FilterContext";

const ActiveFiltersBar = () => {
  const {
    activeFilters,
    searchQuery,
    removeFilter,
    setSearchQuery
  } = useFilters();
  
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showShadow, setShowShadow] = useState(false);
  const scrollContainerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Handle search input with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Check for horizontal scroll shadow
  const checkForOverflow = () => {
    const element = scrollContainerRef.current;
    if (element) {
      const hasOverflow = element.scrollWidth > element.clientWidth;
      const hasScroll = element.scrollLeft > 0 ||
        element.scrollLeft < element.scrollWidth - element.clientWidth;
      setShowShadow(hasOverflow && hasScroll);
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    requestAnimationFrame(checkForOverflow);
  };

  // Set up resize observer
  useEffect(() => {
    checkForOverflow();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(checkForOverflow);
    });

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Get active filters for display
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

  const activeFiltersList = getActiveFilters();

  // Handle keyboard navigation
  const handleFilterKeyDown = (e, index, category, value) => {
    const filterTags = document.querySelectorAll(".hdc-active-filter-tag");
    const lastIndex = filterTags.length - 1;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        removeFilter(category, value);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (index < lastIndex) {
          filterTags[index + 1].focus();
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (index > 0) {
          filterTags[index - 1].focus();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="hdc-active-filters-bar"
      role="region"
      aria-label="Search and active filters"
    >
      <span className="hdc-active-filters-label" id="active-filters-label">
        Active Filters:
      </span>
      
      {activeFiltersList.length === 0 ? (
        <span className="hdc-no-filters" aria-live="polite">
          None
        </span>
      ) : (
        <div
          className={`hdc-active-filters-scroll-container ${
            showShadow ? "show-shadow" : ""
          }`}
          role="group"
          aria-labelledby="active-filters-label"
        >
          <div
            className="hdc-active-filters-list"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {activeFiltersList.map(({ category, value }, index) => (
              <button
                key={`${category}-${value}`}
                className="hdc-active-filter-tag"
                onClick={() => removeFilter(category, value)}
                onKeyDown={(e) => handleFilterKeyDown(e, index, category, value)}
                aria-label={`Remove filter ${category}: ${value}`}
                tabIndex="0"
              >
                <span className="hdc-filter-tag-text">
                  {category}: {value}
                </span>
                <span className="hdc-filter-tag-remove" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="hdc-search-container">
        <input
          type="text"
          className="hdc-search-input"
          placeholder="Search datasets..."
          onChange={handleSearchChange}
          value={inputValue}
          aria-label="Search datasets"
        />
      </div>
    </div>
  );
};

export default React.memo(ActiveFiltersBar);