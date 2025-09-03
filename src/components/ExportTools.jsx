import React from 'react';

const ExportTools = ({ events, filteredEvents }) => {
  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Event Title',
      'Date',
      'Location', 
      'Instructor',
      'Price',
      'Capacity',
      'Enrolled',
      'Utilization %',
      'Status',
      'Instruments'
    ];

    const csvData = filteredEvents.map(event => [
      event.title,
      event.date,
      event.location,
      event.instructor,
      `$${event.price}`,
      event.capacity,
      event.enrolled,
      `${Math.round((event.enrolled / event.capacity) * 100)}%`,
      event.status.toUpperCase(),
      event.instruments.join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `graston-events-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalEvents: filteredEvents.length,
      events: filteredEvents.map(event => ({
        ...event,
        utilizationRate: Math.round((event.enrolled / event.capacity) * 100)
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `graston-events-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate PDF Report (simplified version)
  const generatePDFReport = () => {
    const reportWindow = window.open('', '_blank');
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Graston Training Events Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .events-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .events-table th, .events-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .events-table th { background-color: #f2f2f2; }
          .status-active { color: #10b981; font-weight: bold; }
          .status-full { color: #ef4444; font-weight: bold; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔥 Graston Training Events Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>${filteredEvents.length}</h3>
            <p>Total Events</p>
          </div>
          <div class="stat-card">
            <h3>${filteredEvents.reduce((sum, e) => sum + e.enrolled, 0)}</h3>
            <p>Total Enrolled</p>
          </div>
          <div class="stat-card">
            <h3>${Math.round((filteredEvents.reduce((sum, e) => sum + e.enrolled, 0) / filteredEvents.reduce((sum, e) => sum + e.capacity, 0)) * 100)}%</h3>
            <p>Avg Utilization</p>
          </div>
          <div class="stat-card">
            <h3>$${filteredEvents.reduce((sum, e) => sum + (e.enrolled * e.price), 0).toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <table class="events-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Instructor</th>
              <th>Enrollment</th>
              <th>Status</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEvents.map(event => `
              <tr>
                <td>${event.title}</td>
                <td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${event.location}</td>
                <td>${event.instructor}</td>
                <td>${event.enrolled}/${event.capacity} (${Math.round((event.enrolled / event.capacity) * 100)}%)</td>
                <td class="status-${event.status}">${event.status.toUpperCase()}</td>
                <td>$${(event.enrolled * event.price).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
    
    // Auto-print after a short delay
    setTimeout(() => {
      reportWindow.print();
    }, 500);
  };

  // Print current view
  const printCurrentView = () => {
    window.print();
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        color: '#111827',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📤 Export & Reporting Tools
      </h3>
      
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={exportToCSV}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          📊 Export CSV
        </button>

        <button
          onClick={exportToJSON}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          📋 Export JSON
        </button>

        <button
          onClick={generatePDFReport}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
        >
          📄 PDF Report
        </button>

        <button
          onClick={printCurrentView}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
        >
          🖨️ Print
        </button>

        <div style={{
          marginLeft: 'auto',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Exporting {filteredEvents.length} of {events.length} events
        </div>
      </div>
    </div>
  );
};

export default ExportTools;