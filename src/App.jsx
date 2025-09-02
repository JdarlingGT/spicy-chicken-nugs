// src/App.jsx

import React from "react";
import EventPreviewDashboard from "./components/EventPreviewDashboard";
import events from "./data/test-events.json"; // Replace with real API data if available

const App = () => {
  return (
    <div className="App">
      <EventPreviewDashboard events={events} />
    </div>
  );
};

export default App;
