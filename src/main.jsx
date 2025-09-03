import React from 'react'
import ReactDOM from 'react-dom/client'
import EnhancedEventDashboard from './components/EnhancedEventDashboard.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <EnhancedEventDashboard />
    </ErrorBoundary>
  </React.StrictMode>
)