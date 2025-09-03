import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnhancedEventDashboard from '../EnhancedEventDashboard';

// Mock the child components
jest.mock('../EventAnalytics', () => {
  return function MockEventAnalytics() {
    return <div data-testid="event-analytics">Event Analytics</div>;
  };
});

jest.mock('../ExportTools', () => {
  return function MockExportTools() {
    return <div data-testid="export-tools">Export Tools</div>;
  };
});

jest.mock('../NotificationSystem', () => {
  return function MockNotificationSystem() {
    return <div data-testid="notification-system">Notification System</div>;
  };
});

describe('EnhancedEventDashboard', () => {
  test('shows loading spinner initially', () => {
    render(<EnhancedEventDashboard />);
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  test('renders dashboard after loading', async () => {
    render(<EnhancedEventDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Check if main dashboard elements are present
    expect(screen.getByText('Graston Event Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('Total Enrolled')).toBeInTheDocument();
  });

  test('can toggle between list and analytics view', async () => {
    const user = userEvent.setup();
    render(<EnhancedEventDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Should start in list view
    expect(screen.queryByTestId('event-analytics')).not.toBeInTheDocument();
    
    // Click analytics toggle
    const analyticsButton = screen.getByText('📊 Analytics');
    await user.click(analyticsButton);
    
    // Should now show analytics
    expect(screen.getByTestId('event-analytics')).toBeInTheDocument();
    
    // Click back to list view
    const listButton = screen.getByText('📋 Event List');
    await user.click(listButton);
    
    // Should be back to list view
    expect(screen.queryByTestId('event-analytics')).not.toBeInTheDocument();
  });

  test('can filter events by status', async () => {
    const user = userEvent.setup();
    render(<EnhancedEventDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Find and click the filter dropdown
    const filterSelect = screen.getByDisplayValue('All Events');
    await user.selectOptions(filterSelect, 'open');
    
    // Verify filter was applied (this would need to be more specific based on actual implementation)
    expect(filterSelect.value).toBe('open');
  });

  test('can search events', async () => {
    const user = userEvent.setup();
    render(<EnhancedEventDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Find and use the search input
    const searchInput = screen.getByPlaceholderText(/search events/i);
    await user.type(searchInput, 'test search');
    
    expect(searchInput.value).toBe('test search');
  });

  test('displays notification system', async () => {
    render(<EnhancedEventDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByTestId('notification-system')).toBeInTheDocument();
  });
});