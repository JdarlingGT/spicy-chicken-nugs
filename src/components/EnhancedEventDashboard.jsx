import React, { useState, useEffect } from 'react';
import { 
  normalizeTrainingType, 
  summarizeInstruments,
  formatEventDate,
  calculateCapacityMetrics,
  getDangerZoneStatus 
} from '../utils/event-utils.js';
import EventAnalytics from './EventAnalytics.jsx';
import ExportTools from './ExportTools.jsx';
import NotificationSystem from './NotificationSystem.jsx';

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: "IASTM - Level 1 Certification",
    date: "2024-01-15",
    location: "Indianapolis, IN",
    instructor: "Dr. Sarah Johnson",
    capacity: 24,
    enrolled: 18,
    instruments: ["GT1", "GT2", "GT3"],
    status: "active",
    price: 1200
  },
  {
    id: 2,
    title: "IASTM - Level 2 Advanced",
    date: "2024-01-22",
    location: "Chicago, IL",
    instructor: "Dr. Michael Chen",
    capacity: 20,
    enrolled: 20,
    instruments: ["GT1", "GT2", "GT3", "GT4", "GT5"],
    status: "full",
    price: 1500
  },
  {
    id: 3,
    title: "IASTM - Refresher Course",
    date: "2024-02-05",
    location: "Online",
    instructor: "Dr. Emily Rodriguez",
    capacity: 50,
    enrolled: 12,
    instruments: ["GT1", "GT2"],
    status: "active",
    price: 400
  }
];

const StatCard = ({ title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <div style={{
      backgroundColor: color === 'blue' ? '#eff6ff' : 
                      color === 'green' ? '#f0fdf4' :
                      color === 'yellow' ? '#fefce8' : '#fef2f2',
      border: `1px solid ${color === 'blue' ? '#bfdbfe' : 
                           color === 'green' ? '#bbf7d0' :
                           color === 'yellow' ? '#fde047' : '#fecaca'}`,
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h3 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        margin: '0 0 8px 0',
        color: color === 'blue' ? '#1e40af' : 
               color === 'green' ? '#166534' :
               color === 'yellow' ? '#a16207' : '#dc2626'
      }}>
        {value}
      </h3>
      <p style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        margin: '0 0 4px 0',
        color: '#374151'
      }}>
        {title}
      </p>
      {subtitle && (
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#6b7280',
          margin: '0'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

const EventCard = ({ event }) => {
  const capacityPercentage = (event.enrolled / event.capacity) * 100;
  const statusColor = event.status === 'full' ? 'red' : 
                     capacityPercentage > 80 ? 'yellow' : 'green';

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0' }}>
          {event.title}
        </h3>
        <span style={{
          backgroundColor: statusColor === 'red' ? '#fef2f2' : 
                          statusColor === 'yellow' ? '#fefce8' : '#f0fdf4',
          color: statusColor === 'red' ? '#dc2626' : 
                 statusColor === 'yellow' ? '#a16207' : '#166534',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {event.status.toUpperCase()}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.875rem' }}>📅 Date</p>
          <p style={{ margin: '0', color: '#111827', fontWeight: '500' }}>{formatEventDate(event.date)}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.875rem' }}>📍 Location</p>
          <p style={{ margin: '0', color: '#111827', fontWeight: '500' }}>{event.location}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.875rem' }}>👨‍🏫 Instructor</p>
          <p style={{ margin: '0', color: '#111827', fontWeight: '500' }}>{event.instructor}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.875rem' }}>💰 Price</p>
          <p style={{ margin: '0', color: '#111827', fontWeight: '500' }}>${event.price}</p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Enrollment</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
            {event.enrolled}/{event.capacity} ({Math.round(capacityPercentage)}%)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${capacityPercentage}%`,
            height: '100%',
            backgroundColor: statusColor === 'red' ? '#dc2626' : 
                           statusColor === 'yellow' ? '#f59e0b' : '#10b981',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem' }}>🔧 Instruments</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {event.instruments.map((instrument, index) => (
            <span key={index} style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {instrument}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function EnhancedEventDashboard() {
  const [events, setEvents] = useState(mockEvents);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Calculate dashboard metrics
  const totalEvents = events.length;
  const totalEnrolled = events.reduce((sum, event) => sum + event.enrolled, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const averageCapacity = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
  const fullEvents = events.filter(event => event.status === 'full').length;

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1',
              minWidth: '300px'
            }}>
              🔥 Spicy Chicken Nugs
              <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>
                Graston Training Events Dashboard
              </span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🕒 Last updated: {new Date().toLocaleTimeString()}
              </div>
              <NotificationSystem events={events} />
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Stats Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard 
            title="Total Events" 
            value={totalEvents} 
            subtitle="Active training sessions"
            color="blue"
          />
          <StatCard 
            title="Total Enrolled" 
            value={totalEnrolled} 
            subtitle="Students registered"
            color="green"
          />
          <StatCard 
            title="Capacity Utilization" 
            value={`${averageCapacity}%`} 
            subtitle="Average across all events"
            color={averageCapacity > 80 ? "yellow" : "green"}
          />
          <StatCard 
            title="Full Events" 
            value={fullEvents} 
            subtitle="At maximum capacity"
            color={fullEvents > 0 ? "red" : "green"}
          />
        </div>

        {/* Filters and Search */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '4px'
            }}>
              Filter by Status
            </label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Events</option>
              <option value="active">Active</option>
              <option value="full">Full</option>
            </select>
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '4px'
            }}>
              Search Events
            </label>
            <input
              type="text"
              placeholder="Search by title, location, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '4px'
            }}>
              View Mode
            </label>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{
                padding: '8px 16px',
                backgroundColor: showAnalytics ? '#3b82f6' : '#f3f4f6',
                color: showAnalytics ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showAnalytics ? '📊 Analytics' : '📋 List View'}
            </button>
          </div>
        </div>

        {/* Export Tools */}
        <ExportTools events={events} filteredEvents={filteredEvents} />

        {/* Analytics Section */}
        {showAnalytics && (
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '20px'
            }}>
              📈 Event Analytics & Insights
            </h2>
            <EventAnalytics events={filteredEvents} />
          </div>
        )}

        {/* Events List */}
        <div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '20px'
          }}>
            Training Events ({filteredEvents.length})
          </h2>
          
          {filteredEvents.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                No events found matching your criteria.
              </p>
            </div>
          ) : (
            <div>
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}