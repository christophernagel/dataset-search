import React, { createContext, useContext, useState, useCallback } from "react";

const ViewContext = createContext(null);

export function ViewProvider({ children }) {
  /* "catalog" | "detail" | … */
  const [view, setView] = useState("catalog");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /** open detail panel */
  const selectDataset = useCallback((dataset) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDataset(dataset);
      setView("detail");
      setIsTransitioning(false);
    }, 300);
  }, []);

  /** return to catalog */
  const clearSelectedDataset = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDataset(null);
      setView("catalog");
      setIsTransitioning(false);
    }, 300);
  }, []);

  const value = {
    view,
    setView,
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
