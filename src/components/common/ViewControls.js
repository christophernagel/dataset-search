import React from "react";
import { useView } from "../../context/ViewContext";

const ViewControls = ({
  viewMode,
  onViewChange,
  sortBy,
  onSortChange,
  resultCount,
  searchQuery,
  isTransitioning,
  selectedDataset,
  selectedAttribute,
  onBackToCatalog,
}) => {
  /* view title helper */
  const getTitle = () => {
    if (selectedDataset) return "Dataset Information";
    if (selectedAttribute) {
      const t = selectedAttribute.type.replace(/([A-Z])/g, " $1");
      return `${t.charAt(0).toUpperCase() + t.slice(1)} Information`;
    }
    if (searchQuery) return `Found ${resultCount} results for “${searchQuery}”`;
    return `Showing ${resultCount} datasets`;
  };

  const isDetailView = Boolean(selectedDataset || selectedAttribute);

  return (
    <div
      className={`hdc-controls-section ${
        isTransitioning ? "transitioning" : ""
      } ${isDetailView ? "detail-mode" : ""}`}
      role="region"
      aria-label={isDetailView ? "Detail view controls" : "View controls"}
    >
      <div className="hdc-controls-header">
        <div className="hdc-controls-left">
          <div className="hdc-results-info">{getTitle()}</div>
        </div>

        <div className="hdc-controls-right">
          {isDetailView ? (
            <button
              className="hdc-back-button"
              onClick={onBackToCatalog}
              aria-label="Back to catalog"
            >
              {/* simple chevron icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Catalog
            </button>
          ) : (
            <>
              <span className="hdc-sort-label">Sort by:</span>
              <select
                className="hdc-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date updated</option>
                <option value="name">Name</option>
              </select>

              <div className="hdc-display-controls">
                <button
                  className={`hdc-view-button ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => onViewChange("grid")}
                  aria-pressed={viewMode === "grid"}
                >
                  {/* grid icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>

                <button
                  className={`hdc-view-button ${
                    viewMode === "detail" ? "active" : ""
                  }`}
                  onClick={() => onViewChange("detail")}
                  aria-pressed={viewMode === "detail"}
                >
                  {/* list icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewControls;
