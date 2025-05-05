import React, { useState, useEffect } from "react";
import { useFilters } from "../../context/FilterContext";

const DatasetDetail = ({ dataset }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setFilterByAttribute, filterMappings } = useFilters();

  /* ---------- loading transition ---------- */
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [dataset?.id]);

  /* ---------- early‐exit when nothing is selected ---------- */
  if (!dataset) {
    return (
      <div className="hdc-dataset-detail-empty">
        <p>No dataset selected. Please select a dataset from the catalog.</p>
      </div>
    );
  }

  /* ---------- helpers ---------- */
  const handleAttributeClick = (field, value, e) => {
    e.preventDefault();
    setFilterByAttribute(field, value);
  };

  const isFilterable = (field) => Boolean(filterMappings[field]);

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

  const renderInfoItem = (label, field, value) => {
    if (!value) return null;

    const filterable = isFilterable(field);
    const interactiveProps = filterable
      ? {
          onClick: (e) => handleAttributeClick(field, value, e),
          role: "button",
          tabIndex: 0,
          "aria-label": `Filter catalog by ${label}: ${value}`,
        }
      : {};

    return (
      <div
        className={`hdc-info-item ${filterable ? "filterable" : ""}`}
        {...interactiveProps}
      >
        <div className="hdc-info-label">{label}</div>
        <div className="hdc-info-value">{value}</div>
      </div>
    );
  };

  /* ---------- render ---------- */
  return (
    <div className="hdc-dataset-detail-wrapper">
      <div className={`hdc-dataset-detail ${isLoading ? "loading" : "loaded"}`}>
        {isLoading && (
          <div className="hdc-loading-overlay">
            <div className="hdc-loading-spinner" />
          </div>
        )}

        {/* ----- header ----- */}
        <div className="hdc-dataset-detail-header">
          <div
            className={`hdc-community-category ${
              isFilterable("communityActionArea") ? "filterable" : ""
            }`}
            style={{
              backgroundColor: `${categoryColor}20`,
              borderColor: categoryColor,
            }}
            {...(isFilterable("communityActionArea")
              ? {
                  onClick: (e) =>
                    handleAttributeClick(
                      "communityActionArea",
                      dataset.communityActionArea,
                      e
                    ),
                  role: "button",
                  tabIndex: 0,
                  "aria-label": `Filter catalog by Community Action Area: ${dataset.communityActionArea}`,
                }
              : {})}
          >
            <span
              className="hdc-category-dot"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="hdc-category-label">
              {dataset.communityActionArea}
            </span>
          </div>

          <h1 className="hdc-dataset-detail-title">{dataset.name}</h1>
        </div>

        {/* ----- main content ----- */}
        <div className="hdc-dataset-detail-content">
          <div className="hdc-dataset-detail-main">
            {/* description */}
            <section className="hdc-dataset-detail-section">
              <h2 className="hdc-section-title">Description</h2>
              <p className="hdc-dataset-detail-description">
                {dataset.description}
              </p>
            </section>

            {/* info grid */}
            <section className="hdc-dataset-detail-section">
              <h2 className="hdc-section-title">Dataset Information</h2>
              <div className="hdc-dataset-detail-info-grid">
                {renderInfoItem("Source", "source", dataset.source)}
                {renderInfoItem("Category", "type", dataset.type)}
                {renderInfoItem("Data Format", "dataFormat", dataset.dataFormat)}
                {renderInfoItem("Data Topic", "dataTopic", dataset.dataTopic)}
                {renderInfoItem("Date Created", "dateCreated", dataset.dateCreated)}
                {renderInfoItem("Last Updated", "dateUpdated", dataset.dateUpdated)}
              </div>
            </section>

            {/* actions */}
            <section className="hdc-dataset-detail-section">
              <h2 className="hdc-section-title">Actions</h2>
              <div className="hdc-dataset-detail-actions">
                <a
                  href={dataset.pageUrl || "#"}
                  className="hdc-dataset-action-button hdc-view-button"
                  onClick={(e) => {
                    if (!dataset.pageUrl) e.preventDefault();
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Source Data
                </a>
                <button className="hdc-dataset-action-button hdc-secondary-button">
                  Download Dataset
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
