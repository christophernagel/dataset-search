import React, { useState, useEffect } from "react";
import SearchHome from "./home/SearchHome";
import SearchResults from "./search/SearchResults";
import SearchService from "../services/SearchService";
import { sampleDatasets } from "../data/sampleDatasets";
import { useFilters } from "../context/FilterContext";
import { useView } from "../context/ViewContext";

function AppContent() {
  // Keep a separate state for home/search distinction
  const [currentView, setCurrentView] = useState("home");
  const [searchService, setSearchService] = useState(null);

  // Get view state from context for detail view
  const { view, selectedDataset } = useView();
  const { setSearchQuery, searchQuery } = useFilters();

  useEffect(() => {
    setSearchService(new SearchService(sampleDatasets));
  }, []);

  // Handle search action
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Even with empty query, navigate to search view when
    // explicitly requested (like from View All button)
    setCurrentView("search");
  };

  // Handle navigation back to home
  const navigateHome = () => {
    setCurrentView("home");
    setSearchQuery("");
  };

  if (!searchService) {
    return <div className="loading">Loading...</div>;
  }

  // Determine what to render
  // First check if we're in detail view from context
  if (view === "detail" && selectedDataset) {
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
          <SearchResults
            searchService={searchService}
            onNavigateHome={navigateHome}
          />
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

  // Then check if we're on home or search using local state
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
        {currentView === "home" ? (
          <SearchHome searchService={searchService} onSearch={handleSearch} />
        ) : (
          <SearchResults
            searchService={searchService}
            onNavigateHome={navigateHome}
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
