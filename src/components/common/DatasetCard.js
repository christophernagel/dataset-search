import React from "react";
import { useFilters } from "../../context/FilterContext";

/* ---------- color map ---------- */
const communityActionAreaColors = {
  "Promoting Healthy Child Development": "#FF6B6B",
  "Youth Development and Civic Engagement": "#4ECDC4",
  "Creating Protective Environments": "#45B7D1",
  "Strengthening Economic Supports for Children and Families": "#98D85B",
  "Access to Safe and Stable Housing": "#FFD166",
  "Demographic Data": "#6A0572",
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
  relevanceScore,
  matchedFields,
  onSelectDataset,
}) => {
  const { setFilterByAttribute, filterMappings } = useFilters();
  const areaColor = communityActionAreaColors[communityActionArea] || "#808080";

  /* ---------- helpers ---------- */
  const isFilterable = (field) => Boolean(filterMappings[field]);

  const handleAttributeClick = (field, value, e) => {
    e.stopPropagation();
    e.preventDefault();
    setFilterByAttribute(field, value);
  };

  const handleSelect = () => {
    if (onSelectDataset) {
      onSelectDataset(id);
    } else if (pageUrl) {
      window.open(pageUrl, "_self");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  };

  /* ---------- small UI bits ---------- */
  const renderRelevanceIndicator = () =>
    relevanceScore !== undefined && (
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

  const renderMatchedFields = () =>
    matchedFields?.length ? (
      <div className="hdc-matched-fields">
        <span className="hdc-matched-label">Matched:</span>
        {matchedFields.map((field) => (
          <span key={field} className="hdc-matched-field">
            {field}
          </span>
        ))}
      </div>
    ) : null;

  /* ---------- render ---------- */
  return (
    <div
      className="hdc-dataset-card"
      tabIndex={onSelectDataset || pageUrl ? 0 : -1}
      role={onSelectDataset || pageUrl ? "button" : "article"}
      aria-label={onSelectDataset ? `View details for ${name}` : undefined}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        e.preventDefault();
        handleSelect();
      }}
    >
      {renderRelevanceIndicator()}

      <div className="hdc-dataset-content">
        {/* community action area */}
        <div
          className={`hdc-community-action-area ${
            isFilterable("communityActionArea") ? "filterable" : ""
          }`}
          {...(isFilterable("communityActionArea")
            ? {
                onClick: (e) =>
                  handleAttributeClick(
                    "communityActionArea",
                    communityActionArea,
                    e
                  ),
                role: "button",
                tabIndex: 0,
                "aria-label": `Filter by community action area: ${communityActionArea}`,
              }
            : {})}
        >
          <span
            className="hdc-area-dot"
            style={{ backgroundColor: areaColor }}
            aria-hidden="true"
          />
          <span className="hdc-area-label">{communityActionArea}</span>
        </div>

        {/* title */}
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
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
          )}
        </h3>

        {/* description */}
        <p className="hdc-dataset-description">{description}</p>

        {renderMatchedFields()}

        {/* attributes */}
        <div className="hdc-dataset-attributes">
          {source && (
            <div
              className={`hdc-attribute ${
                isFilterable("source") ? "filterable" : ""
              }`}
              {...(isFilterable("source")
                ? {
                    onClick: (e) => handleAttributeClick("source", source, e),
                    role: "button",
                    tabIndex: 0,
                    "aria-label": `Filter by source: ${source}`,
                  }
                : {})}
            >
              <span className="hdc-attribute-label">Source:</span>
              <span className="hdc-attribute-value">{source}</span>
            </div>
          )}

          {dataFormat && (
            <div
              className={`hdc-attribute ${
                isFilterable("dataFormat") ? "filterable" : ""
              }`}
              {...(isFilterable("dataFormat")
                ? {
                    onClick: (e) =>
                      handleAttributeClick("dataFormat", dataFormat, e),
                    role: "button",
                    tabIndex: 0,
                    "aria-label": `Filter by data format: ${dataFormat}`,
                  }
                : {})}
            >
              <span className="hdc-attribute-label">Data&nbsp;Format:</span>
              <span className="hdc-attribute-value">{dataFormat}</span>
            </div>
          )}

          {type && (
            <div
              className={`hdc-attribute ${
                isFilterable("type") ? "filterable" : ""
              }`}
              {...(isFilterable("type")
                ? {
                    onClick: (e) => handleAttributeClick("type", type, e),
                    role: "button",
                    tabIndex: 0,
                    "aria-label": `Filter by category: ${type}`,
                  }
                : {})}
            >
              <span className="hdc-attribute-label">Category:</span>
              <span className="hdc-attribute-value">{type}</span>
            </div>
          )}

          {dataTopic && (
            <div
              className={`hdc-attribute ${
                isFilterable("dataTopic") ? "filterable" : ""
              }`}
              {...(isFilterable("dataTopic")
                ? {
                    onClick: (e) =>
                      handleAttributeClick("dataTopic", dataTopic, e),
                    role: "button",
                    tabIndex: 0,
                    "aria-label": `Filter by data topic: ${dataTopic}`,
                  }
                : {})}
            >
              <span className="hdc-attribute-label">Data&nbsp;Topic:</span>
              <span className="hdc-attribute-value">{dataTopic}</span>
            </div>
          )}

          {dateUpdated && (
            <div className="hdc-attribute">
              <span className="hdc-attribute-label">Date&nbsp;Updated:</span>
              <span className="hdc-attribute-value">{dateUpdated}</span>
            </div>
          )}

          {dateCreated && (
            <div className="hdc-attribute">
              <span className="hdc-attribute-label">Date&nbsp;Created:</span>
              <span className="hdc-attribute-value">{dateCreated}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;
