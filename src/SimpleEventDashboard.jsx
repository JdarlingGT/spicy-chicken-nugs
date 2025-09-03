import React from 'react';
import { normalizeTrainingType, summarizeInstruments } from './utils/event-utils.js';

export default function SimpleEventDashboard() {
  // Test utility functions
  const testNormalize = normalizeTrainingType("IASTM - Level 1");
  const testSummarize = summarizeInstruments(["GT1", "GT2", "GT3", "GT4", "GT5"]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#e53e3e', fontSize: '2rem', marginBottom: '20px' }}>
        🔥 Spicy Chicken Nugs - Graston Event Dashboard
      </h1>
      
      <div style={{ 
        backgroundColor: '#f7fafc', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '10px' }}>Dashboard Status</h2>
        <p style={{ color: '#4a5568' }}>✅ React is working</p>
        <p style={{ color: '#4a5568' }}>✅ Component rendering successfully</p>
        <p style={{ color: '#4a5568' }}>✅ Utility functions imported</p>
        <p style={{ color: '#4a5568' }}>🔄 Ready to load full dashboard</p>
      </div>

      <div style={{ 
        backgroundColor: '#f0fff4', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #9ae6b4',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '10px' }}>Utility Function Tests</h2>
        <p style={{ color: '#276749' }}>
          <strong>normalizeTrainingType:</strong> "{testNormalize}"
        </p>
        <p style={{ color: '#276749' }}>
          <strong>summarizeInstruments:</strong> {testSummarize}
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#fff5f5', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #fed7d7'
      }}>
        <h3 style={{ color: '#c53030', marginBottom: '10px' }}>Next Steps</h3>
        <ul style={{ color: '#742a2a', paddingLeft: '20px' }}>
          <li>Load utility functions</li>
          <li>Initialize API configuration</li>
          <li>Render event data</li>
          <li>Add interactive charts</li>
        </ul>
      </div>
    </div>
  );
}