/**
 * API Service Layer for Graston Training & Events Command Center
 * Handles all external API integrations and data fetching
 */

// API Configuration
const API_CONFIG = {
  wordpress: {
    baseUrl: process.env.REACT_APP_WP_API_URL || 'https://your-wp-site.com/wp-json/wp/v2',
    auth: {
      username: process.env.REACT_APP_WP_USERNAME,
      password: process.env.REACT_APP_WP_APP_PASSWORD
    }
  },
  woocommerce: {
    baseUrl: process.env.REACT_APP_WC_API_URL || 'https://your-wp-site.com/wp-json/wc/v3',
    auth: {
      consumer_key: process.env.REACT_APP_WC_CONSUMER_KEY,
      consumer_secret: process.env.REACT_APP_WC_CONSUMER_SECRET
    }
  },
  learndash: {
    baseUrl: process.env.REACT_APP_LD_API_URL || 'https://your-wp-site.com/wp-json/ldlms/v2',
    auth: {
      username: process.env.REACT_APP_LD_USERNAME,
      password: process.env.REACT_APP_LD_PASSWORD
    }
  },
  wpfusion: {
    baseUrl: process.env.REACT_APP_WPF_API_URL || 'https://your-wp-site.com/wp-json/wp-fusion/v1',
    auth: {
      api_key: process.env.REACT_APP_WPF_API_KEY
    }
  },
  fluentcrm: {
    baseUrl: process.env.REACT_APP_FCRM_API_URL || 'https://your-wp-site.com/wp-json/fluent-crm/v2',
    auth: {
      api_key: process.env.REACT_APP_FCRM_API_KEY
    }
  },
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY
  }
};

/**
 * Base API client with error handling and retry logic
 */
class ApiClient {
  constructor(config) {
    this.config = config;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers
      },
      ...options
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API request failed (attempt ${attempt}/${this.retryAttempts}):`, error);
        
        if (attempt === this.retryAttempts) {
          throw new ApiError(error.message, endpoint, error);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  getAuthHeaders() {
    if (this.config.auth.username && this.config.auth.password) {
      // Basic Auth for WordPress
      const credentials = btoa(`${this.config.auth.username}:${this.config.auth.password}`);
      return { 'Authorization': `Basic ${credentials}` };
    }
    
    if (this.config.auth.api_key) {
      // API Key auth
      return { 'X-API-Key': this.config.auth.api_key };
    }
    
    if (this.config.auth.consumer_key && this.config.auth.consumer_secret) {
      // WooCommerce OAuth (simplified - in production use proper OAuth flow)
      const credentials = btoa(`${this.config.auth.consumer_key}:${this.config.auth.consumer_secret}`);
      return { 'Authorization': `Basic ${credentials}` };
    }
    
    return {};
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, endpoint, originalError) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.originalError = originalError;
  }
}

/**
 * WordPress API Service
 */
class WordPressApi extends ApiClient {
  constructor() {
    super(API_CONFIG.wordpress);
  }

  async getEvents() {
    // Assuming events are stored as custom post type 'graston_event'
    return this.request('/graston_event?per_page=100&status=publish');
  }

  async getEvent(id) {
    return this.request(`/graston_event/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/graston_event', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/graston_event/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  }

  async deleteEvent(id) {
    return this.request(`/graston_event/${id}`, {
      method: 'DELETE'
    });
  }

  async getUsers() {
    return this.request('/users?per_page=100');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }
}

/**
 * WooCommerce API Service
 */
