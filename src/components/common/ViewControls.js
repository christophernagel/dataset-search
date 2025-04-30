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
}) => {
  const { selectedDataset, clearSelectedDataset } = useView();

  // Standard view controls structure - same container for both modes
  return (
    <div
      className={`hdc-controls-section ${
        isTransitioning ? "transitioning" : ""
      } ${selectedDataset ? "detail-mode" : ""}`}
      role="region"
      aria-label={selectedDataset ? "Dataset detail controls" : "View controls"}
    >
      <div className="hdc-controls-header">
        <div className="hdc-controls-left">
          {selectedDataset ? (
            <div className="hdc-results-info">Dataset Information</div>
          ) : (
            <div className="hdc-results-info">
              {searchQuery
                ? `Found ${resultCount} results for "${searchQuery}"`
                : `Showing ${resultCount} datasets`}
            </div>
          )}
        </div>

        <div className="hdc-controls-right">
          {selectedDataset ? (
            <button
              className="hdc-back-button"
              onClick={clearSelectedDataset}
              aria-label="Back to dataset catalog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "8px" }}
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Catalog
            </button>
          ) : (
            <>
              <span className="hdc-sort-label">Sort by:</span>
              <select
                className="hdc-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort datasets by"
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
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button
                  className={`hdc-view-button ${
                    viewMode === "detail" ? "active" : ""
                  }`}
                  onClick={() => onViewChange("detail")}
                  aria-label="Detailed view"
                  aria-pressed={viewMode === "detail"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
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
