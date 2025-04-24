import React, { useCallback } from "react";
import DatasetCard from "./common/DatasetCard";
import { useWindowSize } from "../hooks/useWindowSize";
import { useView } from "../context/ViewContext";

const ITEMS_PER_PAGE = 20;

const DatasetGrid = ({ datasets }) => {
  const { viewMode } = useView();
  const { width } = useWindowSize();

  // If no datasets match, show empty message
  if (datasets.length === 0) {
    return (
      <div className="hdc-dataset-grid-empty">
        <p>No datasets match the selected criteria.</p>
      </div>
    );
  }

  // Calculate grid columns based on viewport width
  const getGridColumns = useCallback(() => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  }, [width]);

  // Group datasets by Community Action Area
  const groupedDatasets = {};
  datasets.forEach((dataset) => {
    const area = dataset.communityActionArea || "Other";
    if (!groupedDatasets[area]) {
      groupedDatasets[area] = [];
    }
    groupedDatasets[area].push(dataset);
  });

  // Sort areas by predefined order
  const areaOrder = [
    "Promoting Healthy Child Development",
    "Youth Development and Civic Engagement",
    "Creating Protective Environments",
    "Strengthening Economic Supports for Children and Families",
    "Access to Safe and Stable Housing",
    "Demographic Data",
    "Other",
  ];

  const sortedAreas = Object.keys(groupedDatasets).sort((a, b) => {
    const indexA = areaOrder.indexOf(a);
    const indexB = areaOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  // Get color for community action area
  const getAreaColor = (area) => {
    const colors = {
      "Promoting Healthy Child Development": "#FF6B6B",
      "Youth Development and Civic Engagement": "#4ECDC4",
      "Creating Protective Environments": "#45B7D1",
      "Strengthening Economic Supports for Children and Families": "#98D85B",
      "Access to Safe and Stable Housing": "#FFD166",
      "Demographic Data": "#6A0572",
    };
    return colors[area] || "#808080";
  };

  // Render grid view
  const renderGridView = (datasets) => (
    <div 
      className="datasets-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
        gap: '16px'
      }}
    >
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} {...dataset} />
      ))}
    </div>
  );

  // Render list view
  const renderListView = (datasets) => (
    <ul className="datasets-list">
      {datasets.map((dataset) => (
        <li key={dataset.id} className="dataset-list-item">
          <DatasetCard {...dataset} />
        </li>
      ))}
    </ul>
  );

  // Render detail view
  const renderDetailView = (datasets) => (
    <div className="datasets-detail">
      {datasets.map((dataset) => (
        <div key={dataset.id} className="dataset-detail-item">
          <DatasetCard {...dataset} />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`hdc-dataset-container ${viewMode}-view`}>
      {sortedAreas.map((area) => (
        <div key={area} className="dataset-category-section">
          <h2
            className="category-header"
            data-area={area}
            style={{
              borderLeftColor: getAreaColor(area),
            }}
          >
            {area}
          </h2>

          {viewMode === "grid" && renderGridView(groupedDatasets[area])}
          {viewMode === "list" && renderListView(groupedDatasets[area])}
          {viewMode === "detail" && renderDetailView(groupedDatasets[area])}
        </div>
      ))}
    </div>
  );
};

export default React.memo(DatasetGrid);