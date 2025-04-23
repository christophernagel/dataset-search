// src/services/SearchService.js
// Simplified version without lunr dependency

class SearchService {
  constructor(datasets) {
    this.datasets = datasets;
    this.datasetsMap = this._createDatasetsMap(datasets);
  }

  _createDatasetsMap(datasets) {
    return datasets.reduce((map, dataset) => {
      map[dataset.id] = dataset;
      return map;
    }, {});
  }

  // Basic search method without lunr
  _createSearchIndex(datasets) {
    // This is a placeholder - we're not using lunr
    console.log("Search index created without lunr");
    return null;
  }

  search(query, filters = {}) {
    if (!query || query.trim() === '') {
      // Return all datasets if no query
      return this._applyFilters(this.datasets, filters);
    }
    
    // Basic search without lunr
    const lowerQuery = query.toLowerCase();
    const results = this.datasets.filter(dataset => {
      return (
        (dataset.name && dataset.name.toLowerCase().includes(lowerQuery)) ||
        (dataset.description && dataset.description.toLowerCase().includes(lowerQuery)) ||
        (dataset.communityActionArea && dataset.communityActionArea.toLowerCase().includes(lowerQuery)) ||
        (dataset.source && dataset.source.toLowerCase().includes(lowerQuery)) ||
        (dataset.dataTopic && dataset.dataTopic.toLowerCase().includes(lowerQuery))
      );
    }).map(dataset => {
      const matchedFields = this._getMatchedFields(dataset, query);
      const relevanceScore = matchedFields.length / 5; // Simple relevance score
      
      return {
        ...dataset,
        relevanceScore,
        normalizedScore: Math.min(relevanceScore, 1),
        matchedFields
      };
    });
    
    // Apply any filters to the search results
    return this._applyFilters(results, filters);
  }
  
  _getMatchedFields(dataset, query) {
    const lowerQuery = query.toLowerCase();
    const matchedFields = [];
    
    if (dataset.name && dataset.name.toLowerCase().includes(lowerQuery)) 
      matchedFields.push('title');
    if (dataset.description && dataset.description.toLowerCase().includes(lowerQuery)) 
      matchedFields.push('description');
    if (dataset.communityActionArea && dataset.communityActionArea.toLowerCase().includes(lowerQuery)) 
      matchedFields.push('category');
    if (dataset.source && dataset.source.toLowerCase().includes(lowerQuery)) 
      matchedFields.push('source');
    if (dataset.dataTopic && dataset.dataTopic.toLowerCase().includes(lowerQuery)) 
      matchedFields.push('topic');
    
    return matchedFields;
  }
  
  _applyFilters(datasets, filters) {
    // Handle empty filters
    if (!filters || Object.keys(filters).length === 0) {
      return datasets;
    }
    
    return datasets.filter(dataset => {
      return Object.entries(filters).every(([category, values]) => {
        // Skip categories with no active values
        if (!values || Object.keys(values).length === 0) {
          return true;
        }
        
        // Get active values for this category
        const activeValues = Object.entries(values)
          .filter(([_, isActive]) => isActive)
          .map(([value]) => value);
        
        // Skip if no active values
        if (activeValues.length === 0) {
          return true;
        }
        
        // Check if the dataset matches any of the active values for this category
        return activeValues.some(value => {
          switch(category) {
            case 'Community Action Areas':
              return dataset.communityActionArea === value;
            case 'Categories':
              return dataset.type === value;
            case 'Data Type':
              return dataset.dataFormat === value;
            case 'Source':
              return dataset.source === value;
            case 'Data Topic':
              return dataset.dataTopic === value;
            default:
              return false;
          }
        });
      });
    });
  }
  
  getFilteredDatasets(filters = {}) {
    return this._applyFilters(this.datasets, filters);
  }
  
  getDatasetById(id) {
    return this.datasetsMap[id];
  }
  
  getSuggestedCategories(query) {
    // Return top categories based on search
    const results = this.search(query);
    const categories = {};
    
    results.forEach(result => {
      if (result.communityActionArea) {
        categories[result.communityActionArea] = (categories[result.communityActionArea] || 0) + 1;
      }
    });
    
    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
  
  getFeaturedDatasets() {
    // Return up to 4 datasets with diverse community action areas
    const areas = {};
    const featured = [];
    
    for (const dataset of this.datasets) {
      if (featured.length >= 4) break;
      
      const area = dataset.communityActionArea;
      
      if (!areas[area]) {
        areas[area] = true;
        featured.push(dataset);
      }
    }
    
    return featured;
  }
}

export default SearchService;