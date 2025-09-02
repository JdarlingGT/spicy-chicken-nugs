// api-config.js
// API configuration for Graston Event Dashboard

// Base API configuration using environment variables
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE || 'https://grastontechnique.com/wp-json',
  API_KEY: import.meta.env.VITE_API_KEY || '',
  ALERT_EMAILS: import.meta.env.VITE_ALERT_EMAILS || '',

  // Endpoints with dynamic placeholders - using environment variables where available
  ENDPOINTS: {
    EVENTS: import.meta.env.VITE_EVENTS_ENDPOINT || '/gted/v1/events',
    EVENT_ATTENDEES: import.meta.env.VITE_ATTENDEES_ENDPOINT || '/gted/v1/events/{id}/attendees',
    EVENT_DETAILS: '/gted/v1/events/{id}',
    DANGER_ZONE: import.meta.env.VITE_DANGER_ZONE_ENDPOINT || '/gted/v1/events/danger-zone',

    // Legacy endpoints for fallback
    LEARNDASH_USERS: '/wp-json/ldlms/v2/groups/{groupId}/users',
    WOOCOMMERCE_ORDERS: import.meta.env.VITE_INSTRUMENTS_ENDPOINT || '/woocommerce/orders?event_id={eventId}',
    LICENSE_LOOKUP: import.meta.env.VITE_LICENSE_LOOKUP_ENDPOINT || '/forms/license-info',

    // Additional endpoints
    LICENSES: '/licenses',
    INSTRUMENTS: '/instruments'
  }
};

/**
 * Build API URL with dynamic parameter replacement and authentication
 * @param {string} endpoint - Endpoint template with {param} placeholders
 * @param {Object} params - Parameters to replace in the endpoint
 * @param {string} baseUrl - Override base URL if needed
 * @returns {string} Complete API URL
 */
export function buildApiUrl(endpoint, params = {}, baseUrl = API_CONFIG.BASE_URL) {
  let url = endpoint;

  // Replace all {param} placeholders with actual values
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, encodeURIComponent(value));
  });

  // Combine with base URL
  const fullUrl = `${baseUrl.replace(/\/$/, '')}${url}`;

  console.log(`🔗 API Call: ${fullUrl}`);
  return fullUrl;
}

/**
 * Get headers with API authentication
 * @returns {Object} Headers object with API key if available
 */
export function getApiHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (API_CONFIG.API_KEY) {
    headers['Authorization'] = `Bearer ${API_CONFIG.API_KEY}`;
    headers['X-API-Key'] = API_CONFIG.API_KEY;
  }

  return headers;
}

/**
 * Enhanced fetch with automatic authentication
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
export async function authenticatedFetch(url, options = {}) {
  const authOptions = {
    ...options,
    headers: {
      ...getApiHeaders(),
      ...options.headers,
    },
  };

  console.log(`🔐 Authenticated API Call: ${url}`);
  return fetch(url, authOptions);
}

/**
 * Fetch attendees for a specific event with authentication
 * @param {string|number} eventId - Event ID
 * @returns {Promise<Array>} Array of attendees
 */
export async function fetchEventAttendees(eventId) {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_ATTENDEES, { id: eventId });

  try {
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch attendees: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching attendees for event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Fetch event details with authentication
 * @param {string|number} eventId - Event ID
 * @returns {Promise<Object>} Event details
 */
export async function fetchEventDetails(eventId) {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_DETAILS, { id: eventId });

  try {
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Fetch all events with authentication
 * @returns {Promise<Array>} Array of events
 */
export async function fetchEvents() {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS);

  try {
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}/**
 * Example usage demonstration
 */
export function demonstrateApiUsage() {
  console.log('🔥 API Configuration Examples:');

  // Example 1: Event attendees
  const eventId = '12345';
  const attendeesUrl = buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_ATTENDEES, { id: eventId });
  console.log(`Event ${eventId} attendees:`, attendeesUrl);

  // Example 2: LearnDash users
  const groupId = '67890';
  const learndashUrl = buildApiUrl(API_CONFIG.ENDPOINTS.LEARNDASH_USERS, { groupId });
  console.log(`LearnDash group ${groupId}:`, learndashUrl);

  // Example 3: WooCommerce orders
  const wooUrl = buildApiUrl(API_CONFIG.ENDPOINTS.WOOCOMMERCE_ORDERS, { eventId });
  console.log(`WooCommerce orders for event ${eventId}:`, wooUrl);

  // Example 4: Static endpoints
  const eventsUrl = buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS);
  console.log('All events:', eventsUrl);
}
