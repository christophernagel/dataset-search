// components/search/RelatedSuggestions.js
import React from 'react';

const RelatedSuggestions = ({ query, onSuggestionClick, searchService }) => {
  // Get suggested categories based on the query
  const suggestedCategories = searchService.getSuggestedCategories(query);
  
  if (suggestedCategories.length === 0) {
    return null;
  }
  
  return (
    <div className="related-suggestions">
      <span className="suggestions-label">Related:</span>
      <div className="suggestions-list">
        {suggestedCategories.map(category => (
          <button
            key={category.name}
            className="suggestion-item"
            onClick={() => onSuggestionClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedSuggestions;