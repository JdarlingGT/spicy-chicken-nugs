import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '64px'
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: '3px solid #f3f4f6',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    zIndex: 9999,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
        {message && (
          <p style={{
            marginTop: '16px',
            color: '#6b7280',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default LoadingSpinner;