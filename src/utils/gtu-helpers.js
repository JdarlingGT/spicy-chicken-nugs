// gtu-helpers.js
// Helper functions for Graston event dashboard

/**
 * Normalize training type based on title keywords
 * @param {string} title - The event title
 * @returns {string} Normalized training type
 */
export function normalizeTrainingType(title) {
  const map = {
    "essential": "Essential – In-Person",
    "hybrid": "Essential – Hybrid",
    "advanced": "Advanced – In-Person",
    "virtual": "Virtual Training",
    "equine": "Specialty – Equine",
    "orthotic": "Specialty – Orthotic",
    "credential": "Credential Series"
  };

  for (const [key, label] of Object.entries(map)) {
    if (title.toLowerCase().includes(key)) {
      return label;
    }
  }
  return "Uncategorized";
}

/**
 * Summarize instruments from order line items
 * @param {Array} orders - Array of orders with line_items
 * @returns {Object} Object with summary and total count
 */
export function summarizeInstruments(orders) {
  const summary = {};
  let total = 0;

  orders.forEach(order => {
    if (order.line_items) {
      order.line_items.forEach(item => {
        if (item.name && item.name.toLowerCase().includes('instrument')) {
          summary[item.name] = (summary[item.name] || 0) + (item.quantity || 0);
          total += item.quantity || 0;
        }
      });
    }
  });

  return { summary, total };
}

/**
 * Get enrolled students for an event/group
 * @param {string|number} eventId - Event ID
 * @param {string|number} groupId - Group ID for LearnDash
 * @returns {Promise<Array>} Array of enrolled students
 */
export async function getEnrolledStudents(eventId, groupId) {
  try {
    // Try LearnDash API first
    const res = await fetch(`/wp-json/ldlms/v2/groups/${groupId}/users`);
    if (!res.ok) throw new Error("LearnDash API error");
    return await res.json();
  } catch (err) {
    // Fallback to WooCommerce orders
    try {
      const ordersRes = await fetch(`/orders?event_id=${eventId}`);
      const orders = await ordersRes.json();
      return orders.map(order => ({
        name: `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim(),
        email: order.billing?.email || '',
        source: "WooCommerce"
      }));
    } catch (fallbackErr) {
      console.error("Error fetching enrolled students:", fallbackErr);
      return [];
    }
  }
}

/**
 * Get danger zone status for an event
 * @param {string|number} eventId - Event ID
 * @returns {Promise<string>} Danger zone status
 */
export async function getDangerZoneStatus(eventId) {
  try {
    const res = await fetch(`/events/danger-zone`);
    const data = await res.json();
    const match = data.find(d => d.event_id === eventId);
    return match ? match.status : "Unknown";
  } catch (err) {
    console.error("Error fetching danger zone status:", err);
    return "Unknown";
  }
}

/**
 * Merge license data with student data
 * @param {Array} students - Array of student objects
 * @param {Array} licenses - Array of license objects
 * @returns {Array} Students with merged license data
 */
export function mergeLicenseData(students, licenses) {
  return students.map(student => {
    const license = licenses.find(l => l.email === student.email);
    return {
      ...student,
      license_type: license?.type || "N/A"
    };
  });
}

/**
 * Format event date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatEventDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (err) {
    return 'Invalid Date';
  }
}

/**
 * Calculate event capacity metrics
 * @param {number} enrolled - Number of enrolled students
 * @param {number} capacity - Maximum capacity
 * @returns {Object} Capacity metrics
 */
export function calculateCapacityMetrics(enrolled, capacity) {
  const percentage = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;
  const remaining = Math.max(0, capacity - enrolled);
  const status = percentage >= 90 ? 'full' : percentage >= 70 ? 'filling' : 'available';

  return {
    percentage,
    remaining,
    status,
    enrolled,
    capacity
  };
}
