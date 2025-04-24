import React from "react";
import { FilterProvider } from "./context/FilterContext";
import { ViewProvider } from "./context/ViewContext";
import { AppProvider } from "./context/AppContext";
import AppContent from "./components/AppContent";
import "./styles.css";

function App() {
  return (
    <AppProvider>
      <FilterProvider>
        <ViewProvider>
          <AppContent />
        </ViewProvider>
      </FilterProvider>
    </AppProvider>
  );
}

export default App;