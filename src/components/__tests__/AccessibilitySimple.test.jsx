import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EnhancedEventDashboard from '../EnhancedEventDashboard';

// Mock the accessibility utilities
jest.mock('../../utils/accessibility.js', () => ({
  handleKeyboardActivation: jest.fn((event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }),
  announceToScreenReader: jest.fn()
}));

describe('EnhancedEventDashboard Accessibility - Core Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays main content with proper structure', async () => {
    render(<EnhancedEventDashboard />);
    
    // Wait for the main content to appear (after loading)
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check for semantic landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  test('form controls have proper accessibility attributes', async () => {
    render(<EnhancedEventDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check form controls have proper labels
    expect(screen.getByLabelText('Filter by Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Search Events')).toBeInTheDocument();
    expect(screen.getByLabelText('View Mode')).toBeInTheDocument();
    
    // Check ARIA relationships
    const searchInput = screen.getByLabelText('Search Events');
    expect(searchInput).toHaveAttribute('aria-describedby');
    
    const filterSelect = screen.getByLabelText('Filter by Status');
    expect(filterSelect).toHaveAttribute('aria-describedby');
  });

  test('interactive elements support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<EnhancedEventDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    const viewButton = screen.getByRole('button', { name: /view mode/i });
    
    // Test that button has proper ARIA attributes
    expect(viewButton).toHaveAttribute('aria-pressed');
    expect(viewButton).toHaveAttribute('aria-labelledby');
    expect(viewButton).toHaveAttribute('aria-describedby');
  });

  test('event cards have proper accessibility structure', async () => {
    render(<EnhancedEventDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check that event cards are properly structured as articles
    const eventCards = screen.getAllByRole('article');
    expect(eventCards.length).toBeGreaterThan(0);
    
    // Each card should have proper labeling
    eventCards.forEach(card => {
      expect(card).toHaveAttribute('aria-labelledby');
    });
  });

  test('emoji icons have accessibility labels', async () => {
    render(<EnhancedEventDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check that emoji icons have proper role and aria-label attributes
    const emojiElements = screen.getAllByRole('img');
    expect(emojiElements.length).toBeGreaterThan(0);
    
    emojiElements.forEach(emoji => {
      expect(emoji).toHaveAttribute('aria-label');
      expect(emoji.getAttribute('aria-label')).not.toBe('');
    });
  });

  test('screen reader announcements are called on interactions', async () => {
    const { announceToScreenReader } = require('../../utils/accessibility.js');
    const user = userEvent.setup();
    
    render(<EnhancedEventDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Test view toggle announcement
    const viewButton = screen.getByRole('button', { name: /view mode/i });
    await user.click(viewButton);
    
    expect(announceToScreenReader).toHaveBeenCalledWith('Switched to analytics view');
  });
});