import React from 'react';

const RelatedSuggestions = ({ query, onSuggestionClick, searchService }) => {
  if (!query || !searchService) return null;
  
  const suggestedCategories = searchService.getSuggestedCategories(query);
  
  if (suggestedCategories.length === 0) {
    return null;
  }
  
  return (
    <div className="related-suggestions">
      <span className="suggestions-label">Related:</span>
      <div className="suggestions-list">
        {suggestedCategories.map((category, index) => (
          <button
            key={index}
            className="suggestion-item"
            onClick={() => onSuggestionClick(category.name)}
          >
            <span className="suggestion-text">
              {category.name} ({category.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedSuggestions;