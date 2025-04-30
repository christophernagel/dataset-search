// context/ViewContext.js
import React, { createContext, useContext, useState, useCallback } from "react";

const ViewContext = createContext(null);

export function ViewProvider({ children }) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selectDataset = useCallback((dataset) => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(dataset);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const clearSelectedDataset = useCallback(() => {
    setIsTransitioning(true);
    // Small delay for transition effect
    setTimeout(() => {
      setSelectedDataset(null);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const value = {
    viewMode,
    sortBy,
    selectedDataset,
    isTransitioning,
    setViewMode: useCallback((mode) => setViewMode(mode), []),
    setSortBy: useCallback((sort) => setSortBy(sort), []),
    selectDataset,
    clearSelectedDataset,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}
