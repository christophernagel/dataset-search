// components/home/FeaturedDatasets.js
import React from 'react';

const FeaturedDatasets = ({ datasets }) => {
  const getCategoryColor = (category) => {
    const colors = {
      "Promoting Healthy Child Development": "#FF6B6B",
      "Youth Development and Civic Engagement": "#4ECDC4",
      "Creating Protective Environments": "#45B7D1",
      "Strengthening Economic Supports for Children and Families": "#98D85B",
      "Access to Safe and Stable Housing": "#FFD166",
      "Demographic Data": "#6A0572"
    };
    return colors[category] || "#808080";
  };

  return (
    <div className="featured-datasets">
      {datasets.map(dataset => (
        <div key={dataset.id} className="featured-dataset-card">
          <span 
            className="featured-dataset-category"
            style={{ 
              backgroundColor: getCategoryColor(dataset.communityActionArea) + '20',
              color: getCategoryColor(dataset.communityActionArea) 
            }}
          >
            {dataset.communityActionArea}
          </span>
          <h3 className="featured-dataset-title">
            <a href={dataset.pageUrl || "#"} className="featured-dataset-title-link">
              {dataset.name}
            </a>
          </h3>
          <p className="featured-dataset-description">{dataset.description}</p>
          <div className="featured-dataset-source">Source: {dataset.source}</div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedDatasets;