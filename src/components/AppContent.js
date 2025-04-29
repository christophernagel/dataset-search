// components/AppContent.js
import React, { useState, useEffect } from "react";
import SearchHome from "./home/SearchHome";
import SearchResults from "./search/SearchResults";
import SearchService from "../services/SearchService";
import { sampleDatasets } from "../data/sampleDatasets";
import { useFilters } from "../context/FilterContext";

function AppContent() {
  const [searchService, setSearchService] = useState(null);
  const [view, setView] = useState("home");
  const { setSearchQuery } = useFilters();

  useEffect(() => {
    setSearchService(new SearchService(sampleDatasets));
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setView("search");
  };

  if (!searchService) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Healthcare Dataset Catalog</h1>
        <p className="app-description">
          Browse and filter medical and community health datasets from various
          sources
        </p>
      </header>

      <main id="main-content" className="app-main">
        {view === "home" ? (
          <SearchHome searchService={searchService} onSearch={handleSearch} />
        ) : (
          <SearchResults
            searchService={searchService}
            onNavigateHome={() => {
              setView("home");
              setSearchQuery("");
            }}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          © 2025 Healthcare Data Repository. All data is for research purposes
          only.
        </p>
      </footer>
    </div>
  );
}

export default AppContent;
