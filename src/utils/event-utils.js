// Utility functions for event processing

/**
 * Normalize training type titles to a standard format
 * @param {string} title - The training type title
 * @returns {string} - Normalized training type
 */
export function normalizeTrainingType(title) {
  const map = {
    "hybrid": "Essential – Hybrid",
    "essential": "Essential – In-Person",
    "advanced": "Advanced – In-Person",
    "virtual": "Virtual Training",
    "equine": "Specialty – Equine",
    "orthotic": "Specialty – Orthotic",
    "credential": "Credential Series"
  };

  for (const key in map) {
    if (title.toLowerCase().includes(key)) return map[key];
  }
  return "Uncategorized";
}

/**
 * Summarize instruments from orders
 * @param {Array} orders - List of orders
 * @returns {Object} - Summary of instruments and total count
 */
export function summarizeInstruments(orders) {
  const summary = {};
  let total = 0;

  // Defensive check: ensure orders is an array
  if (!Array.isArray(orders)) {
    console.warn('summarizeInstruments: orders is not an array:', orders);
    return { summary, total };
  }

  orders.forEach(order => {
    // Check for both line_items (gtu-helpers format) and items (event-utils format)
    const items = order && (order.line_items || order.items);
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        if (item && item.name) {
          summary[item.name] = (summary[item.name] || 0) + (item.quantity || 0);
          total += item.quantity || 0;
        }
      });
    }
  });

  return { summary, total };
}

/**
 * Format event date to a readable string
 * @param {string} date - Event date in ISO format
 * @returns {string} - Formatted date
 */
export function formatEventDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

/**
 * Calculate capacity metrics for an event
 * @param {number} attendees - Number of attendees
 * @param {number} maxAttendees - Maximum capacity
 * @returns {Object} - Capacity metrics
 */
export function calculateCapacityMetrics(attendees, maxAttendees) {
  const percentage = (attendees / maxAttendees) * 100;
  const status = percentage >= 100 ? 'Full' : 'Available';
  return { percentage, status };
}

/**
 * Get danger zone status based on event metrics
 * @param {Object} metrics - Event metrics
 * @returns {boolean} - Danger zone status
 */
export function getDangerZoneStatus(metrics) {
  return metrics.percentage >= 90;
}

/**
 * Get enrolled students for an event
 * @param {Array} students - List of students
 * @returns {Array} - Enrolled students
 */
export function getEnrolledStudents(students) {
  return students.filter(student => student.enrolled);
}

/**
 * Merge license data with event data
 * @param {Array} events - List of events
 * @param {Array} licenses - List of licenses
 * @returns {Array} - Merged data
 */
export function mergeLicenseData(events, licenses) {
  // Defensive checks: ensure both parameters are arrays
  if (!Array.isArray(events)) {
    console.warn('mergeLicenseData: events is not an array:', events);
    return [];
  }
  if (!Array.isArray(licenses)) {
    console.warn('mergeLicenseData: licenses is not an array:', licenses);
    return events;
  }

  return events.map(event => {
    const license = licenses.find(lic => lic && lic.eventId === event?.id);
    return { ...event, license };
  });
}
