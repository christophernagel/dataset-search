import React, { useState, useEffect } from "react";
import DatasetGrid from "../DatasetGrid";
import { getAttribute } from "../../data/attributesData";

const AttributeDetail = ({ attributeType, attributeValue, datasets }) => {
  const [isLoading, setIsLoading] = useState(true);
  const attribute = getAttribute(attributeType, attributeValue);

  /* ---------- loading transition ---------- */
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [attributeType, attributeValue]);

  /* ---------- guard against unknown attribute ---------- */
  if (!attribute) {
    return (
      <div className="hdc-attribute-detail-wrapper">
        <p className="hdc-error">
          No information found for {attributeType}: {attributeValue}
        </p>
      </div>
    );
  }

  /* ---------- helpers ---------- */
  const getHeaderColor = () =>
    attributeType === "communityActionArea" && attribute.color
      ? {
          backgroundColor: `${attribute.color}20`,
          borderColor: attribute.color,
          color: attribute.color,
        }
      : {};

  /* ---------- render ---------- */
  return (
    <div className="hdc-attribute-detail-wrapper">
      <div
        className={`hdc-attribute-detail ${isLoading ? "loading" : "loaded"}`}
      >
        {isLoading && (
          <div className="hdc-loading-overlay">
            <div className="hdc-loading-spinner" />
          </div>
        )}

        {/* header */}
        <div className="hdc-attribute-detail-header">
          <div className="hdc-attribute-category" style={getHeaderColor()}>
            <span className="hdc-attribute-type">{attributeType}</span>
          </div>
          <h1 className="hdc-attribute-detail-title">{attribute.name}</h1>
        </div>

        {/* main content */}
        <div className="hdc-attribute-detail-content">
          <div className="hdc-attribute-detail-main">
            {/* description */}
            <section className="hdc-attribute-detail-section">
              <h2 className="hdc-section-title">Description</h2>
              <p className="hdc-attribute-detail-description">
                {attribute.description}
              </p>
            </section>

            {/* attribute info */}
            <section className="hdc-attribute-detail-section">
              <h2 className="hdc-section-title">Attribute Information</h2>
              <div className="hdc-attribute-detail-info-grid">
                <div className="hdc-info-item">
                  <div className="hdc-info-label">Type</div>
                  <div className="hdc-info-value">{attribute.type}</div>
                </div>
                {attribute.source && (
                  <div className="hdc-info-item">
                    <div className="hdc-info-label">Source</div>
                    <div className="hdc-info-value">{attribute.source}</div>
                  </div>
                )}
              </div>
            </section>

            {/* actions */}
            {attribute.sourceUrl && (
              <section className="hdc-attribute-detail-section">
                <h2 className="hdc-section-title">Actions</h2>
                <div className="hdc-attribute-detail-actions">
                  {/* FIXED: anchor tag added */}
                  <a
                    href={attribute.sourceUrl}
                    className="hdc-attribute-action-button hdc-view-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source Information
                  </a>
                </div>
              </section>
            )}

            {/* dataset list */}
            <section className="hdc-attribute-datasets-section">
              <h2 className="hdc-section-title">
                Datasets with this {attributeType}
              </h2>
              <div className="hdc-attribute-datasets-count">
                Found {datasets.length} datasets
              </div>
              <DatasetGrid datasets={datasets} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeDetail;
