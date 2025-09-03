/**
 * Accessibility utilities for keyboard navigation and screen reader support
 */

/**
 * Handle keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} callback - Function to call when Enter or Space is pressed
 */
export const handleKeyboardActivation = (event, callback) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Set focus to an element by ID
   * @param {string} elementId - The ID of the element to focus
   */
  focusElement: (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  },

  /**
   * Focus the first focusable element within a container
   * @param {HTMLElement} container - The container element
   */
  focusFirstElement: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },

  /**
   * Trap focus within a container (useful for modals)
   * @param {HTMLElement} container - The container to trap focus within
   * @param {KeyboardEvent} event - The keyboard event
   */
  trapFocus: (container, event) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
};

/**
 * Screen reader announcements
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Generate accessible color combinations that meet WCAG contrast requirements
 */
export const colorAccessibility = {
  /**
   * Check if a color combination meets WCAG AA contrast requirements
   * @param {string} foreground - Foreground color (hex)
   * @param {string} background - Background color (hex)
   * @returns {boolean} - Whether the combination meets AA requirements
   */
  meetsContrastRequirement: (foreground, background) => {
    // This is a simplified check - in production, use a proper contrast calculation library
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                    (Math.min(fgLuminance, bgLuminance) + 0.05);
    return contrast >= 4.5; // WCAG AA requirement
  },

  /**
   * Get accessible status colors
   */
  getStatusColors: () => ({
    success: {
      background: '#f0fdf4',
      border: '#bbf7d0',
      text: '#166534'
    },
    warning: {
      background: '#fefce8',
      border: '#fde047',
      text: '#a16207'
    },
    error: {
      background: '#fef2f2',
      border: '#fecaca',
      text: '#dc2626'
    },
    info: {
      background: '#eff6ff',
      border: '#bfdbfe',
      text: '#1e40af'
    }
  })
};

/**
 * Helper function to calculate luminance (simplified)
 * @param {string} color - Hex color string
 * @returns {number} - Luminance value
 */
function getLuminance(color) {
  // Remove # if present
  color = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16) / 255;
  const g = parseInt(color.substr(2, 2), 16) / 255;
  const b = parseInt(color.substr(4, 2), 16) / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * ARIA utilities
 */
export const ariaUtils = {
  /**
   * Generate unique IDs for ARIA relationships
   * @param {string} prefix - Prefix for the ID
   * @returns {string} - Unique ID
   */
  generateId: (prefix = 'aria') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Create ARIA description for complex UI elements
   * @param {Object} options - Description options
   * @returns {string} - ARIA description
   */
  createDescription: ({ type, status, value, total, percentage }) => {
    switch (type) {
      case 'progress':
        return `Progress: ${value} of ${total}, ${percentage}% complete`;
      case 'status':
        return `Status: ${status}`;
      case 'count':
        return `${value} items`;
      default:
        return '';
    }
  }
};

/**
 * Skip link functionality
 */
export const skipLinks = {
  /**
   * Create skip links for better keyboard navigation
   * @param {Array} links - Array of skip link objects {href, text}
   * @returns {HTMLElement} - Skip links container
   */
  createSkipLinks: (links) => {
    const container = document.createElement('div');
    container.className = 'skip-links';
    container.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 1000;
      text-decoration: none;
      border-radius: 4px;
    `;
    
    links.forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.style.cssText = `
        color: #fff;
        text-decoration: none;
        margin-right: 16px;
      `;
      
      // Show on focus
      skipLink.addEventListener('focus', () => {
        container.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        container.style.top = '-40px';
      });
      
      container.appendChild(skipLink);
    });
    
    return container;
  }
};

/**
 * Form accessibility helpers
 */
export const formAccessibility = {
  /**
   * Associate labels with form controls
   * @param {HTMLElement} label - Label element
   * @param {HTMLElement} input - Input element
   */
  associateLabel: (label, input) => {
    const id = ariaUtils.generateId('input');
    input.id = id;
    label.setAttribute('for', id);
  },

  /**
   * Add error message to form field
   * @param {HTMLElement} input - Input element
   * @param {string} errorMessage - Error message text
   */
  addErrorMessage: (input, errorMessage) => {
    const errorId = ariaUtils.generateId('error');
    const errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.textContent = errorMessage;
    errorElement.setAttribute('role', 'alert');
    errorElement.style.color = '#dc2626';
    
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');
    input.parentNode.appendChild(errorElement);
  }
};

/**
 * CSS classes for screen reader only content
 */
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .sr-only-focusable:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;

// Add screen reader styles to document if not already present
if (typeof document !== 'undefined' && !document.getElementById('sr-only-styles')) {
  const style = document.createElement('style');
  style.id = 'sr-only-styles';
  style.textContent = srOnlyStyles;
  document.head.appendChild(style);
}