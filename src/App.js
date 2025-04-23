// src/App.js - without React Router
import React, { useEffect, useState } from "react";
import SearchService from "./services/SearchService";
import DatasetCatalog from "./components/DatasetCatalog";
import SearchHome from "./components/home/SearchHome";
import "./styles.css";

function App() {
  const [searchService, setSearchService] = useState(null);
  const [view, setView] = useState("home"); // 'home' or 'search'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Extract the dataset from the original component
    const extractDatasets = async () => {
      // For now, just use an empty array if we can't get the data
      const datasets = window.sampleDatasets || [];
      setSearchService(new SearchService(datasets));
    };

    extractDatasets();
  }, []);

  // Don't render until search service is initialized
  if (!searchService) {
    return <div className="loading">Loading...</div>;
  }

  // Simple navigation handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    setView("search");
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
          <div className="search-results-placeholder">
            <h2>Search Results for: {searchQuery}</h2>
            <p>Search functionality is under development.</p>
            <button onClick={() => setView("home")}>Back to Home</button>
          </div>
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