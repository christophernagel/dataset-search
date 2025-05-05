// src/context/ViewContext.js
import React, { createContext, useContext, useState, useCallback } from "react";

const ViewContext = createContext(null);

export function ViewProvider({ children }) {
  /* "catalog" | "detail" | "attribute" */
  const [view, setView] = useState("catalog");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /** open detail panel */
  const selectDataset = useCallback((dataset) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDataset(dataset);
      setSelectedAttribute(null); // Clear any selected attribute
      setView("detail");
      setIsTransitioning(false);
    }, 300);
  }, []);

  /** select attribute to view details */
  const selectAttribute = useCallback((type, value) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedAttribute({ type, value });
      setSelectedDataset(null); // Clear any selected dataset
      setView("attribute");
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

  /** return to catalog from attribute view */
  const clearSelectedAttribute = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedAttribute(null);
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
    selectedAttribute,
    isTransitioning,
    setViewMode: useCallback((mode) => setViewMode(mode), []),
    setSortBy: useCallback((sort) => setSortBy(sort), []),
    selectDataset,
    selectAttribute,
    clearSelectedDataset,
    clearSelectedAttribute,
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