class WooCommerceApi extends ApiClient {
  constructor() {
    super(API_CONFIG.woocommerce);
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers?${queryString}`);
  }

  async getEventOrders(eventId) {
    // Get orders for specific event product
    return this.getOrders({ 
      product: eventId,
      status: 'completed',
      per_page: 100 
    });
  }
}

/**
 * LearnDash API Service
 */
class LearnDashApi extends ApiClient {
  constructor() {
    super(API_CONFIG.learndash);
  }

  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async getGroups() {
    return this.request('/groups');
  }

  async getGroup(id) {
    return this.request(`/groups/${id}`);
  }

  async getGroupUsers(groupId) {
    return this.request(`/groups/${groupId}/users`);
  }

  async getUserProgress(userId, courseId) {
    return this.request(`/users/${userId}/courses/${courseId}/progress`);
  }

  async enrollUserInGroup(userId, groupId) {
    return this.request(`/groups/${groupId}/users`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    });
  }
}

/**
 * WP Fusion API Service
 */
class WPFusionApi extends ApiClient {
  constructor() {
    super(API_CONFIG.wpfusion);
  }

  async getTags() {
    return this.request('/tags');
  }

  async getUserTags(userId) {
    return this.request(`/users/${userId}/tags`);
  }

  async applyTags(userId, tags) {
    return this.request(`/users/${userId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags })
    });
  }

  async removeTags(userId, tags) {
    return this.request(`/users/${userId}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tags })
    });
  }
}

/**
 * FluentCRM API Service
 */
class FluentCRMApi extends ApiClient {
  constructor() {
    super(API_CONFIG.fluentcrm);
  }

  async getContacts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/contacts?${queryString}`);
  }

  async getContact(id) {
    return this.request(`/contacts/${id}`);
  }

  async createContact(contactData) {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  async updateContact(id, contactData) {
    return this.request(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  }

  async getContactActivity(contactId) {
    return this.request(`/contacts/${contactId}/activities`);
  }

  async getLists() {
    return this.request('/lists');
  }

  async addContactToList(contactId, listId) {
    return this.request(`/lists/${listId}/contacts`, {
      method: 'POST',
      body: JSON.stringify({ contact_id: contactId })
    });
  }
}

/**
 * Unified Event Service
 * Combines data from multiple sources to create comprehensive event records
 */
class EventService {
  constructor() {
    this.wpApi = new WordPressApi();
    this.wcApi = new WooCommerceApi();
    this.ldApi = new LearnDashApi();
    this.wpfApi = new WPFusionApi();
    this.fcrmApi = new FluentCRMApi();
  }

  /**
   * Get comprehensive event data from all sources
   */
  async getEnhancedEvents() {
    try {
      // Fetch data from all sources in parallel
      const [
        wpEvents,
        wcOrders,
        ldGroups,
        fcrmContacts
      ] = await Promise.all([
        this.wpApi.getEvents(),
        this.wcApi.getOrders({ per_page: 100 }),
        this.ldApi.getGroups(),
        this.fcrmApi.getContacts({ per_page: 100 })
      ]);

      // Combine and enhance event data
      return this.combineEventData(wpEvents, wcOrders, ldGroups, fcrmContacts);
    } catch (error) {
      console.error('Failed to fetch enhanced events:', error);
      throw new ApiError('Failed to load event data from multiple sources', 'enhanced-events', error);
    }
  }

  /**
   * Combine data from multiple sources into unified event records
   */
  combineEventData(wpEvents, wcOrders, ldGroups, fcrmContacts) {
    return wpEvents.map(event => {
      // Find related WooCommerce orders
      const relatedOrders = wcOrders.filter(order => 
        order.line_items.some(item => item.product_id === event.product_id)
      );

      // Find related LearnDash group
      const relatedGroup = ldGroups.find(group => 
        group.meta?.event_id === event.id
      );

      // Calculate enrollment metrics
      const enrolled = relatedOrders.length;
      const capacity = event.meta?.capacity || 20;
      const capacityPercentage = (enrolled / capacity) * 100;

      // Determine status
      let status = 'active';
      if (enrolled >= capacity) {
        status = 'full';
      } else if (capacityPercentage < 30 && this.isDangerZone(event)) {
        status = 'at-risk';
      }

      return {
        ...event,
        enrolled,
        capacity,
        capacityPercentage,
        status,
        orders: relatedOrders,
        group: relatedGroup,
        // Add danger zone calculation
        dangerZone: this.calculateDangerZone(event, enrolled, capacity),
        // Add recent activity
        recentActivity: this.getRecentActivity(relatedOrders, fcrmContacts)
      };
    });
  }

  /**
   * Calculate Danger Zone risk level
   */
  calculateDangerZone(event, enrolled, capacity) {
    const eventDate = new Date(event.meta?.event_date);
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    const enrollmentPercentage = (enrolled / capacity) * 100;
    
    // Risk calculation logic
    if (enrollmentPercentage < 50 && daysUntilEvent <= 14) {
      return {
        level: 'high',
        color: 'red',
        message: 'At Risk - Low enrollment with event approaching'
      };
    } else if (enrollmentPercentage < 70 && daysUntilEvent <= 30) {
      return {
        level: 'medium',
        color: 'orange',
        message: 'Warning - Below target enrollment'
      };
    } else {
      return {
        level: 'low',
        color: 'green',
        message: 'Healthy - On track'
      };
    }
  }

  /**
   * Check if event is in danger zone
   */
  isDangerZone(event) {
    const eventDate = new Date(event.meta?.event_date);
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    return daysUntilEvent <= 30; // Events within 30 days are monitored
  }

  /**
   * Get recent activity for an event
   */
  getRecentActivity(orders, contacts) {
    const recentOrders = orders
      .filter(order => {
        const orderDate = new Date(order.date_created);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      })
      .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

    return {
      recentEnrollments: recentOrders.length,
      lastEnrollment: recentOrders[0]?.date_created || null,
      enrollmentVelocity: this.calculateEnrollmentVelocity(orders)
    };
  }

  /**
   * Calculate enrollment velocity (enrollments per week)
   */
  calculateEnrollmentVelocity(orders) {
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(order => 
      new Date(order.date_created) >= fourWeeksAgo
    );

    return recentOrders.length / 4; // Average per week
  }
}

/**
 * Mock data fallback for development
 */
class MockEventService {
  async getEnhancedEvents() {
    // Return enhanced mock data that matches the real API structure
    const mockEvents = [
      {
        id: 1,
        title: 'GT1 Basic Training - Chicago',
        meta: {
          event_date: '2024-10-15',
          location: 'Chicago, IL',
          instructor: 'Dr. Sarah Johnson',
          capacity: 20
        },
        enrolled: 18,
        capacity: 20,
        capacityPercentage: 90,
        status: 'full',
        dangerZone: {
          level: 'low',
          color: 'green',
          message: 'Healthy - On track'
        },
        recentActivity: {
          recentEnrollments: 3,
          lastEnrollment: '2024-09-01T10:30:00Z',
          enrollmentVelocity: 2.5
        }
      },
      {
        id: 2,
        title: 'GT2 Advanced Training - New York',
        meta: {
          event_date: '2024-10-22',
          location: 'New York, NY',
          instructor: 'Dr. Michael Chen',
          capacity: 15
        },
        enrolled: 6,
        capacity: 15,
        capacityPercentage: 40,
        status: 'at-risk',
        dangerZone: {
          level: 'high',
          color: 'red',
          message: 'At Risk - Low enrollment with event approaching'
        },
        recentActivity: {
          recentEnrollments: 1,
          lastEnrollment: '2024-08-28T14:15:00Z',
          enrollmentVelocity: 0.75
        }
      }
    ];

    return mockEvents;
  }
}

// Export services
export {
  ApiError,
  WordPressApi,
  WooCommerceApi,
  LearnDashApi,
  WPFusionApi,
  FluentCRMApi,
  EventService,
  MockEventService
};

// Default export for main event service
export default process.env.NODE_ENV === 'development' ? MockEventService : EventService;