import React, { useState, useEffect, useMemo } from 'react';
import { 
  normalizeTrainingType, 
  summarizeInstruments,
  formatEventDate,
  calculateCapacityMetrics,
  getDangerZoneStatus 
} from '../utils/event-utils.js';
import { handleKeyboardActivation, announceToScreenReader } from '../utils/accessibility.js';
import EventService from '../services/api.js';
import EventAnalytics from './EventAnalytics.jsx';
import ExportTools from './ExportTools.jsx';
import NotificationSystem from './NotificationSystem.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import DangerZone from './DangerZone.jsx';
import MobileNavigation from './MobileNavigation.jsx';
import AdvancedFilters from './AdvancedFilters.jsx';
import CalendarView from './CalendarView.jsx';

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
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
  };

  return (
    <div 
      role="region"
      aria-labelledby={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className={`${colorClasses[color]} border rounded-lg p-5 text-center transition-colors duration-200`}
    >
      <h3 
        id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="text-3xl font-bold mb-2"
        aria-label={`${title}: ${value}`}
      >
        {value}
      </h3>
      <p className="text-base font-semibold mb-1 text-gray-700 dark:text-gray-300">
        {title}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
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

  const statusClasses = {
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
  };

  const progressClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };

  return (
    <article 
      role="article"
      aria-labelledby={`event-title-${event.id}`}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 
          id={`event-title-${event.id}`}
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {event.title}
        </h3>
        <span 
          role="status"
          aria-label={`Event status: ${event.status}`}
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[statusColor]}`}
        >
          {event.status.toUpperCase()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span role="img" aria-label="Calendar">📅</span> Date
          </p>
          <p className="text-gray-900 dark:text-white font-medium">{formatEventDate(event.date)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span role="img" aria-label="Location">📍</span> Location
          </p>
          <p className="text-gray-900 dark:text-white font-medium">{event.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span role="img" aria-label="Instructor">👨‍🏫</span> Instructor
          </p>
          <p className="text-gray-900 dark:text-white font-medium">{event.instructor}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span role="img" aria-label="Price">💰</span> Price
          </p>
          <p className="text-gray-900 dark:text-white font-medium">${event.price || 'TBD'}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Enrollment</span>
          <span 
            className="text-sm font-medium text-gray-900 dark:text-white"
            aria-label={`${event.enrolled} enrolled out of ${event.capacity} capacity, ${Math.round(capacityPercentage)} percent full`}
          >
            {event.enrolled}/{event.capacity} ({Math.round(capacityPercentage)}%)
          </span>
        </div>
        <div 
          role="progressbar"
          aria-valuenow={capacityPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`Event capacity: ${Math.round(capacityPercentage)}% full`}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        >
          <div 
            className={`h-full ${progressClasses[statusColor]} transition-all duration-300 ease-out`}
            style={{ width: `${capacityPercentage}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span role="img" aria-label="Tools">🔧</span> Instruments
        </p>
        <div className="flex gap-2 flex-wrap">
          {event.instruments.map((instrument, index) => (
            <span 
              key={index} 
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium"
            >
              {instrument}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default function EnhancedEventDashboard() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventService] = useState(() => new EventService());
  
  // New state for improved features
  const [currentView, setCurrentView] = useState('dashboard');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    instructor: '',
    status: '',
    capacity: 'all',
    dateRange: 'all',
    instruments: []
  });

  // Load events from API service
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the new EventService to get enhanced event data
        const enhancedEvents = await eventService.getEnhancedEvents();
        
        // Transform the data to match our existing component structure
        const transformedEvents = enhancedEvents.map(event => ({
          id: event.id,
          title: event.title,
          date: event.meta?.event_date || event.date,
          location: event.meta?.location || event.location,
          instructor: event.meta?.instructor || event.instructor,
          enrolled: event.enrolled,
          capacity: event.capacity,
          status: event.status,
          instruments: event.meta?.instruments || ['GT1', 'GT2'],
          dangerZone: event.dangerZone,
          recentActivity: event.recentActivity,
          price: event.meta?.price || 1200
        }));
        
        setEvents(transformedEvents);
      } catch (err) {
        setError(err.message || 'Failed to load events');
        console.error('Error loading events:', err);
        
        // Fallback to mock data if API fails
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [eventService]);

  const retryLoading = () => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  };

  // Filter events with advanced filtering
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.location.toLowerCase().includes(filters.search.toLowerCase()) &&
          !event.instructor.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location && event.location !== filters.location) {
        return false;
      }

      // Status filter
      if (filters.status && event.status !== filters.status) {
        return false;
      }

      // Capacity filter
      if (filters.capacity !== 'all') {
        const percentage = (event.enrolled / event.capacity) * 100;
        if (filters.capacity === 'available' && percentage >= 70) return false;
        if (filters.capacity === 'filling' && (percentage < 70 || percentage >= 90)) return false;
        if (filters.capacity === 'full' && percentage < 90) return false;
      }

      // Instruments filter
      if (filters.instruments.length > 0) {
        const hasInstrument = filters.instruments.some(instrument => 
          event.instruments.includes(instrument)
        );
        if (!hasInstrument) return false;
      }

      return true;
    });
  }, [events, filters]);

  // Accessibility handlers
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    announceToScreenReader(`Filter changed to ${newFilter === 'all' ? 'all events' : newFilter + ' events'}`);
  };

  const handleViewToggle = () => {
    const newView = !showAnalytics;
    setShowAnalytics(newView);
    setShowDangerZone(false);
    announceToScreenReader(`Switched to ${newView ? 'analytics' : 'list'} view`);
  };

  const handleDangerZoneToggle = () => {
    const newView = !showDangerZone;
    setShowDangerZone(newView);
    setShowAnalytics(false);
    announceToScreenReader(`${newView ? 'Opened' : 'Closed'} danger zone risk intelligence`);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowAnalytics(view === 'analytics');
    setShowDangerZone(false);
    announceToScreenReader(`Switched to ${view} view`);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    announceToScreenReader('Filters updated');
  };

  // Show loading spinner
  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Loading dashboard..." />;
  }

  // Show error message
  if (error) {
    return (
      <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
        <ErrorMessage
          title="Failed to Load Dashboard"
          message={error}
          onRetry={retryLoading}
          type="error"
        />
      </div>
    );
  }

  // Calculate dashboard metrics
  const totalEvents = events.length;
  const totalEnrolled = events.reduce((sum, event) => sum + event.enrolled, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const averageCapacity = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
  const fullEvents = events.filter(event => event.status === 'full').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <MobileNavigation 
        currentView={currentView}
        onViewChange={handleViewChange}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
        isFiltersOpen={isFiltersOpen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            title="Average Capacity" 
            value={`${averageCapacity}%`} 
            subtitle="Overall utilization"
            color={averageCapacity >= 90 ? "red" : averageCapacity >= 70 ? "yellow" : "green"}
          />
          <StatCard 
            title="Full Events" 
            value={fullEvents} 
            subtitle="At capacity"
            color="red"
          />
        </div>

        {/* View Content */}
        {currentView === 'calendar' && (
          <CalendarView events={filteredEvents} />
        )}
        
        {currentView === 'analytics' && (
          <EventAnalytics events={filteredEvents} />
        )}
        
        {currentView === 'export' && (
          <ExportTools events={filteredEvents} />
        )}
        
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleViewToggle}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      showAnalytics 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    📊 Analytics
                  </button>
                  <button
                    onClick={handleDangerZoneToggle}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      showDangerZone 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    ⚠️ Risk
                  </button>
                </div>
              </div>
            </div>

            {/* Show Analytics or Danger Zone if toggled */}
            {showAnalytics && <EventAnalytics events={filteredEvents} />}
            {showDangerZone && <DangerZone events={filteredEvents} />}

            {/* Events Grid */}
            {!showAnalytics && !showDangerZone && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        <NotificationSystem events={events} />
      </main>

      <AdvancedFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
