# API Documentation

This document outlines the API structure for the Graston Event Dashboard. Currently, the application uses mock data, but this documentation serves as a specification for future API integration.

## 📋 Overview

The dashboard requires the following data endpoints to function properly:

- **Events**: Training event information
- **Analytics**: Statistical data for charts and metrics
- **Notifications**: Real-time alerts and updates
- **Export**: Data export functionality

## 🔗 Base URL

```
https://api.graston-events.com/v1
```

## 🔐 Authentication

All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer <your-access-token>
```

## 📊 Endpoints

### Events

#### Get All Events
```http
GET /events
```

**Query Parameters:**
- `status` (optional): Filter by event status (`active`, `full`, `cancelled`)
- `search` (optional): Search events by title or description
- `limit` (optional): Number of events to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "evt_123",
      "title": "Graston Technique M1 - Basic",
      "description": "Introduction to Graston Technique fundamentals",
      "date": "2024-02-15T09:00:00Z",
      "endDate": "2024-02-16T17:00:00Z",
      "location": {
        "name": "Graston Training Center",
        "address": "123 Training St, Indianapolis, IN 46240",
        "coordinates": {
          "lat": 39.7684,
          "lng": -86.1581
        }
      },
      "capacity": 30,
      "enrolled": 25,
      "waitlist": 5,
      "status": "active",
      "instructor": {
        "id": "inst_456",
        "name": "Dr. Sarah Johnson",
        "email": "sarah.johnson@graston.com",
        "bio": "Certified Graston instructor with 10+ years experience"
      },
      "trainingType": "essential",
      "price": 1299.00,
      "currency": "USD",
      "requirements": [
        "Healthcare professional license",
        "Basic anatomy knowledge"
      ],
      "materials": [
        "Graston instruments set",
        "Training manual",
        "Certificate of completion"
      ],
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Get Single Event
```http
GET /events/{eventId}
```

**Response:**
```json
{
  "data": {
    "id": "evt_123",
    "title": "Graston Technique M1 - Basic",
    // ... full event object
    "enrollments": [
      {
        "id": "enr_789",
        "userId": "usr_101",
        "userName": "John Smith",
        "userEmail": "john.smith@email.com",
        "enrolledAt": "2024-01-10T09:00:00Z",
        "status": "confirmed",
        "paymentStatus": "paid"
      }
    ]
  }
}
```

#### Create Event
```http
POST /events
```

**Request Body:**
```json
{
  "title": "Graston Technique M2 - Advanced",
  "description": "Advanced Graston Technique training",
  "date": "2024-03-15T09:00:00Z",
  "endDate": "2024-03-16T17:00:00Z",
  "location": {
    "name": "Advanced Training Center",
    "address": "456 Advanced St, Indianapolis, IN 46240"
  },
  "capacity": 25,
  "instructorId": "inst_456",
  "trainingType": "advanced",
  "price": 1599.00,
  "requirements": ["M1 certification", "6 months experience"]
}
```

#### Update Event
```http
PUT /events/{eventId}
```

#### Delete Event
```http
DELETE /events/{eventId}
```

### Analytics

#### Get Dashboard Analytics
```http
GET /analytics/dashboard
```

**Query Parameters:**
- `period` (optional): Time period (`7d`, `30d`, `90d`, `1y`) (default: `30d`)
- `eventType` (optional): Filter by training type

**Response:**
```json
{
  "data": {
    "summary": {
      "totalEvents": 45,
      "totalEnrolled": 1250,
      "capacityUtilization": 0.83,
      "fullEvents": 12,
      "revenue": 156750.00
    },
    "trends": {
      "enrollmentTrend": [
        {
          "date": "2024-01-01",
          "enrolled": 25,
          "capacity": 30
        }
      ],
      "revenueTrend": [
        {
          "date": "2024-01-01",
          "revenue": 5200.00
        }
      ]
    },
    "breakdown": {
      "byTrainingType": [
        {
          "type": "essential",
          "count": 20,
          "enrolled": 600,
          "revenue": 77940.00
        }
      ],
      "byLocation": [
        {
          "location": "Indianapolis",
          "count": 15,
          "enrolled": 450
        }
      ]
    }
  }
}
```

#### Get Event Analytics
```http
GET /analytics/events/{eventId}
```

### Notifications

#### Get Notifications
```http
GET /notifications
```

**Query Parameters:**
- `unread` (optional): Filter unread notifications (`true`, `false`)
- `type` (optional): Filter by notification type

**Response:**
```json
{
  "data": [
    {
      "id": "not_123",
      "type": "event_full",
      "title": "Event Full",
      "message": "Graston M1 Basic training is now full",
      "eventId": "evt_123",
      "read": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Mark Notification as Read
```http
PUT /notifications/{notificationId}/read
```

### Export

#### Export Events Data
```http
GET /export/events
```

**Query Parameters:**
- `format`: Export format (`csv`, `xlsx`, `json`)
- `fields` (optional): Comma-separated list of fields to include
- `filter` (optional): Same filters as GET /events

**Response:**
- For CSV/XLSX: File download
- For JSON: Structured data response

## 📝 Data Models

### Event Model
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601
  endDate: string; // ISO 8601
  location: Location;
  capacity: number;
  enrolled: number;
  waitlist: number;
  status: 'active' | 'full' | 'cancelled' | 'completed';
  instructor: Instructor;
  trainingType: 'essential' | 'advanced' | 'virtual' | 'specialty';
  price: number;
  currency: string;
  requirements: string[];
  materials: string[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Location Model
```typescript
interface Location {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

### Instructor Model
```typescript
interface Instructor {
  id: string;
  name: string;
  email: string;
  bio?: string;
  certifications?: string[];
}
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "capacity",
        "message": "Capacity must be greater than 0"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Invalid request data
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (e.g., duplicate event)
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## 🔄 Rate Limiting

API requests are limited to:
- **Standard endpoints**: 1000 requests per hour
- **Export endpoints**: 10 requests per hour
- **Analytics endpoints**: 100 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📡 WebSocket Events

For real-time updates, connect to:
```
wss://api.graston-events.com/v1/ws
```

### Event Types
- `event.created`: New event created
- `event.updated`: Event details changed
- `event.enrollment`: New enrollment or cancellation
- `event.full`: Event reached capacity
- `notification.new`: New notification

### Message Format
```json
{
  "type": "event.enrollment",
  "data": {
    "eventId": "evt_123",
    "enrolled": 26,
    "capacity": 30
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## 🧪 Testing

### Mock Data
During development, the application uses mock data that follows this API specification. Mock responses can be found in:
- `src/mockData/events.js`
- `src/mockData/analytics.js`
- `src/mockData/notifications.js`

### API Testing
When implementing the real API:
1. Use the provided data models
2. Follow the error handling format
3. Implement proper authentication
4. Add rate limiting
5. Include comprehensive logging

---

This API specification serves as the contract between the frontend dashboard and the backend services. All endpoints should be implemented following RESTful principles and include proper error handling, validation, and documentation.