// src/components/detail/DatasetDetail.js
import React, { useState, useEffect } from "react";

const DatasetDetail = ({ dataset }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for transition effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [dataset?.id]);

  if (!dataset) {
    return (
      <div className="hdc-dataset-detail-empty">
        <p>No dataset selected. Please select a dataset from the catalog.</p>
      </div>
    );
  }

  // Get the color for community action area
  const getCategoryColor = (category) => {
    const colors = {
      "Promoting Healthy Child Development": "#FF6B6B",
      "Youth Development and Civic Engagement": "#4ECDC4",
      "Creating Protective Environments": "#45B7D1",
      "Strengthening Economic Supports for Children and Families": "#98D85B",
      "Access to Safe and Stable Housing": "#FFD166",
      "Demographic Data": "#6A0572",
    };
    return colors[category] || "#808080";
  };

  const categoryColor = getCategoryColor(dataset.communityActionArea);

  return (
    <div className="hdc-dataset-detail-wrapper">
      <div className={`hdc-dataset-detail ${isLoading ? "loading" : "loaded"}`}>
        {isLoading && (
          <div className="hdc-loading-overlay">
            <div className="hdc-loading-spinner"></div>
          </div>
        )}

        <div className="hdc-dataset-detail-header">
          <div
            className="hdc-community-category"
            style={{
              backgroundColor: `${categoryColor}20`,
              borderColor: categoryColor,
            }}
          >
            <span
              className="hdc-category-dot"
              style={{ backgroundColor: categoryColor }}
            ></span>
            <span className="hdc-category-label">
              {dataset.communityActionArea}
            </span>
          </div>
          <h1 className="hdc-dataset-detail-title">{dataset.name}</h1>
        </div>

        <div className="hdc-dataset-detail-content">
          <div className="hdc-dataset-detail-main">
            <div className="hdc-dataset-detail-section">
              <h2 className="hdc-section-title">Description</h2>
              <p className="hdc-dataset-detail-description">
                {dataset.description}
              </p>
            </div>

            <div className="hdc-dataset-detail-section">
              <h2 className="hdc-section-title">Dataset Information</h2>
              <div className="hdc-dataset-detail-info-grid">
                <div className="hdc-info-item">
                  <div className="hdc-info-label">Source</div>
                  <div className="hdc-info-value">{dataset.source}</div>
                </div>
                <div className="hdc-info-item">
                  <div className="hdc-info-label">Category</div>
                  <div className="hdc-info-value">{dataset.type}</div>
                </div>
                <div className="hdc-info-item">
                  <div className="hdc-info-label">Data Format</div>
                  <div className="hdc-info-value">{dataset.dataFormat}</div>
                </div>
                <div className="hdc-info-item">
                  <div className="hdc-info-label">Date Created</div>
                  <div className="hdc-info-value">{dataset.dateCreated}</div>
                </div>
                <div className="hdc-info-item">
                  <div className="hdc-info-label">Last Updated</div>
                  <div className="hdc-info-value">{dataset.dateUpdated}</div>
                </div>
                {dataset.dataTopic && (
                  <div className="hdc-info-item">
                    <div className="hdc-info-label">Data Topic</div>
                    <div className="hdc-info-value">{dataset.dataTopic}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="hdc-dataset-detail-section">
              <h2 className="hdc-section-title">Actions</h2>
              <div className="hdc-dataset-detail-actions">
                <a
                  href={dataset.pageUrl || "#"}
                  className="hdc-dataset-action-button hdc-view-button"
                  onClick={(e) => {
                    if (!dataset.pageUrl) e.preventDefault();
                  }}
                >
                  View Source Data
                </a>
                <button className="hdc-dataset-action-button hdc-secondary-button">
                  Download Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
