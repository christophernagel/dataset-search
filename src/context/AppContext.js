import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

// Action types
const SET_VIEW = 'SET_VIEW';
const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
const SET_ACTIVE_FILTERS = 'SET_ACTIVE_FILTERS';
const SET_VIEW_MODE = 'SET_VIEW_MODE';
const SET_SORT_BY = 'SET_SORT_BY';
const SET_SEARCH_SERVICE = 'SET_SEARCH_SERVICE';
const SET_SELECTED_DATASET = 'SET_SELECTED_DATASET';
const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY';

const initialState = {
  view: 'home',
  searchQuery: '',
  activeFilters: {},
  viewMode: 'grid',
  sortBy: 'relevance',
  searchService: null,
  selectedDataset: null,
  searchHistory: []
};

function appReducer(state, action) {
  switch (action.type) {
    case SET_VIEW:
      return { ...state, view: action.payload };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SET_ACTIVE_FILTERS:
      return { ...state, activeFilters: action.payload };
    case SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    case SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    case SET_SEARCH_SERVICE:
      return { ...state, searchService: action.payload };
    case SET_SELECTED_DATASET:
      return { 
        ...state, 
        selectedDataset: action.payload, 
        view: action.payload ? 'detail' : state.view 
      };
    case SET_SEARCH_HISTORY:
      return { ...state, searchHistory: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize search history from localStorage
  useEffect(() => {
    try {
      const savedSearchHistory = localStorage.getItem('searchHistory');
      if (savedSearchHistory) {
        dispatch({ 
          type: SET_SEARCH_HISTORY, 
          payload: JSON.parse(savedSearchHistory).slice(0, 5) 
        });
      }
    } catch (error) {
      console.warn('Error loading search history:', error);
    }
  }, []);

  const saveSearchToHistory = (query) => {
    if (!query || query.trim() === '') return;
    
    const newHistory = [
      query,
      ...state.searchHistory.filter(item => item !== query)
    ].slice(0, 5);
    
    dispatch({ type: SET_SEARCH_HISTORY, payload: newHistory });
    
    try {
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Error saving search history:', error);
    }
  };

  const handleSearch = (query) => {
    if (!query || query.trim() === '') return;
    
    dispatch({ type: SET_SEARCH_QUERY, payload: query });
    dispatch({ type: SET_VIEW, payload: 'search' });
    saveSearchToHistory(query);
  };

  const contextValue = {
    ...state,
    setView: (view) => dispatch({ type: SET_VIEW, payload: view }),
    setSearchQuery: (query) => dispatch({ type: SET_SEARCH_QUERY, payload: query }),
    setActiveFilters: (filters) => dispatch({ type: SET_ACTIVE_FILTERS, payload: filters }),
    setViewMode: (mode) => dispatch({ type: SET_VIEW_MODE, payload: mode }),
    setSortBy: (sort) => dispatch({ type: SET_SORT_BY, payload: sort }),
    setSearchService: (service) => dispatch({ type: SET_SEARCH_SERVICE, payload: service }),
    setSelectedDataset: (dataset) => dispatch({ type: SET_SELECTED_DATASET, payload: dataset }),
    saveSearchToHistory,
    handleSearch,
    goToHome: () => {
      dispatch({ type: SET_VIEW, payload: 'home' });
      dispatch({ type: SET_SEARCH_QUERY, payload: '' });
    },
    goToSearch: () => dispatch({ type: SET_VIEW, payload: 'search' }),
    goToDatasetDetail: (datasetId) => {
      const dataset = state.searchService?.getDatasetById(datasetId);
      if (dataset) {
        dispatch({ type: SET_SELECTED_DATASET, payload: dataset });
      }
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}