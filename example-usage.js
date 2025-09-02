// example-usage.js
// Example of how to use the dynamic API configuration

import { buildApiUrl, API_CONFIG } from './src/utils/api-config.js';

console.log('🔥 Dynamic API Endpoint Examples:');
console.log('=====================================');

// Your specific example: /gted/v1/events/{id}/attendees
const eventId = '12345';
const attendeesUrl = buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_ATTENDEES, { id: eventId });

console.log('\n✅ Attendees Endpoint:');
console.log(`Template: ${API_CONFIG.ENDPOINTS.EVENT_ATTENDEES}`);
console.log(`Code: buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_ATTENDEES, { id: '${eventId}' })`);
console.log(`Result: ${attendeesUrl}`);

// Environment variable example (recommended for production)
console.log('\n🔧 With Environment Variables:');
console.log('VITE_API_BASE=https://your-api.com');
console.log('VITE_ATTENDEES_ENDPOINT=/gted/v1/events/{id}/attendees');
console.log('');
console.log('// In your code:');
console.log('const apiBase = import.meta.env.VITE_API_BASE;');
console.log('const endpoint = import.meta.env.VITE_ATTENDEES_ENDPOINT;');
console.log('const url = `${apiBase}${endpoint.replace(\'{id}\', eventId)}`;');

// Other examples
const groupId = '67890';
const ordersUrl = buildApiUrl(API_CONFIG.ENDPOINTS.WOOCOMMERCE_ORDERS, { eventId });
const learndashUrl = buildApiUrl(API_CONFIG.ENDPOINTS.LEARNDASH_USERS, { groupId });

console.log('\n📚 Additional Examples:');
console.log(`WooCommerce Orders: ${ordersUrl}`);
console.log(`LearnDash Users: ${learndashUrl}`);
console.log(`Event Details: ${buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_DETAILS, { id: eventId })}`);

console.log('\n🎉 Dynamic ID replacement confirmed working!');
