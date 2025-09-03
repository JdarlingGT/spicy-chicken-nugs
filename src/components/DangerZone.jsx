import React, { useState, useEffect } from 'react';

/**
 * Danger Zone Risk Intelligence Component
 * Displays risk assessment and early warning system for training events
 */
const DangerZone = ({ events }) => {
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30'); // days

  useEffect(() => {
    if (events && events.length > 0) {
      const analysis = analyzeRisks(events, parseInt(selectedTimeframe));
      setRiskAnalysis(analysis);
    }
  }, [events, selectedTimeframe]);

  if (!riskAnalysis) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading risk analysis...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '8px'
        }}>
          <span role="img" aria-label="Warning">⚠️</span> Danger Zone Risk Intelligence
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Early warning system for at-risk training events
        </p>
      </div>

      {/* Timeframe Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label 
          htmlFor="timeframe-select"
          style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '4px'
          }}
        >
          Analysis Timeframe
        </label>
        <select
          id="timeframe-select"
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="14">Next 14 days</option>
          <option value="30">Next 30 days</option>
          <option value="60">Next 60 days</option>
          <option value="90">Next 90 days</option>
        </select>
      </div>

      {/* Risk Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <RiskSummaryCard
          title="High Risk"
          count={riskAnalysis.highRisk.length}
          color="red"
          icon="🔴"
          description="Immediate attention required"
        />
        <RiskSummaryCard
          title="Medium Risk"
          count={riskAnalysis.mediumRisk.length}
          color="orange"
          icon="🟠"
          description="Monitor closely"
        />
        <RiskSummaryCard
          title="Low Risk"
          count={riskAnalysis.lowRisk.length}
          color="green"
          icon="🟢"
          description="On track"
        />
        <RiskSummaryCard
          title="Revenue at Risk"
          count={`$${riskAnalysis.revenueAtRisk.toLocaleString()}`}
          color="purple"
          icon="💰"
          description="Potential lost revenue"
        />
      </div>

      {/* High Risk Events Alert */}
      {riskAnalysis.highRisk.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#dc2626',
            marginBottom: '12px'
          }}>
            <span role="img" aria-label="Alert">🚨</span> Immediate Action Required
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {riskAnalysis.highRisk.map(event => (
              <HighRiskEventAlert key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Risk Analysis Details */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px'
      }}>
        {/* Risk Factors Analysis */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Risk Factors Analysis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {riskAnalysis.riskFactors.map((factor, index) => (
              <RiskFactor key={index} factor={factor} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Recommended Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {riskAnalysis.recommendations.map((rec, index) => (
              <Recommendation key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Event List */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '16px'
        }}>
          Event Risk Details
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...riskAnalysis.highRisk, ...riskAnalysis.mediumRisk].map(event => (
            <EventRiskCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Risk Summary Card Component
 */
const RiskSummaryCard = ({ title, count, color, icon, description }) => {
  const colorStyles = {
    red: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
    orange: { bg: '#fefce8', border: '#fde047', text: '#a16207' },
    green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
    purple: { bg: '#faf5ff', border: '#e9d5ff', text: '#7c3aed' }
  };

  const style = colorStyles[color];

  return (
    <div style={{
      backgroundColor: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
        <span role="img" aria-label={title}>{icon}</span>
      </div>
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: style.text,
        marginBottom: '4px'
      }}>
        {count}
      </div>
      <div style={{ 
        fontSize: '0.875rem', 
        fontWeight: '600', 
        color: '#374151',
        marginBottom: '2px'
      }}>
        {title}
      </div>
      <div style={{ 
        fontSize: '0.75rem', 
        color: '#6b7280'
      }}>
        {description}
      </div>
    </div>
  );
};

/**
 * High Risk Event Alert Component
 */
const HighRiskEventAlert = ({ event }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: 'white',
      border: '1px solid #fecaca',
      borderRadius: '6px'
    }}>
      <div>
        <span style={{ fontWeight: '600', color: '#dc2626' }}>
          {event.title}
        </span>
        <span style={{ marginLeft: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
          {event.enrolled}/{event.capacity} enrolled • {event.daysUntilEvent} days left
        </span>
      </div>
      <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '500' }}>
        {event.dangerZone.message}
      </div>
    </div>
  );
};

/**
 * Risk Factor Component
 */
const RiskFactor = ({ factor }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: factor.severity === 'high' ? '#dc2626' : 
                        factor.severity === 'medium' ? '#f59e0b' : '#10b981'
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
          {factor.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          {factor.description}
        </div>
      </div>
      <div style={{ 
        fontSize: '0.75rem', 
        fontWeight: '600',
        color: factor.severity === 'high' ? '#dc2626' : 
              factor.severity === 'medium' ? '#f59e0b' : '#10b981'
      }}>
        {factor.impact}
      </div>
    </div>
  );
};

/**
 * Recommendation Component
 */
const Recommendation = ({ recommendation }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
      <div style={{ fontSize: '0.875rem', marginTop: '2px' }}>
        <span role="img" aria-label="Recommendation">{recommendation.icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
          {recommendation.action}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
          {recommendation.description}
        </div>
      </div>
      <div style={{ 
        fontSize: '0.75rem', 
        fontWeight: '600',
        color: recommendation.priority === 'high' ? '#dc2626' : 
              recommendation.priority === 'medium' ? '#f59e0b' : '#10b981'
      }}>
        {recommendation.priority.toUpperCase()}
      </div>
    </div>
  );
};

/**
 * Event Risk Card Component
 */
const EventRiskCard = ({ event }) => {
  const riskColor = event.dangerZone.level === 'high' ? '#dc2626' : '#f59e0b';
  const riskBg = event.dangerZone.level === 'high' ? '#fef2f2' : '#fefce8';

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
            {event.title}
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>
            {event.location} • {event.instructor} • {formatDate(event.date)}
          </p>
        </div>
        <div style={{
          backgroundColor: riskBg,
          color: riskColor,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {event.dangerZone.level.toUpperCase()} RISK
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Enrollment</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
            {event.enrolled}/{event.capacity} ({Math.round(event.capacityPercentage)}%)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Days Left</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
            {event.daysUntilEvent}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Velocity</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
            {event.recentActivity?.enrollmentVelocity?.toFixed(1) || '0'}/week
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Revenue Risk</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: riskColor }}>
            ${event.revenueAtRisk?.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Risk Assessment</div>
        <div style={{ fontSize: '0.875rem', color: '#374151' }}>
          {event.dangerZone.message}
        </div>
      </div>
    </div>
  );
};

/**
 * Risk Analysis Logic
 */
function analyzeRisks(events, timeframeDays) {
  const today = new Date();
  const cutoffDate = new Date(today.getTime() + timeframeDays * 24 * 60 * 60 * 1000);

  // Filter events within timeframe
  const relevantEvents = events.filter(event => {
    const eventDate = new Date(event.date || event.meta?.event_date);
    return eventDate <= cutoffDate && eventDate >= today;
  });

  // Enhance events with risk calculations
  const enhancedEvents = relevantEvents.map(event => {
    const eventDate = new Date(event.date || event.meta?.event_date);
    const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    const enrollmentPercentage = (event.enrolled / event.capacity) * 100;
    
    // Calculate revenue at risk (assuming $500 per participant)
    const avgRevenuePerParticipant = 500;
    const expectedEnrollment = event.capacity * 0.8; // 80% target
    const shortfall = Math.max(0, expectedEnrollment - event.enrolled);
    const revenueAtRisk = shortfall * avgRevenuePerParticipant;

    return {
      ...event,
      daysUntilEvent,
      enrollmentPercentage,
      revenueAtRisk,
      dangerZone: calculateDangerZone(event, daysUntilEvent, enrollmentPercentage)
    };
  });

  // Categorize by risk level
  const highRisk = enhancedEvents.filter(e => e.dangerZone.level === 'high');
  const mediumRisk = enhancedEvents.filter(e => e.dangerZone.level === 'medium');
  const lowRisk = enhancedEvents.filter(e => e.dangerZone.level === 'low');

  // Calculate total revenue at risk
  const revenueAtRisk = highRisk.reduce((sum, event) => sum + (event.revenueAtRisk || 0), 0);

  // Generate risk factors
  const riskFactors = generateRiskFactors(enhancedEvents);

  // Generate recommendations
  const recommendations = generateRecommendations(highRisk, mediumRisk);

  return {
    highRisk,
    mediumRisk,
    lowRisk,
    revenueAtRisk,
    riskFactors,
    recommendations
  };
}

function calculateDangerZone(event, daysUntilEvent, enrollmentPercentage) {
  // High risk: <50% enrollment with <14 days OR <30% enrollment with <30 days
  if ((enrollmentPercentage < 50 && daysUntilEvent <= 14) || 
      (enrollmentPercentage < 30 && daysUntilEvent <= 30)) {
    return {
      level: 'high',
      color: 'red',
      message: 'Critical - Low enrollment with event approaching'
    };
  }
  
  // Medium risk: <70% enrollment with <30 days OR <50% enrollment with <60 days
  if ((enrollmentPercentage < 70 && daysUntilEvent <= 30) || 
      (enrollmentPercentage < 50 && daysUntilEvent <= 60)) {
    return {
      level: 'medium',
      color: 'orange',
      message: 'Warning - Below target enrollment'
    };
  }
  
  return {
    level: 'low',
    color: 'green',
    message: 'Healthy - On track'
  };
}

function generateRiskFactors(events) {
  const factors = [];
  
  const lowEnrollmentEvents = events.filter(e => e.enrollmentPercentage < 50).length;
  if (lowEnrollmentEvents > 0) {
    factors.push({
      name: 'Low Enrollment Rate',
      description: `${lowEnrollmentEvents} events below 50% capacity`,
      severity: 'high',
      impact: `${lowEnrollmentEvents} events`
    });
  }

  const upcomingEvents = events.filter(e => e.daysUntilEvent <= 14).length;
  if (upcomingEvents > 0) {
    factors.push({
      name: 'Approaching Deadlines',
      description: `${upcomingEvents} events within 14 days`,
      severity: 'medium',
      impact: `${upcomingEvents} events`
    });
  }

  const slowVelocityEvents = events.filter(e => 
    (e.recentActivity?.enrollmentVelocity || 0) < 1
  ).length;
  if (slowVelocityEvents > 0) {
    factors.push({
      name: 'Slow Enrollment Velocity',
      description: `${slowVelocityEvents} events with <1 enrollment/week`,
      severity: 'medium',
      impact: `${slowVelocityEvents} events`
    });
  }

  return factors;
}

function generateRecommendations(highRisk, mediumRisk) {
  const recommendations = [];

  if (highRisk.length > 0) {
    recommendations.push({
      icon: '🚨',
      action: 'Emergency Marketing Campaign',
      description: `Launch targeted ads for ${highRisk.length} high-risk events`,
      priority: 'high'
    });

    recommendations.push({
      icon: '📞',
      action: 'Direct Outreach',
      description: 'Contact past participants and leads via phone/email',
      priority: 'high'
    });

    recommendations.push({
      icon: '💰',
      action: 'Consider Discounts',
      description: 'Offer early-bird pricing or group discounts',
      priority: 'medium'
    });
  }

  if (mediumRisk.length > 0) {
    recommendations.push({
      icon: '📧',
      action: 'Email Campaign',
      description: `Send targeted emails for ${mediumRisk.length} at-risk events`,
      priority: 'medium'
    });

    recommendations.push({
      icon: '📱',
      action: 'Social Media Push',
      description: 'Increase social media promotion and engagement',
      priority: 'medium'
    });
  }

  if (highRisk.length > 2) {
    recommendations.push({
      icon: '📅',
      action: 'Consider Rescheduling',
      description: 'Evaluate moving events to better dates/locations',
      priority: 'low'
    });
  }

  return recommendations;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export default DangerZone;