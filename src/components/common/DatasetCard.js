// src/components/common/DatasetCard.js
import React from "react";

// Color coding for Community Action Areas
const communityActionAreaColors = {
  "Promoting Healthy Child Development": "#FF6B6B", // Red
  "Youth Development and Civic Engagement": "#4ECDC4", // Teal
  "Creating Protective Environments": "#45B7D1", // Blue
  "Strengthening Economic Supports for Children and Families": "#98D85B", // Green
  "Access to Safe and Stable Housing": "#FFD166", // Yellow
  "Demographic Data": "#6A0572", // Purple
};

const DatasetCard = ({
  id,
  name,
  description,
  type,
  communityActionArea,
  dataTopic,
  dataFormat,
  source,
  dateUpdated,
  dateCreated,
  pageUrl,
  // New props for search results
  relevanceScore,
  matchedFields,
  // New prop for handling selection
  onSelectDataset,
}) => {
  // Get the color for community action area if available
  const areaColor = communityActionAreaColors[communityActionArea] || "#808080";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onSelectDataset) {
        onSelectDataset();
      } else if (pageUrl) {
        window.open(pageUrl, "_self");
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (onSelectDataset) {
      onSelectDataset();
    }
  };

  // Relevance indicator for search results
  const renderRelevanceIndicator = () => {
    if (relevanceScore === undefined) return null;

    return (
      <div
        className="hdc-relevance-indicator"
        title={`Relevance: ${Math.round(relevanceScore * 100)}%`}
      >
        <div
          className="hdc-relevance-bar"
          style={{ width: `${Math.round(relevanceScore * 100)}%` }}
          aria-label={`Relevance score: ${Math.round(relevanceScore * 100)}%`}
        />
      </div>
    );
  };

  // Matched fields indicator
  const renderMatchedFields = () => {
    if (!matchedFields || matchedFields.length === 0) return null;

    return (
      <div className="hdc-matched-fields">
        <span className="hdc-matched-label">Matched:</span>
        {matchedFields.map((field) => (
          <span key={field} className="hdc-matched-field">
            {field}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className="hdc-dataset-card"
      tabIndex={onSelectDataset || pageUrl ? "0" : "-1"}
      role={onSelectDataset || pageUrl ? "button" : "article"}
      aria-label={onSelectDataset ? `View details for ${name}` : undefined}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {renderRelevanceIndicator()}

      <div className="hdc-dataset-content">
        {/* Community Action Area indicator */}
        <div className="hdc-community-action-area">
          <span
            className="hdc-area-dot"
            style={{ backgroundColor: areaColor }}
            aria-hidden="true"
          ></span>
          <span className="hdc-area-label">{communityActionArea}</span>
        </div>

        {/* Title as a hyperlink */}
        <h3 className="hdc-dataset-title">
          {onSelectDataset ? (
            <span className="hdc-dataset-title-link">{name}</span>
          ) : (
            <a
              href={pageUrl || "#"}
              className="hdc-dataset-title-link"
              onClick={(e) => {
                if (!pageUrl) e.preventDefault();
              }}
            >
              {name}
            </a>
          )}
        </h3>

        {/* Description */}
        <p className="hdc-dataset-description">{description}</p>

        {renderMatchedFields()}

        {/* Dataset attributes */}
        <div className="hdc-dataset-attributes">
          {source && (
            <div className="hdc-attribute">
              <span className="hdc-attribute-label">Source:</span>
              <span className="hdc-attribute-value">{source}</span>
            </div>
          )}

          {dataFormat && (
            <div className="hdc-attribute">
              <span className="hdc-attribute-label">Data Format:</span>
              <span className="hdc-attribute-value">{dataFormat}</span>
            </div>
          )}

          {dateUpdated && (
            <div className="hdc-attribute">
              <span className="hdc-attribute-label">Date Updated:</span>
              <span className="hdc-attribute-value">{dateUpdated}</span>
            </div>
          )}

          {dateCreated && (
            <div className="hdc-attribute">
              <span className="hdc-attribute-label">Date Created:</span>
              <span className="hdc-attribute-value">{dateCreated}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;