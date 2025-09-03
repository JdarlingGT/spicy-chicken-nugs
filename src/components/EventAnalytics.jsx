import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const EventAnalytics = ({ events }) => {
  // Prepare data for charts
  const enrollmentData = events.map(event => ({
    name: event.title.split(' - ')[1] || event.title.substring(0, 15) + '...',
    enrolled: event.enrolled,
    capacity: event.capacity,
    utilization: Math.round((event.enrolled / event.capacity) * 100)
  }));

  const statusData = [
    { name: 'Active', value: events.filter(e => e.status === 'active').length, color: '#10b981' },
    { name: 'Full', value: events.filter(e => e.status === 'full').length, color: '#ef4444' }
  ];

  const revenueData = events.map(event => ({
    name: event.title.split(' - ')[1] || event.title.substring(0, 15) + '...',
    revenue: event.enrolled * event.price,
    potential: event.capacity * event.price
  }));

  const instrumentUsage = {};
  events.forEach(event => {
    event.instruments.forEach(instrument => {
      instrumentUsage[instrument] = (instrumentUsage[instrument] || 0) + 1;
    });
  });

  const instrumentData = Object.entries(instrumentUsage).map(([instrument, count]) => ({
    instrument,
    count
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '4px 0', 
              color: entry.color,
              fontSize: '0.875rem'
            }}>
              {entry.name}: {entry.value}
              {entry.name === 'utilization' && '%'}
              {(entry.name === 'revenue' || entry.name === 'potential') && 
                ` ($${entry.value.toLocaleString()})`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '24px',
      marginBottom: '32px'
    }}>
      {/* Enrollment vs Capacity Chart */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          📊 Enrollment vs Capacity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
            <Bar dataKey="enrolled" fill="#10b981" name="Enrolled" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Event Status Distribution */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🎯 Event Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Analysis */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          💰 Revenue Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="potential" 
              stackId="1"
              stroke="#e5e7eb" 
              fill="#f3f4f6" 
              name="Potential Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1"
              stroke="#10b981" 
              fill="#10b981" 
              name="Actual Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Instrument Usage */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🔧 Instrument Usage
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={instrumentData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              type="number"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              type="category"
              dataKey="instrument"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              formatter={(value, name) => [value, 'Events using this instrument']}
              labelStyle={{ color: '#111827' }}
            />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventAnalytics;