import React from 'react'
import ReactDOM from 'react-dom/client'
import EnhancedEventDashboard from './components/EnhancedEventDashboard.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <EnhancedEventDashboard />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
)