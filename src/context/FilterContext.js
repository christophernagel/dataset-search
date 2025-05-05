// context/FilterContext.js
import React, { createContext, useContext, useReducer } from "react";

const FilterContext = createContext(null);

const initialState = {
  activeFilters: {},
  searchQuery: "",
};

// Mapping between dataset properties and filter categories
const filterMappings = {
  "communityActionArea": "Community Action Areas",
  "source": "Source",
  "type": "Categories",
  "dataFormat": "Data Type",
  "dataTopic": "Data Topic"
};

function filterReducer(state, action) {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, activeFilters: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_BY_ATTRIBUTE":
      const { field, value } = action.payload;
      const filterCategory = filterMappings[field];
      
      if (!filterCategory) return state;
      
      const newFilters = { ...state.activeFilters };
      newFilters[filterCategory] = { 
        ...newFilters[filterCategory],
        [value]: true 
      };
      
      return { ...state, activeFilters: newFilters };
    case "REMOVE_FILTER": {
      const { category, value } = action.payload;
      const newFilters = { ...state.activeFilters };
      if (newFilters[category]) {
        const categoryFilters = { ...newFilters[category] };
        delete categoryFilters[value];
        if (Object.keys(categoryFilters).length === 0) {
          delete newFilters[category];
        } else {
          newFilters[category] = categoryFilters;
        }
      }
      return { ...state, activeFilters: newFilters };
    }
    case "CLEAR_FILTERS":
      return { ...state, activeFilters: {}, searchQuery: "" };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const value = {
    ...state,
    setFilters: (filters) =>
      dispatch({ type: "SET_FILTERS", payload: filters }),
    setSearchQuery: (query) =>
      dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
    removeFilter: (category, value) =>
      dispatch({ type: "REMOVE_FILTER", payload: { category, value } }),
    clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }),
    setFilterByAttribute: (field, value) =>
      dispatch({ type: "SET_FILTER_BY_ATTRIBUTE", payload: { field, value } }),
    // Expose filter mappings for components
    filterMappings
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}