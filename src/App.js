// src/App.js - updated to include SearchResults
import React, { useEffect, useState } from "react";
import SearchService from "./services/SearchService";
import SearchHome from "./components/home/SearchHome";
import SearchResults from "./components/search/SearchResults";
import { sampleDatasets } from "./data/sampleDatasets";
import "./styles.css";

function App() {
  const [searchService, setSearchService] = useState(null);
  const [view, setView] = useState("home"); // 'home' or 'search'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Create search service with datasets
    setSearchService(new SearchService(sampleDatasets));
  }, []);

  // Don't render until search service is initialized
  if (!searchService) {
    return <div className="loading">Loading...</div>;
  }

  // Navigation handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    setView("search");
  };

  const handleNavigateHome = () => {
    setView("home");
  };

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
            initialQuery={searchQuery} 
            onNavigateHome={handleNavigateHome}
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

export default App;