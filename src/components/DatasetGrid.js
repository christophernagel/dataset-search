import React, { useCallback } from "react";
import DatasetCard from "./common/DatasetCard";
import { useWindowSize } from "../hooks/useWindowSize";
import { useView } from "../context/ViewContext";

const DatasetGrid = ({ datasets }) => {
  const { width } = useWindowSize();
  const { viewMode, selectDataset, isTransitioning } = useView();

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
        <div key={dataset.id}>
          <DatasetCard
            {...dataset}
            onSelectDataset={() => selectDataset(dataset)}
          />
        </div>
      ))}
    </div>
  );

  // Render list view
  const renderListView = () => (
    <ul className="datasets-list">
      {datasets.map((dataset) => (
        <li key={dataset.id} className="dataset-list-item">
          <DatasetCard
            {...dataset}
            onSelectDataset={() => selectDataset(dataset)}
          />
        </li>
      ))}
    </ul>
  );

  // Render detail view
  const renderDetailView = () => (
    <div className="datasets-detail">
      {datasets.map((dataset) => (
        <div key={dataset.id} className="dataset-detail-item">
          <DatasetCard
            {...dataset}
            onSelectDataset={() => selectDataset(dataset)}
          />
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
