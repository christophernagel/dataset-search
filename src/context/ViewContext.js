// context/ViewContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const ViewContext = createContext(null);

export function ViewProvider({ children }) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');

  const value = {
    viewMode,
    sortBy,
    setViewMode: useCallback((mode) => setViewMode(mode), []),
    setSortBy: useCallback((sort) => setSortBy(sort), [])
  };

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}