import React, { useCallback, useState, useEffect } from "react";
import DatasetCard from "./common/DatasetCard";
import DatasetDetail from "./detail/DatasetDetail";
import { useWindowSize } from "../hooks/useWindowSize";
import { useView } from "../context/ViewContext";

const DatasetGrid = ({ datasets, onDatasetSelect, onBackToCatalog }) => {
  const { viewMode } = useView();
  const { width } = useWindowSize();
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate grid columns based on viewport width
  const getGridColumns = useCallback(() => {
    // Get available width (accounting for sidebar width)
    const availableWidth = width - 320; // Subtract sidebar width

    // Determine minimum card width
    const minCardWidth = 300;

    // Calculate columns based on available space
    const columns = Math.max(1, Math.floor(availableWidth / minCardWidth));

    // Limit to a maximum of 4 columns
    return Math.min(columns, 4);
  }, [width]);

  // Handle dataset selection
  const handleSelectDataset = (dataset) => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(dataset);
      setIsTransitioning(false);

      // Notify parent component about this selection
      if (onDatasetSelect) {
        onDatasetSelect(dataset);
      }
    }, 300);
  };

  // Handle back to catalog
  const handleBackToCatalog = () => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(null);
      setIsTransitioning(false);

      // Notify parent component
      if (onBackToCatalog) {
        onBackToCatalog();
      }
    }, 300);
  };

  // If showing detail view
  if (selectedDataset) {
    return (
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
    );
  }

  // If no datasets match, show empty message
  if (datasets.length === 0) {
    return (
      <div className="hdc-dataset-grid-empty">
        <p>No datasets match the selected criteria.</p>
      </div>
    );
  }

  // Render grid view
  const renderGridView = () => (
    <div
      className="datasets-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
        gap: "16px",
      }}
    >
      {datasets.map((dataset) => (
        <div key={dataset.id} onClick={() => handleSelectDataset(dataset)}>
          <DatasetCard {...dataset} />
        </div>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <ul className="datasets-list">
      {datasets.map((dataset) => (
        <li
          key={dataset.id}
          className="dataset-list-item"
          onClick={() => handleSelectDataset(dataset)}
        >
          <DatasetCard {...dataset} />
        </li>
      ))}
    </ul>
  );

  // Render detail view
  const renderDetailView = () => (
    <div className="datasets-detail">
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className="dataset-detail-item"
          onClick={() => handleSelectDataset(dataset)}
        >
          <DatasetCard {...dataset} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`hdc-dataset-container ${viewMode}-view ${
        isTransitioning ? "transitioning" : ""
      }`}
    >
      {viewMode === "grid" && renderGridView()}
      {viewMode === "list" && renderListView()}
      {viewMode === "detail" && renderDetailView()}
    </div>
  );
};

export default React.memo(DatasetGrid);
