import React from 'react';

const ErrorMessage = ({ 
  title = 'Error', 
  message, 
  onRetry, 
  onDismiss,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const typeStyles = {
    error: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca',
      iconColor: '#dc2626',
      textColor: '#7f1d1d',
      icon: '❌'
    },
    warning: {
      backgroundColor: '#fffbeb',
      borderColor: '#fed7aa',
      iconColor: '#d97706',
      textColor: '#92400e',
      icon: '⚠️'
    },
    info: {
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe',
      iconColor: '#2563eb',
      textColor: '#1e40af',
      icon: 'ℹ️'
    }
  };

  const style = typeStyles[type] || typeStyles.error;

  return (
    <div style={{
      backgroundColor: style.backgroundColor,
      border: `1px solid ${style.borderColor}`,
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          fontSize: '1.25rem',
          flexShrink: 0
        }}>
          {style.icon}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: style.textColor,
            margin: '0 0 8px 0'
          }}>
            {title}
          </h3>
          
          {message && (
            <p style={{
              fontSize: '0.875rem',
              color: style.textColor,
              margin: '0 0 16px 0',
              lineHeight: '1.5'
            }}>
              {message}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  backgroundColor: style.iconColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                🔄 Retry
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                style={{
                  backgroundColor: 'transparent',
                  color: style.textColor,
                  border: `1px solid ${style.borderColor}`,
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ✕ Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;