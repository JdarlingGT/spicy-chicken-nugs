import React, { useState, useEffect } from 'react';

const NotificationSystem = ({ events }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotifications = () => {
      const notificationTypes = [
        {
          type: 'enrollment',
          icon: '👥',
          title: 'New Enrollment',
          getMessage: (event) => `New student enrolled in ${event.title}`,
          color: '#10b981'
        },
        {
          type: 'capacity',
          icon: '⚠️',
          title: 'Capacity Alert',
          getMessage: (event) => `${event.title} is ${Math.round((event.enrolled / event.capacity) * 100)}% full`,
          color: '#f59e0b'
        },
        {
          type: 'full',
          icon: '🔴',
          title: 'Event Full',
          getMessage: (event) => `${event.title} has reached maximum capacity`,
          color: '#ef4444'
        },
        {
          type: 'reminder',
          icon: '🔔',
          title: 'Event Reminder',
          getMessage: (event) => `${event.title} starts in 2 days`,
          color: '#3b82f6'
        }
      ];

      const newNotifications = [];
      
      events.forEach(event => {
        // Generate capacity alerts for events over 80%
        if (event.enrolled / event.capacity > 0.8 && event.status !== 'full') {
          newNotifications.push({
            id: `capacity-${event.id}`,
            ...notificationTypes[1],
            message: notificationTypes[1].getMessage(event),
            timestamp: new Date(),
            event: event.title
          });
        }

        // Generate full event notifications
        if (event.status === 'full') {
          newNotifications.push({
            id: `full-${event.id}`,
            ...notificationTypes[2],
            message: notificationTypes[2].getMessage(event),
            timestamp: new Date(),
            event: event.title
          });
        }

        // Simulate random enrollment notifications
        if (Math.random() > 0.7) {
          newNotifications.push({
            id: `enrollment-${event.id}-${Date.now()}`,
            ...notificationTypes[0],
            message: notificationTypes[0].getMessage(event),
            timestamp: new Date(),
            event: event.title
          });
        }
      });

      setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep only latest 10
    };

    // Generate initial notifications
    generateNotifications();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(generateNotifications, 30000);

    return () => clearInterval(interval);
  }, [events]);

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          position: 'relative',
          padding: '8px',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151'
        }}
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '8px',
          width: '400px',
          maxWidth: '90vw',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxHeight: '500px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Notifications ({unreadCount})
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔕</div>
                <p style={{ margin: 0 }}>No new notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    backgroundColor: 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <div style={{
                    fontSize: '1.25rem',
                    flexShrink: 0
                  }}>
                    {notification.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px'
                    }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0
                      }}>
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => clearNotification(notification.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '0',
                          marginLeft: '8px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: '#6b7280',
                      margin: '0 0 4px 0',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      margin: 0
                    }}>
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;