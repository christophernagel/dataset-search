// src/components/DatasetGrid.js
import React from "react";
import DatasetCard from "./common/DatasetCard";

// Color mapping for Community Action Areas
const communityActionAreaColors = {
  "Promoting Healthy Child Development": "#FF6B6B",
  "Youth Development and Civic Engagement": "#4ECDC4",
  "Creating Protective Environments": "#45B7D1",
  "Strengthening Economic Supports for Children and Families": "#98D85B",
  "Access to Safe and Stable Housing": "#FFD166",
  "Demographic Data": "#6A0572",
};

const DatasetGrid = ({ datasets, viewMode = "grid" }) => {
  // If no datasets match, show empty message
  if (datasets.length === 0) {
    return (
      <div className="hdc-dataset-grid-empty">
        <p>No datasets match the selected criteria.</p>
      </div>
    );
  }

  // For search results, don't group by area if there's a search query
  // We'll assume that if any dataset has a relevanceScore, we're in search mode
  const isSearchMode = datasets.some(dataset => 'relevanceScore' in dataset);

  if (isSearchMode) {
    return (
      <div className={`hdc-dataset-container ${viewMode}-view`}>
        <div className="dataset-category-section">
          <h2 className="category-header search-results-header">
            Search Results
          </h2>

          {viewMode === "grid" && (
            <div className="datasets-grid">
              {datasets.map((dataset) => (
                <DatasetCard key={dataset.id} {...dataset} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <ul className="datasets-list">
              {datasets.map((dataset) => (
                <li key={dataset.id} className="dataset-list-item">
                  <DatasetCard {...dataset} />
                </li>
              ))}
            </ul>
          )}

          {viewMode === "detail" && (
            <div className="datasets-detail">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="dataset-detail-item">
                  <DatasetCard {...dataset} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If not search mode, group by community action area (original behavior)
  // Group datasets by Community Action Area
  const groupedDatasets = {};
  datasets.forEach((dataset) => {
    const area = dataset.communityActionArea || "Other";
    if (!groupedDatasets[area]) {
      groupedDatasets[area] = [];
    }
    groupedDatasets[area].push(dataset);
  });

  // Community Action Areas order
  const areaOrder = [
    "Promoting Healthy Child Development",
    "Youth Development and Civic Engagement",
    "Creating Protective Environments",
    "Strengthening Economic Supports for Children and Families",
    "Access to Safe and Stable Housing",
    "Demographic Data",
    "Other",
  ];

  // Sort sections by the defined order
  const sortedAreas = Object.keys(groupedDatasets).sort((a, b) => {
    const indexA = areaOrder.indexOf(a);
    const indexB = areaOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return (
    <div className={`hdc-dataset-container ${viewMode}-view`}>
      {sortedAreas.map((area) => (
        <div key={area} className="dataset-category-section">
          <h2
            className="category-header"
            data-area={area}
            style={{
              borderLeftColor: communityActionAreaColors[area] || "#808080",
            }}
          >
            {area}
          </h2>

          {viewMode === "grid" && (
            <div className="datasets-grid">
              {groupedDatasets[area].map((dataset) => (
                <DatasetCard key={dataset.id} {...dataset} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <ul className="datasets-list">
              {groupedDatasets[area].map((dataset) => (
                <li key={dataset.id} className="dataset-list-item">
                  <DatasetCard {...dataset} />
                </li>
              ))}
            </ul>
          )}

          {viewMode === "detail" && (
            <div className="datasets-detail">
              {groupedDatasets[area].map((dataset) => (
                <div key={dataset.id} className="dataset-detail-item">
                  <DatasetCard {...dataset} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DatasetGrid;