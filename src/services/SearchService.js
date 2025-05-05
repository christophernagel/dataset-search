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

  getDatasetsByAttribute(attributeType, attributeValue) {
    return this.datasets.filter((dataset) => {
      switch (attributeType) {
        case "communityActionArea":
          return dataset.communityActionArea === attributeValue;
        case "source":
          return dataset.source === attributeValue;
        case "type":
          return dataset.type === attributeValue;
        case "dataFormat":
          return dataset.dataFormat === attributeValue;
        case "dataTopic":
          return dataset.dataTopic === attributeValue;
        default:
          return false;
      }
    });
  }

  getSuggestedCategories(query) {
    if (!query || query.trim() === "") {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const categories = {};

    // Find matching datasets and collect their categories
    this.datasets.forEach((dataset) => {
      if (
        dataset.communityActionArea &&
        (dataset.name?.toLowerCase().includes(lowerQuery) ||
          dataset.description?.toLowerCase().includes(lowerQuery) ||
          dataset.communityActionArea.toLowerCase().includes(lowerQuery) ||
          dataset.dataTopic?.toLowerCase().includes(lowerQuery))
      ) {
        categories[dataset.communityActionArea] =
          (categories[dataset.communityActionArea] || 0) + 1;
      }
    });

    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getSuggestions(query) {
    if (!query || query.trim() === "") {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const matchedTopics = new Set();
    const matchedSources = new Set();
    const matchedCategories = new Set();

    this.datasets.forEach((dataset) => {
      if (dataset.dataTopic?.toLowerCase().includes(lowerQuery)) {
        matchedTopics.add(dataset.dataTopic);
      }

      if (dataset.source?.toLowerCase().includes(lowerQuery)) {
        matchedSources.add(dataset.source);
      }

      if (dataset.communityActionArea?.toLowerCase().includes(lowerQuery)) {
        matchedCategories.add(dataset.communityActionArea);
      }
    });

    const matchedNames = this.datasets
      .filter((dataset) => dataset.name.toLowerCase().includes(lowerQuery))
      .map((dataset) => dataset.name);

    return [
      ...matchedNames.slice(0, 2),
      ...Array.from(matchedTopics).slice(0, 1),
      ...Array.from(matchedSources).slice(0, 1),
      ...Array.from(matchedCategories).slice(0, 1),
    ].slice(0, 5);
  }

  search(query, filters = {}) {
    if (!query || query.trim() === "") {
      return this._applyFilters(this.datasets, filters);
    }

    const lowerQuery = query.toLowerCase();
    const results = this.datasets.filter(
      (dataset) =>
        dataset.name?.toLowerCase().includes(lowerQuery) ||
        dataset.description?.toLowerCase().includes(lowerQuery) ||
        dataset.communityActionArea?.toLowerCase().includes(lowerQuery) ||
        dataset.source?.toLowerCase().includes(lowerQuery) ||
        dataset.dataTopic?.toLowerCase().includes(lowerQuery)
    );

    return this._applyFilters(results, filters);
  }

  _applyFilters(datasets, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return datasets;
    }

    return datasets.filter((dataset) => {
      return Object.entries(filters).every(([category, values]) => {
        if (!values || Object.keys(values).length === 0) {
          return true;
        }

        const activeValues = Object.entries(values)
          .filter(([_, isActive]) => isActive)
          .map(([value]) => value);

        if (activeValues.length === 0) {
          return true;
        }

        return activeValues.some((value) => {
          switch (category) {
            case "Community Action Areas":
              return dataset.communityActionArea === value;
            case "Categories":
              return dataset.type === value;
            case "Data Type":
              return dataset.dataFormat === value;
            case "Source":
              return dataset.source === value;
            case "Data Topic":
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

  getFeaturedDatasets() {
    const areas = new Set();
    const featured = [];

    for (const dataset of this.datasets) {
      if (featured.length >= 4) break;

      const area = dataset.communityActionArea;
      if (!areas.has(area)) {
        areas.add(area);
        featured.push(dataset);
      }
    }

    return featured;
  }
}

export default SearchService;
