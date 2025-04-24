// App.js
import React from "react";
import { FilterProvider } from "./context/FilterContext";
import { ViewProvider } from "./context/ViewContext";
import AppContent from "./components/AppContent";
import "./styles.css";

function App() {
  return (
    <FilterProvider>
      <ViewProvider>
        <AppContent />
      </ViewProvider>
    </FilterProvider>
  );
}

export default App;